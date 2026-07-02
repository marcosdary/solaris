from uuid import uuid4
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel
from app.schemas import ActivitySchema

class ExperienceActivityModel(BaseModel):
    __tablename__ = "experience_activities"

    id: Mapped[str] = mapped_column(primary_key=True)

    experience_id: Mapped[str] = mapped_column(
        ForeignKey("experiences.id")
    )

    description: Mapped[str]

    experience: Mapped["ExperienceModel"] = relationship(
        back_populates="activities"
    )

    @classmethod
    def from_schema(cls, schema: ActivitySchema) -> "ExperienceActivityModel":
        return cls(
            id=f"exp_act_{uuid4()}",
            description=schema.description,
        )
    
__all__ = ["ExperienceActivityModel"]