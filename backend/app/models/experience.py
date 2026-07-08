from datetime import date
from uuid import uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.experience_activity import ExperienceActivityModel
from app.schemas import ExperienceSchema, ExperienceEditSchema

class ExperienceModel(BaseModel):
    __tablename__ = "experiences"

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("curriculum.id"))

    role: Mapped[str]
    company: Mapped[str]
    location: Mapped[str]

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    cv: Mapped["CurriculumModel"] = relationship(back_populates="experiences")

    activities: Mapped[list["ExperienceActivityModel"]] = relationship(
        back_populates="experience",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @classmethod
    def from_schema(cls, schema: ExperienceSchema) -> "ExperienceModel":
        return cls(
            id=f"exp_{uuid4()}",
            role=schema.role,
            company=schema.company,
            location=schema.location,
            start_date=schema.start_date,
            end_date=schema.end_date,
            activities=[
                ExperienceActivityModel.from_schema(activity)
                for activity in schema.activities
            ],
        )

    @classmethod
    def from_edit_schema(cls, schema: ExperienceEditSchema) -> "ExperienceModel":
        return cls(
            id=schema.id,
            role=schema.role,
            company=schema.company,
            location=schema.location,
            start_date=schema.start_date,
            end_date=schema.end_date,
            activities=[
                ExperienceActivityModel.from_schema(activity)
                for activity in schema.activities
            ],
        )


__all__ = ["ExperienceModel"]