from datetime import date
from typing import Annotated, List, Optional
from pydantic import Field, computed_field

from ...schemas.base import BaseSchema
from ...schemas.phone import PhoneCreateSchema
from ...config import Language

class ActivityCreateSchema(BaseSchema):
    """Uma atividade/realização dentro de uma experiência profissional."""
    description: Annotated[str, Field(min_length=1)]

class AddressCreateSchema(BaseSchema):
    """Endereço onde o currículo foi criado."""
    state: Annotated[str, Field(min_length=1)]
    city: Annotated[str, Field(min_length=1)]

class ExperienceCreateSchema(BaseSchema):
    """Experiência profissional."""
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressCreateSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None

    activities: Annotated[List[ActivityCreateSchema], Field(min_length=1)]

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"

class EducationCreateSchema(BaseSchema):
    """Formação acadêmica."""
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressCreateSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None


class ProjectDescriptionCreateSchema(BaseSchema):
    """Descrição de um projeto."""
    description: Annotated[str, Field(min_length=1)]


class ProjectTechnologyCreateSchema(BaseSchema):
    """Tecnologia utilizada em um projeto."""
    technology: Annotated[str, Field(min_length=1)]


class ProjectCreateSchema(BaseSchema):
    """Projeto."""
    name: Annotated[str, Field(min_length=1)]
    github: Annotated[str, Field(min_length=1)]
    demo_url: Optional[str] = None

    start_date: date
    end_date: Optional[date] = None

    descriptions: Annotated[
        List[ProjectDescriptionCreateSchema],
        Field(min_length=1)
    ]

    technologies: Optional[List[ProjectTechnologyCreateSchema]] = None


class CertificationCreateSchema(BaseSchema):
    """Certificação."""
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    address: Annotated[AddressCreateSchema, Field(min_length=1)]
    is_remote: Annotated[bool, Field(default=False)]

    start_date: date
    end_date: Optional[date] = None


class CurriculumCreateSchema(BaseSchema):
    """Currículo estruturado."""

    language: Language
    category: str

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: PhoneCreateSchema
    address: Annotated[AddressCreateSchema, Field(min_length=1)]

    resume: Annotated[str, Field(min_length=1)]

    experiences: Annotated[
        Optional[List[ExperienceCreateSchema]],
        Field(default=None)
    ]

    educations: Annotated[
        Optional[List[EducationCreateSchema]],
        Field(default=None)
    ]

    projects: Annotated[
        Optional[List[ProjectCreateSchema]],
        Field(default=None)
    ] 

    certifications: Annotated[
        Optional[List[CertificationCreateSchema]],
        Field(default=None)
    ] 


__all__ = [
    "ActivityCreateSchema",
    "ExperienceCreateSchema",
    "EducationCreateSchema",
    "ProjectDescriptionCreateSchema",
    "ProjectTechnologyCreateSchema",
    "ProjectCreateSchema",
    "CertificationCreateSchema",
    "CurriculumCreateSchema",
    "AddressCreateSchema"
]