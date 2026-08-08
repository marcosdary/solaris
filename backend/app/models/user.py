from uuid import uuid4
from typing import Optional

# SqlAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, ForeignKey

# Models
from ..models.base import BaseModel
from ..models.phone import PhoneModel

# Schemas
from ..schemas.user import (
    UserCreateSchema,
    UserUpdateSchema
)
from ..schemas.phone import (
    PhoneCreateSchema
)

class UserModel(BaseModel):
    __tablename__ = "users"
    __table_args__ = {"schema": "private"}

    id: Mapped[str] = mapped_column(primary_key=True)
    phone_id: Mapped[Optional[str]] = mapped_column(ForeignKey("private.phones.id"), nullable=True)

    google_sub: Mapped[str] = mapped_column(unique=True, nullable=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, nullable=True)
    password: Mapped[str]
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    curriculums: Mapped[list["CurriculumModel"]] = relationship(back_populates="user")

    phone: Mapped["PhoneModel"] = relationship(back_populates="user", lazy="selectin")

    def update(self, schema: UserUpdateSchema) -> None:
        data = schema.model_dump(exclude_none=True, exclude_unset=True, exclude={"phone"})
        for key, value in data.items():
            if value == "":
                continue

            setattr(self, key, value)

        if schema.phone is not None:
            if self.phone is None:
                self.phone = PhoneModel.from_schema(PhoneCreateSchema(
                    ddi=schema.phone.ddi,
                    number=schema.phone.number
                ))
            else:
                self.phone.update(schema.phone) 
        elif "phone" in schema.model_fields_set:
            self.phone = None
        return 

    @classmethod
    def from_schema(cls, schema: UserCreateSchema) -> "UserModel":
        return cls(
            id=f"user_{uuid4()}",
            phone=PhoneModel.from_schema(schema.phone) if schema.phone else None,
            name=schema.name,
            email=schema.email,
            password=schema.password,
        )
    

__all__ = ["UserModel"]
