from uuid import uuid4
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.schemas import ProjectTechnologySchema

class ProjectTechnologyModel(BaseModel):
    __tablename__ = "project_technologies"

    id: Mapped[str] = mapped_column(primary_key=True)

    project_id: Mapped[str] = mapped_column(
        ForeignKey("projects.id")
    )

    technology: Mapped[str]

    project: Mapped["ProjectModel"] = relationship(
        back_populates="technologies"
    )


    @classmethod
    def from_schema(
        cls,
        schema: ProjectTechnologySchema,
    ) -> "ProjectTechnologyModel":
        return cls(
            id=f"proj_tech_{uuid4()}",
            technology=schema.technology,
        )

__all__ = ["ProjectTechnologyModel"]