from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean

from app.models.base import BaseModel
from app.schemas import UserCreateSchema

class UserModel(BaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)

    name: Mapped[str]
    password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    curriculums: Mapped[list["CurriculumModel"]] = relationship(
        back_populates="user",
        lazy="raise",
    )

    @classmethod
    def from_schema(cls, schema: UserCreateSchema) -> "UserModel":
        return cls(
            id=schema.phone,
            name=schema.name,
            password=schema.password
        )


__all__ = ["UserModel"]
