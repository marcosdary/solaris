from datetime import datetime
from pydantic import RootModel
from typing import List, Optional

from app.config import Language, CVCategory
from app.schemas.base import BaseSchema
from app.schemas.cv_create import (
    ActivitySchema,
    ExperienceSchema,
    EducationSchema,
    ProjectDescriptionSchema,
    ProjectTechnologySchema,
    ProjectSchema,
    CertificationSchema,
    StructuredCVSchema,
)


class ActivityResponseSchema(ActivitySchema):
    id: str
    created_at: datetime
    updated_at: datetime


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


class CertificationResponseSchema(CertificationSchema):
    id: str
    created_at: datetime
    updated_at: datetime

class StructuredCVSummarySchema(BaseSchema):
    id: str

    language: Language
    category: CVCategory

    name: str
    role: str

    email: str
    github: Optional[str] = None
    linkedin: str
    location: str

    created_at: datetime
    updated_at: datetime

class StructuredCVResponseSchema(StructuredCVSchema):
    id: str
    created_at: datetime
    updated_at: datetime

    experiences: list[ExperienceResponseSchema]
    educations: list[EducationResponseSchema]
    projects: list[ProjectResponseSchema] | None = None
    certifications: list[CertificationResponseSchema] | None = None

class ListStructuredCVResponse(RootModel[List[StructuredCVSummarySchema]]): ...

__all__ = [
    "ActivityResponseSchema",
    "ExperienceResponseSchema", 
    "EducationResponseSchema",
    "ProjectDescriptionResponseSchema",
    "ProjectTechnologyResponseSchema",
    "ProjectResponseSchema",
    "CertificationResponseSchema",
    "StructuredCVResponseSchema",
    "StructuredCVSummarySchema",
    "ListStructuredCVResponse"
]