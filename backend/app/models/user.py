from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean
from uuid import uuid4

from app.models.base import BaseModel
from app.schemas import UserCreateSchema

class UserModel(BaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    
    google_sub: Mapped[str] = mapped_column(unique=True, nullable=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    phone: Mapped[str] = mapped_column(unique=True, nullable=True)
    password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    curriculums: Mapped[list["CurriculumModel"]] = relationship(
        back_populates="user",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, schema: UserCreateSchema) -> "UserModel":
        return cls(
            id=f"user_{uuid4()}",
            phone=schema.phone,
            name=schema.name,
            email=schema.email,
            password=schema.password,
        )


__all__ = ["UserModel"]
