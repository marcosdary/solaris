from sqlalchemy.orm import (
    Mapped, 
    mapped_column, 
    relationship,
)
from sqlalchemy import Enum
from uuid import uuid4

from app.models.base import BaseModel
from app.models.experience import ExperienceModel
from app.models.education import EducationModel
from app.models.project import ProjectModel
from app.models.certification import CertificationModel
from app.config import Language, CVCategory
from app.schemas import (
    StructuredCurriculumSchema
)


class CurriculumModel(BaseModel):
    __tablename__ = "cv"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))

    language: Mapped[Language] = mapped_column(Enum(Language, name="language_enum"))
    category: Mapped[CVCategory] = mapped_column(Enum(CVCategory, name="cv_category_enum"))

    name: Mapped[str]
    role: Mapped[str]

    email: Mapped[str]
    phone: Mapped[str]

    github: Mapped[str] = mapped_column(nullable=True)
    linkedin: Mapped[str]

    location: Mapped[str]

    resume: Mapped[str]

    experiences: Mapped[list["ExperienceModel"]] = relationship(
        back_populates="cv",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    educations: Mapped[list["EducationModel"]] = relationship(
        back_populates="cv",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    projects: Mapped[list["ProjectModel"]] = relationship(
        back_populates="cv",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    certifications: Mapped[list["CertificationModel"]] = relationship(
        back_populates="cv",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @classmethod
    def from_schema(cls, schema: StructuredCurriculumSchema) -> "CurriculumModel":
        return cls(
            id=f"cv_{uuid4()}",
            language=schema.language,
            category=schema.category,
            name=schema.name,
            email=schema.email,
            role=schema.role,
            github=schema.github,
            linkedin=schema.linkedin,
            phone=schema.phone,
            location=schema.location,
            resume=schema.resume,

            experiences=[
                ExperienceModel.from_schema(experience)
                for experience in schema.experiences
            ],

            educations=[
                EducationModel.from_schema(education)
                for education in schema.educations
            ],

            projects=[
                ProjectModel.from_schema(project)
                for project in (schema.projects or [])
            ],

            certifications=[
                CertificationModel.from_schema(certification)
                for certification in (schema.certifications or [])
            ],
        )

__all__ = ["CurriculumModel"]
