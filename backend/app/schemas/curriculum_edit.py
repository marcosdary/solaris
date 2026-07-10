from datetime import date
from typing import Optional, Annotated, List
import re

from pydantic import Field, field_serializer
from app.config import Language, CurriculumCategory
from app.schemas.base import BaseSchema


class ActivityEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    description: Annotated[str, Field(min_length=1)]


class ExperienceEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]
    start_date: date
    end_date: Optional[date] = None
    activities: Annotated[Optional[List[ActivityEditSchema]], Field(default=None)]


class EducationEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]
    start_date: date
    end_date: Optional[date] = None


class ProjectDescriptionEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    description: Annotated[str, Field(min_length=1)]


class ProjectTechnologyEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    technology: Annotated[str, Field(min_length=1)]


class ProjectEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    name: Annotated[str, Field(min_length=1)]
    github: Annotated[str, Field(min_length=1)]
    demo_url: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    descriptions: Annotated[Optional[List[ProjectDescriptionEditSchema]], Field(default=None)]
    technologies: Annotated[Optional[List[ProjectTechnologyEditSchema]], Field(default=None)]


class CertificationEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]
    start_date: date
    end_date: Optional[date] = None


class StructuredCurriculumEditSchema(BaseSchema):
    language: Annotated[Language, Field(default=Language.portuguese)]
    category: Annotated[CurriculumCategory, Field(default=CurriculumCategory.backend_developer)]

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]

    resume: Annotated[str, Field(min_length=1)]

    experiences: Annotated[Optional[List[ExperienceEditSchema]], Field(default=None)]
    educations: Annotated[Optional[List[EducationEditSchema]], Field(default=None)]
    projects: Annotated[Optional[List[ProjectEditSchema]], Field(default=None)]
    certifications: Annotated[Optional[List[CertificationEditSchema]], Field(default=None)]

    @field_serializer("resume", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )


__all__ = [
    "ActivityEditSchema",
    "ExperienceEditSchema",
    "EducationEditSchema",
    "ProjectDescriptionEditSchema",
    "ProjectTechnologyEditSchema",
    "ProjectEditSchema",
    "CertificationEditSchema",
    "StructuredCurriculumEditSchema",
]
