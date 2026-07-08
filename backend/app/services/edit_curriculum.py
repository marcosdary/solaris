from typing import Any, List
from dataclasses import dataclass, field

from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import StructuredCurriculumEditSchema
from app.models import (
    CurriculumModel,
    ExperienceModel,
    EducationModel,
    ProjectModel,
    CertificationModel,
)


@dataclass
class DeprecietedIds:
    """Agrupa os IDs de todos os itens marcados como depreciated no schema de edição.

    Cada campo contém os IDs (str) que devem ser removidos do banco.
    Itens sem ID (novos, criados no frontend) marcados como depreciated são ignorados,
    pois nunca chegaram a ser persistidos.
    """
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


class EditCurriculum:
    """Serviço de edição de currículo com suporte a deleção por flag depreciated.

    O mecanismo de deleção funciona da seguinte forma:
    1. O schema de edição (StructuredCurriculumEditSchema) possui o campo `depreciated: bool`
       em cada item filho (experiences, educations, projects, certifications).
    2. Quando um item existente é marcado como `depreciated: true` no frontend,
       o ID desse item é coletado por esta classe.
    3. No método `apply()`, os itens com IDs depreciados são removidos do banco.
       Graças ao `cascade="all, delete-orphan"` nas relações SQLAlchemy,
       os filhos desses itens (activities, descriptions, technologies) são
       automaticamente deletados junto com o pai.
    4. Itens sem ID (recém-criados no frontend) marcados como depreciated são
       simplesmente ignorados — nunca foram persistidos.
    5. Itens NÃO depreciados são convertidos em modelos e substituem as relações
       do CurriculumModel, efetivando tanto criações quanto atualizações.
    """

    def __init__(self, schema: StructuredCurriculumEditSchema, model: CurriculumModel) -> None:
        self._schema = schema
        self._model = model

    # ── deprecated IDs ──────────────────────────────────────────────

    @property
    def deprecieted_ids(self) -> DeprecietedIds:
        
        return DeprecietedIds(
            experiences=[
                exp.id for exp in (self._model.experiences or []) 
                if exp not in (self._schema.experiences or [])
            ],
            educations=[
                edu.id for edu in (self._model.educations or [])
                if edu not in (self._schema.educations or [])
            ],
            projects=[
                proj.id
                for proj in (self._model.projects or [])
                if proj not in (self._schema.projects or []) 
            ],
            certifications=[
                cert.id
                for cert in (self._model.certifications or [])
                if cert not in (self._schema.certifications or [])
            ],
        )

    # ── active (non-deprecated) models ──────────────────────────────

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

    # ── apply ───────────────────────────────────────────────────────

    async def apply(
        self,
        session: AsyncSession,
    ) -> None:
        """Aplica as alterações do schema de edição no modelo existente.

        Fluxo:
        1. Deleta do banco os itens marcados como depreciated.
        2. Atualiza os campos escalares do CurriculumModel.
        3. Substitui as listas de relacionamentos pelos itens ativos.
        """
        ids = self.deprecieted_ids

        if ids.experiences:
            await self._delete_by_ids(
                session, ExperienceModel, ids.experiences
            )
        if ids.educations:
            await self._delete_by_ids(
                session, EducationModel, ids.educations
            )
        if ids.projects:
            await self._delete_by_ids(
                session, ProjectModel, ids.projects
            )
        if ids.certifications:
            await self._delete_by_ids(
                session, CertificationModel, ids.certifications
            )

        self._model.name = self._schema.name
        self._model.email = self._schema.email
        self._model.role = self._schema.role
        self._model.github = self._schema.github  # type: ignore[assignment]
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
        """Remove registros do banco pelos IDs fornecidos.

        Executa um DELETE em lote para cada lote de IDs, respeitando
        as regras de cascade definidas no modelo.
        """
        stmt: Select[Any] = select(model).filter(model.id.in_(ids))
        result = await session.scalars(stmt)
        for instance in result:
            await session.delete(instance)
        await session.flush()
