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
from ..schemas.curriculums.create import CertificationCreateSchema
from ..schemas.curriculums.edit import CertificationEditSchema


class CertificationModel(BaseModel):
    __tablename__ = "certifications"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    curriculum_id: Mapped[str] = mapped_column(ForeignKey("private.curriculums.id"))
    address_id: Mapped[Optional[str]] = mapped_column(
        ForeignKey("private.addresses.id"),
    )

    institution: Mapped[str]
    name: Mapped[str]

    is_remote: Mapped[Optional[bool]] = mapped_column(nullable=True, default=False)

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    address: Mapped[Optional["AddressModel"]] = relationship(back_populates="certification")
    curriculum: Mapped["CurriculumModel"] = relationship(back_populates="certifications")

    @classmethod
    def from_schema(
        cls,
        schema: CertificationCreateSchema,
    ) -> "CertificationModel":
        return cls(
            id=f"cert_{uuid4()}",
            institution=schema.institution,
            name=schema.name,
            address=AddressModel.from_schema(schema.address),
            is_remote=schema.is_remote,
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
            is_remote=schema.is_remote,
            address=AddressModel.from_schema(schema.address),
            institution=schema.institution,
            name=schema.name,
            start_date=schema.start_date,
            end_date=schema.end_date
        )
    
    

__all__ = ["CertificationModel"]