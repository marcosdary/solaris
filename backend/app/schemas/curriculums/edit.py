from datetime import date
from typing import Optional, Annotated, List

from pydantic import Field

# Config
from ...config import Language

# Schemas
from ...schemas.base import BaseSchema
from ...schemas.phone import PhoneEditSchema

class AddressEditSchema(BaseSchema):
    """Endereço onde o currículo foi criado."""
    id: Annotated[str, Field(min_length=1)]
    state: Annotated[str, Field(min_length=1)]
    city: Annotated[str, Field(min_length=1)]

class ActivityEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    description: Annotated[str, Field(min_length=1)]


class ExperienceEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    address: Annotated[Optional[AddressEditSchema], Field(default=None)]
    is_remote: Annotated[bool, Field(default=False)]
    start_date: date
    end_date: Optional[date] = None
    activities: Annotated[Optional[List[ActivityEditSchema]], Field(default=None)]


class EducationEditSchema(BaseSchema):
    id: Annotated[Optional[str], Field(default=None)]
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    address: Annotated[Optional[AddressEditSchema], Field(default=None)]
    is_remote: Annotated[bool, Field(default=False)]
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
    address: Annotated[Optional[AddressEditSchema], Field (default=None)]
    is_remote: Annotated[bool, Field(default=False)]
    start_date: date
    end_date: Optional[date] = None


class CurriculumEditSchema(BaseSchema):
    language: Annotated[Language, Field(default=Language.portuguese)]
    category: str

    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]

    github: Optional[str] = None
    linkedin: Annotated[str, Field(min_length=1)]

    phone: PhoneEditSchema
    address: AddressEditSchema

    resume: Annotated[str, Field(min_length=1)]

    experiences: Annotated[Optional[List[ExperienceEditSchema]], Field(default=None)]
    educations: Annotated[Optional[List[EducationEditSchema]], Field(default=None)]
    projects: Annotated[Optional[List[ProjectEditSchema]], Field(default=None)]
    certifications: Annotated[Optional[List[CertificationEditSchema]], Field(default=None)]


__all__ = [
    "ActivityEditSchema",
    "ExperienceEditSchema",
    "EducationEditSchema",
    "ProjectDescriptionEditSchema",
    "ProjectTechnologyEditSchema",
    "ProjectEditSchema",
    "CertificationEditSchema",
    "CurriculumEditSchema",
]
