from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from uuid import uuid4

from app.models.base import BaseModel
from app.schemas import AddressSchema

class AddressModel(BaseModel):
    __tablename__ = "addresses"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    
    state: Mapped[str] = mapped_column(unique=True, nullable=True)
    city: Mapped[str] = mapped_column(unique=True, nullable=True)

    curriculums: Mapped[
        List["CurriculumModel"]
    ] = relationship(
        back_populates="address",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, schema: AddressSchema) -> "AddressModel":
        return cls(
            id=f"address_{uuid4()}",
            state=schema.state,
            city=schema.city,
        )


__all__ = ["AddressModel"]
