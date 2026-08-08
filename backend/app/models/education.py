from datetime import date
from uuid import uuid4
from typing import Optional

# SqlAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel
from ..models.address import AddressModel

# Schemas
from ..schemas.curriculums.create import EducationCreateSchema
from ..schemas.curriculums.edit import  EducationEditSchema

class EducationModel(BaseModel):
    __tablename__ = "educations"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("private.curriculums.id"))
    address_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("private.addresses.id"),
    )

    institution: Mapped[str]
    degree: Mapped[str]

    is_remote: Mapped[Optional[bool]] = mapped_column(nullable=True, default=False)

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    address: Mapped[Optional["AddressModel"]] = relationship(back_populates="education")
    curriculum: Mapped["CurriculumModel"] = relationship(back_populates="educations")

    @classmethod
    def from_schema(cls, schema: EducationCreateSchema) -> "EducationModel":
        return cls(
            id=f"edu_{uuid4()}",
            institution=schema.institution,
            degree=schema.degree,
            is_remote=schema.is_remote,
            address=AddressModel.from_schema(schema.address),
            start_date=schema.start_date,
            end_date=schema.end_date,
        )
    
    @classmethod
    def from_edit_schema(cls, schema: EducationEditSchema) -> "EducationModel":
        return cls(
            id=schema.id,
            institution=schema.institution,
            degree=schema.degree,
            is_remote=schema.is_remote,
            address=AddressModel.from_schema(schema.address),
            start_date=schema.start_date,
            end_date=schema.end_date,
        )

__all__ = ["EducationModel"]