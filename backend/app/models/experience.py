from datetime import date
from uuid import uuid4
from typing import Optional

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.experience_activity import ExperienceActivityModel
from app.models.address import AddressModel
from app.schemas import ExperienceSchema, ExperienceEditSchema

class ExperienceModel(BaseModel):
    __tablename__ = "experiences"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("private.curriculum.id"))

    role: Mapped[str]
    company: Mapped[str]

    address_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("private.addresses.id"),
    )

    is_remote: Mapped[Optional[bool]] = mapped_column(nullable=True, default=False)

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    curriculum: Mapped["CurriculumModel"] = relationship(back_populates="experiences")

    address: Mapped[Optional["AddressModel"]] = relationship(back_populates="education")

    activities: Mapped[list["ExperienceActivityModel"]] = relationship(
        back_populates="experience",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, schema: ExperienceSchema) -> "ExperienceModel":
        return cls(
            id=f"exp_{uuid4()}",
            role=schema.role,
            company=schema.company,
            location=schema.location,
            address=AddressModel.from_schema(schema.address),
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