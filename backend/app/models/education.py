from datetime import date
from uuid import uuid4
    
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.schemas import EducationSchema, EducationEditSchema

class EducationModel(BaseModel):
    __tablename__ = "educations"

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("curriculum.id"))

    institution: Mapped[str]
    degree: Mapped[str]
    location: Mapped[str]

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    cv: Mapped["CurriculumModel"] = relationship(back_populates="educations")

    @classmethod
    def from_schema(cls, schema: EducationSchema) -> "EducationModel":
        return cls(
            id=f"edu_{uuid4()}",
            institution=schema.institution,
            degree=schema.degree,
            location=schema.location,
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