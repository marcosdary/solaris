from datetime import date
from typing import Annotated, List, Optional
import re

from pydantic import Field, field_serializer, computed_field

from app.config import Language, CVCategory
from app.schemas.base import BaseSchema


class ActivitySchema(BaseSchema):
    """Uma atividade/realização dentro de uma experiência profissional."""
    description: Annotated[str, Field(min_length=1)]

    @field_serializer("description", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )

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

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class ProjectDescriptionSchema(BaseSchema):
    """Descrição de um projeto."""
    description: Annotated[str, Field(min_length=1)]

    @field_serializer("description", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )


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

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"

class CertificationSchema(BaseSchema):
    """Certificação."""
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    start_date: date
    end_date: Optional[date] = None

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class StructuredCVSchema(BaseSchema):
    """Currículo estruturado."""

    language: Language = Language.portuguese
    category: CVCategory = CVCategory.backend_developer

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    resume: Annotated[str, Field(min_length=1)]

    experiences: Annotated[
        List[ExperienceSchema],
        Field(min_length=1)
    ]

    educations: Annotated[
        List[EducationSchema],
        Field(min_length=1)
    ]

    projects: Optional[List[ProjectSchema]] = None

    certifications: Optional[List[CertificationSchema]] = None

    @field_serializer("resume", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )
__all__ = [
    "ActivitySchema",
    "ExperienceSchema",
    "EducationSchema",
    "ProjectDescriptionSchema",
    "ProjectTechnologySchema",
    "ProjectSchema",
    "CertificationSchema",
    "StructuredCVSchema"
]