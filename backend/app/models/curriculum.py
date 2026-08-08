from uuid import uuid4
from typing import Optional

# SqlAlchemy
from sqlalchemy.orm import (
    Mapped, 
    mapped_column, 
    relationship
)
from sqlalchemy import ForeignKey

# Models
from ..models.base import BaseModel
from ..models.experience import ExperienceModel
from ..models.education import EducationModel
from ..models.project import ProjectModel
from ..models.phone import PhoneModel
from ..models.address import AddressModel
from ..models.certification import CertificationModel

from ..schemas.curriculums.create import (
    CurriculumCreateSchema
)


class CurriculumModel(BaseModel):
    __tablename__ = "curriculums"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))

    language: Mapped[str]
    category: Mapped[str] 

    name: Mapped[str]
    role: Mapped[str]

    email: Mapped[str]
    phone: Mapped[str]

    github: Mapped[str] = mapped_column(nullable=True)
    linkedin: Mapped[str]

    resume: Mapped[str]

    user_id: Mapped[Optional[str]] = mapped_column(ForeignKey("private.users.id"), nullable=True)
    address_id: Mapped[str] = mapped_column(ForeignKey("private.addresses.id"))
    phone_id: Mapped[str] = mapped_column(ForeignKey("private.phones.id"))

    user: Mapped[Optional["UserModel"]] = relationship(
        back_populates="curriculums",
        lazy="select",
    )

    experiences: Mapped[list["ExperienceModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    educations: Mapped[list["EducationModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    projects: Mapped[list["ProjectModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    certifications: Mapped[list["CertificationModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    phone: Mapped["PhoneModel"] = relationship(
        back_populates="curriculum",
    )

    address: Mapped["AddressModel"] = relationship(
        back_populates="curriculum",
        lazy="raise",
    )

    files: Mapped[list["CurriculumFileModel"]] = relationship(
        back_populates="curriculum",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, user_id: str, schema: CurriculumCreateSchema) -> "CurriculumModel":
        return cls(
            user_id=user_id,
            id=f"cv_{uuid4()}",
            language=schema.language.value,
            category=schema.category,
            name=schema.name,
            email=schema.email,
            role=schema.role,
            github=schema.github,
            linkedin=schema.linkedin,
            resume=schema.resume,

            phone=PhoneModel.from_schema(schema.phone),

            address=AddressModel.from_schema(schema.address),

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
