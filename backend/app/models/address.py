from typing import List
from uuid import uuid4

# SqlAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel

# Schemas
from ..schemas.curriculums.create import AddressCreateSchema
from ..schemas.curriculums.edit import AddressEditSchema

class AddressModel(BaseModel):
    __tablename__ = "addresses"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    
    state: Mapped[str] = mapped_column(unique=True, nullable=True)
    city: Mapped[str] = mapped_column(unique=True, nullable=True)

    curriculum: Mapped["CurriculumModel"] = relationship(
        back_populates="address",
        lazy="raise",
    )

    experience: Mapped["ExperienceModel"] = relationship(back_populates="address")

    education: Mapped["EducationModel"] = relationship(back_populates="address")

    certification: Mapped["CertificationModel"] = relationship(back_populates="address")

    @classmethod
    def from_schema(cls, schema: AddressCreateSchema) -> "AddressModel":
        return cls(
            id=f"address_{uuid4()}",
            state=schema.state,
            city=schema.city,
        )
    
    @classmethod
    def from_edit_schema(
        cls,
        schema: AddressEditSchema
    ) -> "CertificationModel":
        return cls(
            id=schema.id,
            state=schema.state,
            city=schema.city,
        )


__all__ = ["AddressModel"]
