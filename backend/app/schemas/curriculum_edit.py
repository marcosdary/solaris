from typing import Optional, Annotated, List
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
    id: Annotated[Optional[str], Field(default=None)]

class ExperienceEditSchema(ExperienceSchema):
    id: Annotated[Optional[str], Field(default=None)]
    activities: Annotated[
        Optional[List[ActivityEditSchema]],
        Field(default=None)
    ]

class EducationEditSchema(EducationSchema):
    id: Annotated[Optional[str], Field(default=None)]

class ProjectDescriptionEditSchema(ProjectDescriptionSchema):
    id: Annotated[Optional[str], Field(default=None)]

class ProjectTechnologyEditSchema(ProjectTechnologySchema):
    id: Annotated[Optional[str], Field(default=None)]

class ProjectEditSchema(ProjectSchema):
    id: Annotated[Optional[str], Field(default=None)]
    descriptions: Annotated[
        Optional[List[ProjectDescriptionEditSchema]], 
        Field(default=None)
    ]
    technologies: Annotated[
        Optional[List[ProjectTechnologyEditSchema]], 
        Field(default=None)
    ]

class CertificationEditSchema(CertificationSchema):
    id: Annotated[Optional[str], Field(default=None)]

class StructuredCurriculumEditSchema(StructuredCurriculumSchema):
    experiences: Annotated[
        Optional[List[ExperienceEditSchema]],
        Field(default=None)
    ]
    educations: Annotated[
        Optional[List[EducationEditSchema]], 
        Field(default=None)
    ]

    projects: Annotated[
        Optional[List[ProjectEditSchema]],
        Field(default=None)
    ]
    certifications: Annotated[
        Optional[List[CertificationEditSchema]],
        Field(default=None)
    ] 

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