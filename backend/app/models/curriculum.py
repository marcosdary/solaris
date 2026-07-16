from sqlalchemy.orm import (
    Mapped, 
    mapped_column, 
    relationship
)
from sqlalchemy import Enum, ForeignKey
from uuid import uuid4
from typing import Optional

from app.models.base import BaseModel
from app.models.experience import ExperienceModel
from app.models.education import EducationModel
from app.models.project import ProjectModel
from app.models.certification import CertificationModel
from app.config import Language, CurriculumCategory
from app.schemas import (
    StructuredCurriculumSchema
)


class CurriculumModel(BaseModel):
    __tablename__ = "curriculum"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))

    language: Mapped[Language] = mapped_column(Enum(Language, name="language_enum"))
    category: Mapped[CurriculumCategory] = mapped_column(Enum(CurriculumCategory, name="cv_category_enum"))

    name: Mapped[str]
    role: Mapped[str]

    email: Mapped[str]
    phone: Mapped[str]

    github: Mapped[str] = mapped_column(nullable=True)
    linkedin: Mapped[str]

    location: Mapped[str]

    resume: Mapped[str]

    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("users.id"), nullable=True)

    user: Mapped[Optional["UserModel"]] = relationship(
        back_populates="curriculums",
        lazy="select",
    )

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

    files: Mapped[list["CurriculumFileModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @classmethod
    def from_schema(cls, user_id: str, schema: StructuredCurriculumSchema) -> "CurriculumModel":
        return cls(
            user_id=user_id,
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
                for experience in (schema.experiences or [])
            ],

            educations=[
                EducationModel.from_schema(education)
                for education in (schema.educations or [])
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
