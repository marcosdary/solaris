from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from uuid import uuid4

from app.models.base import BaseModel
from app.schemas import PhoneSchema

class PhoneModel(BaseModel):
    __tablename__ = "phone"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    
    ddi: Mapped[str] = mapped_column(unique=True, nullable=True)
    number: Mapped[str] = mapped_column(unique=True, nullable=True)

    curriculums: Mapped[
        List["CurriculumModel"]
    ] = relationship(
        back_populates="curriculums",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, schema: PhoneSchema) -> "PhoneModel":
        return cls(
            id=f"phone_{uuid4()}",
            ddi=schema.ddi,
            number=schema.number,
        )


__all__ = ["PhoneModel"]
