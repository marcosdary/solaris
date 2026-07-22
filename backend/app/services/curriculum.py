from dataclasses import dataclass, field
from typing import (
    Any, 
    List, 
    Optional, 
    AsyncGenerator,
    Annotated
)
from fastapi import Request, Depends

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import (
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
from app.exceptions import NotFoundError

async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session


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


class _CurriculumService:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def create(
        self,
        user_id: str,
        schema: StructuredCurriculumSchema,
    ) -> CurriculumModel:
        curriculum = CurriculumModel.from_schema(user_id, schema)
        return await CurriculumRepo.create(self._db, curriculum)

    async def get_by_id(
        self,
        id: str,
    ) -> CurriculumModel:
        curriculum = await CurriculumRepo.get_by_id(self._db, id)
        if not curriculum:
            raise NotFoundError("Conteúdo não encontrado. Tente novamente.")
        return curriculum

    async def get_all(
        self,
        user_id: str,
        category: Optional[CurriculumCategory] = None,
        language: Optional[Language] = None,
    ) -> List[CurriculumModel]:
        data = await CurriculumRepo.get_all(self._db, user_id, category, language)
        if not data:
            raise NotFoundError("Conteúdo não encontrado. Tente novamente.")
        return data

    async def delete(
        self,
        id: str,
    ) -> None:
        curriculum = await self.get_by_id(id)
        await CurriculumRepo.delete(self._db, curriculum)

    async def edit(
        self,
        id: str,
        schema: StructuredCurriculumEditSchema,
    ) -> CurriculumModel:
        curriculum = await CurriculumRepo.get_by_id(self._db, id)
        if not curriculum:
            raise NotFoundError("Currículo não encontrado.")

        editor = _EditCurriculum(model=curriculum, schema=schema)
        await editor.apply(self._db)
        return await CurriculumRepo.get_by_id(self._db, id)

    async def prepare_pdf_context(
        self,
        id: str,
    ) -> dict:
        curriculum = await self.get_by_id(id)
        return StructuredCurriculumSchema.model_validate(curriculum).model_dump()


def get_curriculum_service(db: Annotated[AsyncSession, Depends(get_session)]):
    return _CurriculumService(db)

CurriculumServiceDep = Annotated[_CurriculumService, Depends(get_curriculum_service)]

__all__ = ["CurriculumServiceDep"]
