from typing import Optional, Annotated
from pydantic import Field

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

class ActivityEditSchema(ActivitySchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

class ExperienceEditSchema(ExperienceSchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str
    activities: list[ActivityEditSchema]

class EducationEditSchema(EducationSchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

class ProjectDescriptionEditSchema(ProjectDescriptionSchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

class ProjectTechnologyEditSchema(ProjectTechnologySchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

class ProjectEditSchema(ProjectSchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

    descriptions: list[ProjectDescriptionEditSchema]
    technologies: list[ProjectTechnologyEditSchema] | None = None

class CertificationEditSchema(CertificationSchema):
    depreciated: Annotated[Optional[bool], Field(default=False)]
    id: str

class StructuredCurriculumEditSchema(StructuredCurriculumSchema):
    experiences: list[ExperienceEditSchema]
    educations: list[EducationEditSchema]
    projects: list[ProjectEditSchema] | None = None
    certifications: list[CertificationEditSchema] | None = None

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