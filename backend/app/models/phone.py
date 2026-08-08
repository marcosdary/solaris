from typing import List
from uuid import uuid4

# SqlAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel

# Schemas
from ..schemas.phone import PhoneCreateSchema, PhoneEditSchema

class PhoneModel(BaseModel):
    __tablename__ = "phones"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    
    ddi: Mapped[str] = mapped_column(unique=True, nullable=True)
    number: Mapped[str] = mapped_column(unique=True, nullable=True)

    curriculum: Mapped[
        List["CurriculumModel"]
    ] = relationship(
        back_populates="phone",
        cascade="all, delete-orphan",
        lazy="raise",
    )

    user: Mapped["UserModel"] = relationship(back_populates="phone")
    
    def update(self, schema: PhoneEditSchema) -> None:
        data = schema.model_dump(exclude_none=True)
        for key, value in data.items():
            setattr(self, key, value)

    @classmethod
    def from_schema(cls, schema: PhoneCreateSchema) -> "PhoneModel":
        return cls(
            id=f"phone_{uuid4()}",
            ddi=schema.ddi,
            number=schema.number,
        )


__all__ = ["PhoneModel"]
