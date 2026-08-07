from datetime import date
from uuid import uuid4
from typing import Optional
    
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.address import AddressModel
from app.schemas import EducationSchema, EducationEditSchema

class EducationModel(BaseModel):
    __tablename__ = "educations"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("private.curriculum.id"))
    address_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("private.addresses.id"),
    )

    institution: Mapped[str]
    degree: Mapped[str]

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    address: Mapped[Optional["AddressModel"]] = relationship(back_populates="education")
    curriculum: Mapped["CurriculumModel"] = relationship(back_populates="educations")

    @classmethod
    def from_schema(cls, schema: EducationSchema) -> "EducationModel":
        return cls(
            id=f"edu_{uuid4()}",
            institution=schema.institution,
            degree=schema.degree,
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
            location=schema.location,
            start_date=schema.start_date,
            end_date=schema.end_date,
        )

__all__ = ["EducationModel"]