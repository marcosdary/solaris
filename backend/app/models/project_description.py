from uuid import uuid4

# SqlAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel

# Schemas
from ..schemas.curriculums.create import ProjectDescriptionCreateSchema
from ..schemas.curriculums.edit import ProjectDescriptionEditSchema 

class ProjectDescriptionModel(BaseModel):
    __tablename__ = "project_descriptions"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    project_id: Mapped[str] = mapped_column(
        ForeignKey("private.projects.id")
    )

    description: Mapped[str]

    project: Mapped["ProjectModel"] = relationship(
        back_populates="descriptions"
    )

    @classmethod
    def from_schema(
        cls,
        schema: ProjectDescriptionCreateSchema,
    ) -> "ProjectDescriptionModel":
        return cls(
            id=f"pro_desc_{uuid4()}",
            description=schema.description,
        )
    
    @classmethod
    def from_edit_schema(
        cls,
        schema: ProjectDescriptionEditSchema,
    ) -> "ProjectDescriptionModel":
        return cls(
            id=schema.id,
            description=schema.description,
        )

__all__ = ["ProjectDescriptionModel"]