from typing import List, Annotated, AsyncGenerator

from fastapi import Depends, Request

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserModel
from app.schemas import UserCreateSchema, UserUpdateSchema
from app.repos.user import UserRepo
from app.exceptions import InvalidCredentialsException, NotFoundError
from app.config import get_settings, Settings
from app.utils import AuthenticatorUtil

async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session

class _UserService:
    def __init__(self, db: AsyncSession, settings: Settings):
        self._db = db
        self._settings = settings
        self._auth = AuthenticatorUtil(self._settings.PASSWORD_PEPPER)

    async def create(
        self,
        schema: UserCreateSchema,
    ) -> UserModel:
        password_hash = self._auth.hash_password(schema.password)
        user = UserModel.from_schema(UserCreateSchema(
            name=schema.name,
            phone=schema.phone,
            password=password_hash
        ))
        return await UserRepo.create(self._db, user)

    async def get_or_create(
        self,
        phone: str,
        name: str,
    ) -> UserModel:
        existing = await UserRepo.get_by_id(self._db, phone)
        if existing:
            if not existing.is_active:
                raise InvalidCredentialsException("Conta desativada.")
            return existing
        schema = UserCreateSchema(phone=phone, name=name)
        return await UserRepo.create(self._db, schema)

    async def get_by_id(
        self,
        id: str,
    ) -> UserModel:
        user = await UserRepo.get_by_id(self._db, id)
        if not user:
            raise NotFoundError("Usuário não encontrado.")
        if not user.is_active:
            raise NotFoundError("Conta desativada.")
        return user
    
    async def login(
        self,
        phone: str,
        password: str
    ) -> UserModel:
        user = await UserRepo.get_by_id(self._db, phone)
        if not user:
            raise InvalidCredentialsException("Usuário não encontrado ou informações inválidas.")
        if not self._auth.verify_password(password, user.password):
            raise InvalidCredentialsException("Usuário não encontrado ou informações inválidas.")
        return user


    async def get_all(
        self,
    ) -> List[UserModel]:
        users = await UserRepo.get_all(self._db)
        active_users = [user for user in users if user.is_active]
        if not active_users:
            raise NotFoundError("Nenhum usuário encontrado.")
        return active_users

    async def update(
        self,
        id: str,
        schema: UserUpdateSchema,
    ) -> UserModel:
        user = await UserRepo.get_by_id(self._db, id)
        if not user.is_active:
            raise NotFoundError("Conta desativada.")
        for key, value in schema.model_dump(exclude_unset=True).items():
            if key == "password":
                password_hash = self._auth.hash_password(schema.password)
                setattr(user, key, password_hash)
                continue

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
            raise NotFoundError("Usuário não encontrado.")
        user.is_active = True
        await self._db.commit()

def get_user_service(
    db: Annotated[AsyncSession, Depends(get_session)],
    settings: Annotated[Settings, Depends(get_settings)]
):
    return _UserService(db, settings)

UserServiceDep = Annotated[_UserService, Depends(get_user_service)]

__all__ = ["UserServiceDep"]
