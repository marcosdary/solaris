from datetime import date
from typing import Annotated, List, Optional
from pydantic import Field, computed_field

from app.config import Language, CurriculumCategory
from app.schemas.base import BaseSchema

class ActivitySchema(BaseSchema):
    """Uma atividade/realização dentro de uma experiência profissional."""
    description: Annotated[str, Field(min_length=1)]

class ExperienceSchema(BaseSchema):
    """Experiência profissional."""
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    start_date: date
    end_date: Optional[date] = None

    activities: Annotated[List[ActivitySchema], Field(min_length=1)]

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"

class EducationSchema(BaseSchema):
    """Formação acadêmica."""
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    start_date: date
    end_date: Optional[date] = None


class ProjectDescriptionSchema(BaseSchema):
    """Descrição de um projeto."""
    description: Annotated[str, Field(min_length=1)]


class ProjectTechnologySchema(BaseSchema):
    """Tecnologia utilizada em um projeto."""
    technology: Annotated[str, Field(min_length=1)]


class ProjectSchema(BaseSchema):
    """Projeto."""
    name: Annotated[str, Field(min_length=1)]
    github: Annotated[str, Field(min_length=1)]
    demo_url: Optional[str] = None

    start_date: date
    end_date: Optional[date] = None

    descriptions: Annotated[
        List[ProjectDescriptionSchema],
        Field(min_length=1)
    ]

    technologies: Optional[List[ProjectTechnologySchema]] = None


class CertificationSchema(BaseSchema):
    """Certificação."""
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    start_date: date
    end_date: Optional[date] = None


class StructuredCurriculumSchema(BaseSchema):
    """Currículo estruturado."""

    language: Language = Language.portuguese
    category: CurriculumCategory = CurriculumCategory.backend_developer

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    resume: Annotated[str, Field(min_length=1)]

    experiences: Annotated[
        Optional[List[ExperienceSchema]],
        Field(default=None)
    ]

    educations: Annotated[
        Optional[List[EducationSchema]],
        Field(default=None)
    ]

    projects: Annotated[
        Optional[List[ProjectSchema]],
        Field(default=None)
    ] 

    certifications: Annotated[
        Optional[List[CertificationSchema]],
        Field(default=None)
    ] 

__all__ = [
    "ActivitySchema",
    "ExperienceSchema",
    "EducationSchema",
    "ProjectDescriptionSchema",
    "ProjectTechnologySchema",
    "ProjectSchema",
    "CertificationSchema",
    "StructuredCurriculumSchema"
]