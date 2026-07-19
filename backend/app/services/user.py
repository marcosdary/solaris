from typing import List, Annotated, AsyncGenerator

from fastapi import Depends, Request

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserModel
from app.schemas import UserCreateSchema, UserUpdateSchema
from app.repos.user import UserRepo

async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session


class _UserService:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def create(
        self,
        schema: UserCreateSchema,
    ) -> UserModel:
        user = UserModel.from_schema(schema)
        return await UserRepo.create(self._db, user)

    async def get_or_create(
        self,
        phone: str,
        name: str,
        email: str,
    ) -> UserModel:
        existing = await UserRepo.get_by_id(self._db, phone)
        if existing:
            if not existing.is_active:
                raise ValueError("Conta desativada.")
            return existing
        schema = UserCreateSchema(phone=phone, name=name)
        return await UserRepo.create(self._db, schema)

    async def get_by_id(
        self,
        id: str,
    ) -> UserModel:
        user = await UserRepo.get_by_id(self._db, id)
        if not user:
            raise ValueError("Usuário não encontrado.")
        if not user.is_active:
            raise ValueError("Conta desativada.")
        return user

    async def get_all(
        self,
    ) -> List[UserModel]:
        users = await UserRepo.get_all(self._db)
        active_users = [user for user in users if user.is_active]
        if not active_users:
            raise ValueError("Nenhum usuário encontrado.")
        return active_users

    async def update(
        self,
        id: str,
        schema: UserUpdateSchema,
    ) -> UserModel:
        user = await UserRepo.get_by_id(self._db, id)
        if not user.is_active:
            raise ValueError("Conta desativada.")
        for key, value in schema.model_dump(exclude_unset=True).items():
            setattr(user, key, value)
        return await UserRepo.update(self._db, user)

    async def deactivate(
        self,
        id: str,
    ) -> None:
        user = await UserRepo.get_by_id(self._db, id)
        user.is_active = False
        await self._db.commit()

    async def activate(
        self,
        id: str,
    ) -> None:
        user = await UserRepo.get_by_id(self._db, id)
        if not user:
            raise ValueError("Usuário não encontrado.")
        user.is_active = True
        await self._db.commit()

def get_user_service(db: Annotated[AsyncSession, Depends(get_session)]):
    return _UserService(db)

UserServiceDep = Annotated[_UserService, Depends(get_user_service)]

__all__ = ["UserServiceDep"]
