from datetime import datetime
from pydantic import RootModel, field_serializer, computed_field
from typing import List, Optional
import re

from app.config import Language, CurriculumCategory
from .base import BaseSchema
from .curriculum_create import (
    ActivitySchema,
    ExperienceSchema,
    EducationSchema,
    ProjectDescriptionSchema,
    ProjectTechnologySchema,
    ProjectSchema,
    CertificationSchema,
    StructuredCurriculumSchema,
)


class ActivityResponseSchema(ActivitySchema):
    id: str
    created_at: datetime
    updated_at: datetime

    @field_serializer("description", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )


class ExperienceResponseSchema(ExperienceSchema):
    id: str
    created_at: datetime
    updated_at: datetime

    activities: list[ActivityResponseSchema]


class EducationResponseSchema(EducationSchema):
    id: str
    created_at: datetime
    updated_at: datetime


class ProjectDescriptionResponseSchema(ProjectDescriptionSchema):
    id: str
    created_at: datetime
    updated_at: datetime

    @field_serializer("description", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )

class ProjectTechnologyResponseSchema(ProjectTechnologySchema):
    id: str
    created_at: datetime
    updated_at: datetime


class ProjectResponseSchema(ProjectSchema):
    id: str
    created_at: datetime
    updated_at: datetime

    descriptions: list[ProjectDescriptionResponseSchema]
    technologies: list[ProjectTechnologyResponseSchema] | None = None

    @computed_field
    @property
    def period(self) -> str:
        start = self.start_date.strftime("%m/%Y")

        if self.end_date is None:
            return f"{start} - Atual"

        end = self.end_date.strftime("%m/%Y")
        return f"{start} - {end}"


class CertificationResponseSchema(CertificationSchema):
    id: str
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

class StructuredCurriculumSummarySchema(BaseSchema):
    id: str

    language: Language
    category: CurriculumCategory

    name: str
    role: str

    email: str
    github: Optional[str] = None
    linkedin: str
    location: str

    created_at: datetime
    updated_at: datetime

class StructuredCurriculumResponseSchema(StructuredCurriculumSchema):
    id: str
    created_at: datetime
    updated_at: datetime

    experiences: list[ExperienceResponseSchema]
    educations: list[EducationResponseSchema]
    projects: list[ProjectResponseSchema] | None = None
    certifications: list[CertificationResponseSchema] | None = None

    @field_serializer("resume", mode="plain")
    def serialize_bold(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value,
        )

class ListStructuredCurriculumResponse(RootModel[List[StructuredCurriculumSummarySchema]]): ...

__all__ = [
    "ActivityResponseSchema",
    "ExperienceResponseSchema", 
    "EducationResponseSchema",
    "ProjectDescriptionResponseSchema",
    "ProjectTechnologyResponseSchema",
    "ProjectResponseSchema",
    "CertificationResponseSchema",
    "StructuredCurriculumResponseSchema",
    "StructuredCurriculumSummarySchema",
    "ListStructuredCurriculumResponse"
]