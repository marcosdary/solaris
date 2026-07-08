from datetime import date
from uuid import uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.schemas import CertificationSchema, CertificationEditSchema


class CertificationModel(BaseModel):
    __tablename__ = "certifications"

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("curriculum.id"))

    institution: Mapped[str]
    name: Mapped[str]
    location: Mapped[str]

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    cv: Mapped["CurriculumModel"] = relationship(back_populates="certifications")

    @classmethod
    def from_schema(
        cls,
        schema: CertificationSchema,
    ) -> "CertificationModel":
        return cls(
            id=f"cert_{uuid4()}",
            institution=schema.institution,
            name=schema.name,
            location=schema.location,
            start_date=schema.start_date,
            end_date=schema.end_date,
        )
    
    @classmethod
    def from_edit_schema(
        cls,
        schema: CertificationEditSchema
    ) -> "CertificationModel":
        return cls(
            id=schema.id,
            location=schema.location,
            institution=schema.institution,
            name=schema.name,
            start_date=schema.start_date,
            end_date=schema.end_date
        )
    
    

__all__ = ["CertificationModel"]