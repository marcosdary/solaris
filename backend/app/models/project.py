from datetime import date
from uuid import uuid4

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.models.project_description import ProjectDescriptionModel
from app.models.project_technology import ProjectTechnologyModel
from app.schemas import ProjectSchema, ProjectEditSchema

class ProjectModel(BaseModel):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(primary_key=True)

    cv_id: Mapped[str] = mapped_column(ForeignKey("cv.id"))

    name: Mapped[str]
    github: Mapped[str]
    demo_url: Mapped[str] = mapped_column(nullable=True)

    start_date: Mapped[date]
    end_date: Mapped[date] = mapped_column(nullable=True)

    cv: Mapped["CurriculumModel"] = relationship(back_populates="projects")

    descriptions: Mapped[list["ProjectDescriptionModel"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    technologies: Mapped[list["ProjectTechnologyModel"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    @classmethod
    def from_schema(cls, schema: ProjectSchema) -> "ProjectModel":
        return cls(
            id=f"pro_{uuid4()}",
            name=schema.name,
            github=schema.github,
            demo_url=schema.demo_url,
            start_date=schema.start_date,
            end_date=schema.end_date,
            descriptions=[
                ProjectDescriptionModel.from_schema(description)
                for description in schema.descriptions
            ],
            technologies=[
                ProjectTechnologyModel.from_schema(technology)
                for technology in (schema.technologies or [])
            ],
        )
    
    @classmethod
    def from_edit_schema(cls, schema: ProjectEditSchema) -> "ProjectModel":
        return cls(
            id=schema.id,
            name=schema.name,
            github=schema.github,
            demo_url=schema.demo_url,
            start_date=schema.start_date,
            end_date=schema.end_date,
            descriptions=[
                ProjectDescriptionModel.from_schema(description)
                for description in schema.descriptions
            ],
            technologies=[
                ProjectTechnologyModel.from_schema(technology)
                for technology in (schema.technologies or [])
            ],
        )

__all__ = ["ProjectModel"]