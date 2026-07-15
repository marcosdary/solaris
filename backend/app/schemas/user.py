from typing import Optional
from datetime import datetime

from pydantic import EmailStr, computed_field

from app.schemas.base import BaseSchema


class UserCreateSchema(BaseSchema):
    phone: str
    name: str
    email: EmailStr


class UserUpdateSchema(BaseSchema):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponseSchema(BaseSchema):
    id: str
    name: str
    email: str
    is_active: bool
    created_at: datetime

    @computed_field
    @property
    def format_message(self) -> str:
        return (
            f"📄 *Seu cadastro*\n\n"
            f"*Nome:* {self.name}\n"
            f"*Registro:* {self.created_at.strftime('%d-%m-%y %H:%M')}\n"
            f"*Status:* {'Ativo' if self.is_active else 'Desativo'}\n\n"
            f"*Contato e Redes*\n"
            f"*E-mail:* {self.email}\n"
        )


__all__ = ["UserCreateSchema", "UserUpdateSchema", "UserResponseSchema"]
