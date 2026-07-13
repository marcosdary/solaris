from typing import List

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserModel
from app.schemas import UserCreateSchema
from app.repos.user import UserRepo


class UserService:

    @staticmethod
    async def create(
        session: AsyncSession,
        schema: UserCreateSchema,
    ) -> UserModel:
        user = UserModel.from_schema(schema)
        return await UserRepo.create(session, user)

    @staticmethod
    async def get_or_create(
        session: AsyncSession,
        phone: str,
        name: str,
        email: str,
    ) -> UserModel:
        existing = await UserRepo.get_by_id(session, phone)
        if existing:
            if not existing.is_active:
                raise ValueError("Conta desativada.")
            return existing
        schema = UserCreateSchema(phone=phone, name=name, email=email)
        return await UserService.create(session, schema)

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        id: str,
    ) -> UserModel:
        user = await UserRepo.get_by_id(session, id)
        if not user:
            raise ValueError("Usuário não encontrado.")
        if not user.is_active:
            raise ValueError("Conta desativada.")
        return user

    @staticmethod
    async def get_by_email(
        session: AsyncSession,
        email: str,
    ) -> UserModel:
        user = await UserRepo.get_by_email(session, email)
        if not user:
            raise ValueError("Usuário não encontrado.")
        if not user.is_active:
            raise ValueError("Conta desativada.")
        return user

    @staticmethod
    async def get_all(
        session: AsyncSession,
    ) -> List[UserModel]:
        users = await UserRepo.get_all(session)
        active_users = [user for user in users if user.is_active]
        if not active_users:
            raise ValueError("Nenhum usuário encontrado.")
        return active_users

    @staticmethod
    async def deactivate(
        session: AsyncSession,
        id: str,
    ) -> None:
        user = await UserService.get_by_id(session, id)
        user.is_active = False
        await session.commit()

    @staticmethod
    async def activate(
        session: AsyncSession,
        id: str,
    ) -> None:
        user = await UserRepo.get_by_id(session, id)
        if not user:
            raise ValueError("Usuário não encontrado.")
        user.is_active = True
        await session.commit()


__all__ = ["UserService"]
