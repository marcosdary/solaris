from datetime import date, datetime
from pydantic import RootModel, Field, computed_field
from typing import List, Optional, Annotated

# Config
from ...config import Language

# Schemas
from ..base import BaseSchema
from ..phone import PhoneSchemaResponse


class AddressResponseSchema(BaseSchema):
    """Endereço onde o currículo foi criado."""
    id: Annotated[str, Field(min_length=1)]
    state: Annotated[str, Field(min_length=1)]
    city: Annotated[str, Field(min_length=1)]


class ActivityResponseSchema(BaseSchema):
    """Uma atividade/realização dentro de uma experiência profissional."""
    id: str
    description: Annotated[str, Field(min_length=1)]
    created_at: datetime
    updated_at: datetime


class ExperienceResponseSchema(BaseSchema):
    """Experiência profissional."""
    id: str
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressResponseSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None

    activities: Annotated[List[ActivityResponseSchema], Field(min_length=1)]

    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class EducationResponseSchema(BaseSchema):
    """Formação acadêmica."""
    id: str
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressResponseSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None

    created_at: datetime
    updated_at: datetime


class ProjectDescriptionResponseSchema(BaseSchema):
    """Descrição de um projeto."""
    id: str
    description: Annotated[str, Field(min_length=1)]
    created_at: datetime
    updated_at: datetime


class ProjectTechnologyResponseSchema(BaseSchema):
    """Tecnologia utilizada em um projeto."""
    id: str
    technology: Annotated[str, Field(min_length=1)]
    created_at: datetime
    updated_at: datetime


class ProjectResponseSchema(BaseSchema):
    """Projeto."""
    id: str
    name: Annotated[str, Field(min_length=1)]
    github: Annotated[str, Field(min_length=1)]
    demo_url: Optional[str] = None

    start_date: date
    end_date: Optional[date] = None

    descriptions: Annotated[
        List[ProjectDescriptionResponseSchema],
        Field(min_length=1)
    ]

    technologies: Optional[List[ProjectTechnologyResponseSchema]] = None

    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class CertificationResponseSchema(BaseSchema):
    """Certificação."""
    id: str
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressResponseSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None

    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class CurriculumSummaryResponseSchema(BaseSchema):
    """Resumo do currículo para listagem."""
    id: str

    language: Language
    category: str

    name: str
    role: str

    email: str
    github: Optional[str] = None
    linkedin: str
    address: AddressResponseSchema

    created_at: datetime
    updated_at: datetime


class CurriculumResponseSchema(BaseSchema):
    """Currículo estruturado."""
    id: str

    language: Language
    category: str

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: PhoneSchemaResponse
    address: Annotated[AddressResponseSchema, Field(min_length=1)]

    resume: Annotated[str, Field(min_length=1)]

    experiences: Optional[List[ExperienceResponseSchema]] = None
    educations: Optional[List[EducationResponseSchema]] = None
    projects: Optional[List[ProjectResponseSchema]] = None
    certifications: Optional[List[CertificationResponseSchema]] = None

    created_at: datetime
    updated_at: datetime


class ListCurriculumsResponse(RootModel[List[CurriculumSummaryResponseSchema]]): ...

__all__ = [
    "ActivityResponseSchema",
    "ExperienceResponseSchema", 
    "EducationResponseSchema",
    "ProjectDescriptionResponseSchema",
    "ProjectTechnologyResponseSchema",
    "ProjectResponseSchema",
    "CertificationResponseSchema",
    "CurriculumResponseSchema",
    "CurriculumSummaryResponseSchema",
    "ListCurriculumsResponse"
]