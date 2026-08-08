from typing import List, Annotated, AsyncGenerator
from uuid import uuid4

from fastapi import Depends, Request

# SqlAlchemy
from sqlalchemy.ext.asyncio import AsyncSession

# Models
from ..models import UserModel

# Schemas
from ..schemas.user import (
    UserCreateSchema, 
    UserUpdateSchema,
)
from ..schemas.auth import (
    GoogleUserInfoSchema,
    LoginRequestSchema
)

# Repos
from ..repos.user import UserRepo

# Exceptions
from ..exceptions import InvalidCredentialsException, NotFoundError

# Config
from ..config import get_settings, Settings

# Utils
from ..utils import AuthenticatorUtil, NormalizePhoneUtil

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

    def _normalize_phone(self, phone: str) -> NormalizePhoneUtil:
        return NormalizePhoneUtil(phone)

    def _random_password(self) -> str:
        return f"password_{uuid4()}"

    async def create(
        self,
        schema: UserCreateSchema,
    ) -> UserModel:
        
        password_hash = self._auth.hash_password(schema.password)
        user = UserModel.from_schema(UserCreateSchema(
            name=schema.name,
            email=schema.email,
            phone=schema.phone,
            password=password_hash
        ))
        
        return await UserRepo.create(self._db, user)

    async def get_by_phone(
        self,
        phone: str,
    ) -> UserModel:
        normalize_phone = self._normalize_phone(phone=phone)
        phone_register_in_db = normalize_phone.normalize_whatsapp_number()
        existing = await UserRepo.get_by_phone(self._db, phone_register_in_db)
        
        if not existing:
            raise InvalidCredentialsException("Conta desativada.")
        
        return existing

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
        schema: LoginRequestSchema
    ) -> UserModel:
        user = await UserRepo.get_by_email(self._db, schema.email)
        if not user:
            raise InvalidCredentialsException("Usuário não encontrado ou informações inválidas.")
        if not self._auth.verify_password(schema.password, user.password):
            raise InvalidCredentialsException("Usuário não encontrado ou informações inválidas.")
        return user
    
    async def login_google(
        self,
        schema: GoogleUserInfoSchema
    ) -> UserModel:
        user = await UserRepo.get_by_email(self._db, schema.email)
        # Caso o usuário não tenha cadastro, é cadastrado automaticamente
        if not user:
            password = self._random_password()
            password_hash = self._auth.hash_password(password)
            user = UserModel.from_schema(UserCreateSchema(
                google_sub=schema.sub,
                name=schema.name,
                email=schema.email,
                password=password_hash
            ))
            return await UserRepo.create(self._db, user)
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

        password_hash = None
        if schema.password:
            password_hash = self._auth.hash_password(schema.password)

        user.update(UserUpdateSchema(
            google_sub=schema.google_sub,
            name=schema.name,
            email=schema.email,
            phone=schema.phone,
            password=password_hash
        ))
        
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
