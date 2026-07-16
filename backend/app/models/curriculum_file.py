from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey
from uuid import uuid4

from app.models.base import BaseModel


class CurriculumFileModel(BaseModel):
    __tablename__ = "curriculum_files"

    id: Mapped[str] = mapped_column(
        primary_key=True, default=lambda: f"file_{uuid4()}"
    )
    curriculum_id: Mapped[str] = mapped_column(
        ForeignKey("curriculum.id"), nullable=False
    )
    name: Mapped[str]
    mimetype: Mapped[str]
    url: Mapped[str]
    template: Mapped[str] = mapped_column(nullable=True)

    curriculum: Mapped["CurriculumModel"] = relationship(
        back_populates="files",
        lazy="select",
    )


__all__ = ["CurriculumFileModel"]
