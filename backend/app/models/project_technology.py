from uuid import uuid4

# SqlAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel

# Schemas
from ..schemas.curriculums.create import ProjectTechnologyCreateSchema
from ..schemas.curriculums.edit import ProjectTechnologyEditSchema

class ProjectTechnologyModel(BaseModel):
    __tablename__ = "project_technologies"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    project_id: Mapped[str] = mapped_column(
        ForeignKey("private.projects.id")
    )

    technology: Mapped[str]

    project: Mapped["ProjectModel"] = relationship(
        back_populates="technologies"
    )


    @classmethod
    def from_schema(
        cls,
        schema: ProjectTechnologyCreateSchema,
    ) -> "ProjectTechnologyModel":
        return cls(
            id=f"proj_tech_{uuid4()}",
            technology=schema.technology,
        )
    
    @classmethod
    def from_edit_schema(
        cls,
        schema: ProjectTechnologyEditSchema,
    ) -> "ProjectTechnologyModel":
        return cls(
            id=schema.id,
            technology=schema.technology,
        )

__all__ = ["ProjectTechnologyModel"]