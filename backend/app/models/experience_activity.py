from uuid import uuid4

# SqlAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Models
from ..models.base import BaseModel

# Schemas
from ..schemas.curriculums.create import ActivityCreateSchema
from ..schemas.curriculums.edit import ActivityEditSchema

class ExperienceActivityModel(BaseModel):
    __tablename__ = "experience_activities"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    experience_id: Mapped[str] = mapped_column(
        ForeignKey("private.experiences.id")
    )

    description: Mapped[str]

    experience: Mapped["ExperienceModel"] = relationship(
        back_populates="activities"
    )

    @classmethod
    def from_schema(cls, schema: ActivityCreateSchema) -> "ExperienceActivityModel":
        return cls(
            id=f"exp_act_{uuid4()}",
            description=schema.description,
        )
    
    @classmethod
    def from_edit_schema(cls, schema: ActivityEditSchema) -> "ExperienceActivityModel":
        return cls(
            id=schema.id,
            description=schema.description,
        )
    
__all__ = ["ExperienceActivityModel"]