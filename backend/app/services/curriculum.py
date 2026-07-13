from dataclasses import dataclass, field
from typing import Any, List, Optional

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import (
    DirPaths, 
    CurriculumCategory, 
    Language
)
from app.models import (
    CurriculumModel,
    ExperienceModel,
    EducationModel,
    ProjectModel,
    CertificationModel,
)
from app.schemas import (
    StructuredCurriculumSchema,
    StructuredCurriculumEditSchema,
)
from app.repos.curriculum import CurriculumRepo
from app.integrations import (
    LoadInfoToFilePDFService,
    FilePDFService,
    BucketService
)


@dataclass
class _DeprecietedIds:
    experiences: List[str] = field(default_factory=list)
    educations: List[str] = field(default_factory=list)
    projects: List[str] = field(default_factory=list)
    certifications: List[str] = field(default_factory=list)

    @property
    def is_empty(self) -> bool:
        return not any([
            self.experiences,
            self.educations,
            self.projects,
            self.certifications,
        ])


class _EditCurriculum:

    def __init__(self, schema: StructuredCurriculumEditSchema, model: CurriculumModel) -> None:
        self._schema = schema
        self._model = model

    @property
    def deprecieted_ids(self) -> _DeprecietedIds:
        return _DeprecietedIds(
            experiences=[
                exp.id for exp in (self._model.experiences or [])
                if exp not in (self._schema.experiences or [])
            ],
            educations=[
                edu.id for edu in (self._model.educations or [])
                if edu not in (self._schema.educations or [])
            ],
            projects=[
                proj.id for proj in (self._model.projects or [])
                if proj not in (self._schema.projects or [])
            ],
            certifications=[
                cert.id for cert in (self._model.certifications or [])
                if cert not in (self._schema.certifications or [])
            ],
        )

    @property
    def active_experiences(self) -> List[ExperienceModel]:
        return [
            ExperienceModel.from_schema(exp)
            for exp in (self._schema.experiences or [])
        ]

    @property
    def active_educations(self) -> List[EducationModel]:
        return [
            EducationModel.from_schema(edu)
            for edu in (self._schema.educations or [])
        ]

    @property
    def active_projects(self) -> List[ProjectModel]:
        return [
            ProjectModel.from_schema(proj)
            for proj in (self._schema.projects or [])
        ]

    @property
    def active_certifications(self) -> List[CertificationModel]:
        return [
            CertificationModel.from_schema(cert)
            for cert in (self._schema.certifications or [])
        ]

    async def apply(self, session: AsyncSession) -> None:
        ids = self.deprecieted_ids

        if ids.experiences:
            await self._delete_by_ids(session, ExperienceModel, ids.experiences)
        if ids.educations:
            await self._delete_by_ids(session, EducationModel, ids.educations)
        if ids.projects:
            await self._delete_by_ids(session, ProjectModel, ids.projects)
        if ids.certifications:
            await self._delete_by_ids(session, CertificationModel, ids.certifications)

        self._model.name = self._schema.name
        self._model.email = self._schema.email
        self._model.role = self._schema.role
        self._model.github = self._schema.github
        self._model.linkedin = self._schema.linkedin
        self._model.phone = self._schema.phone
        self._model.location = self._schema.location
        self._model.resume = self._schema.resume
        self._model.language = self._schema.language
        self._model.category = self._schema.category

        self._model.experiences = self.active_experiences
        self._model.educations = self.active_educations
        self._model.projects = self.active_projects
        self._model.certifications = self.active_certifications

        await session.commit()
        await session.refresh(self._model)

    @staticmethod
    async def _delete_by_ids(
        session: AsyncSession,
        model: Any,
        ids: List[str],
    ) -> None:
        stmt: Select[Any] = select(model).filter(model.id.in_(ids))
        result = await session.scalars(stmt)
        for instance in result:
            await session.delete(instance)
        await session.flush()


class CurriculumService:

    @staticmethod
    async def create(
        session: AsyncSession,
        user_id: str,
        schema: StructuredCurriculumSchema,
    ) -> CurriculumModel:
        cv = CurriculumModel.from_schema(user_id, schema)
        return await CurriculumRepo.create(session, cv)

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        id: str,
    ) -> CurriculumModel:
        cv = await CurriculumRepo.get_by_id(session, id)
        if not cv:
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        return cv

    @staticmethod
    async def get_all(
        session: AsyncSession,
        user_id: str,
        category: Optional[CurriculumCategory] = None,
        language: Optional[Language] = None,
    ) -> List[CurriculumModel]:
        data = await CurriculumRepo.get_all(session, user_id, category, language)
        if not data:
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        return data

    @staticmethod
    async def delete(
        session: AsyncSession,
        id: str,
    ) -> None:
        cv = await CurriculumService.get_by_id(session, id)
        await CurriculumRepo.delete(session, cv)

    @staticmethod
    async def edit(
        session: AsyncSession,
        id: str,
        schema: StructuredCurriculumEditSchema,
    ) -> CurriculumModel:
        curriculum = await CurriculumRepo.get_by_id(session, id)
        if not curriculum:
            raise ValueError("Currículo não encontrado.")

        editor = _EditCurriculum(model=curriculum, schema=schema)
        await editor.apply(session)
        return curriculum

    @staticmethod
    async def prepare_pdf_context(
        session: AsyncSession,
        id: str,
    ) -> dict:
        cv = await CurriculumService.get_by_id(session, id)
        return StructuredCurriculumSchema.model_validate(cv).model_dump()

    @staticmethod
    async def process_pdf_background(
        curriculum_data_dict: dict,
        template_value: str,
        bucket: BucketService,
        basename: str,
        load_info_to_file: LoadInfoToFilePDFService
    ) -> None:
        processor = _ProcessPdfBackground(
            curriculum_data_dict=curriculum_data_dict,
            template_value=template_value,
            bucket=bucket,
            basename=basename,
            load_info_to_file=load_info_to_file,
        )
        await processor.execute()


class _ProcessPdfBackground:
    def __init__(
        self,
        *,
        basename: str,
        curriculum_data_dict: dict,
        template_value: str,
        bucket: BucketService,
        load_info_to_file: LoadInfoToFilePDFService,
    ) -> None:
        self._curriculum_data_dict = curriculum_data_dict
        self._template_value = template_value
        self._bucket = bucket
        self._basename = basename
        self._load_info_to_file = load_info_to_file

    async def execute(self) -> None:
        try:
            file_pdf = await self._generate()
            await self._upload_and_cleanup(file_pdf)
        except Exception as exc:
            print(f"Erro ao processar PDF em segundo plano: {exc}")

    async def _generate(self) -> FilePDFService:
        template_dir = DirPaths.DIR_TEMPLATES.value

        data = self._load_info_to_file.load_info(
            template=self._template_value,
            template_dir=template_dir,
            context=self._curriculum_data_dict,
        )

        file_pdf = FilePDFService(basename=self._basename, data=data)
        file_pdf.save()
        return file_pdf

    async def _upload_and_cleanup(self, file_pdf: FilePDFService) -> None:
        mimetype = file_pdf.mimetype
        filepath = file_pdf.path / file_pdf.filename

        await self._bucket.upload(filepath=filepath, mimetype=mimetype)
        file_pdf.delete()
        print(f"PDF {file_pdf._basename} gerado e enviado com sucesso!")


__all__ = ["CurriculumService"]
