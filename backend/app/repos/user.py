from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import UserModel


class UserRepo:

    @staticmethod
    async def create(
        session: AsyncSession,
        user: UserModel,
    ) -> UserModel:
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        id: str,
    ) -> Optional[UserModel]:
        stmt = select(UserModel).filter(UserModel.id == id)
        return await session.scalar(stmt)

    @staticmethod
    async def get_by_email(
        session: AsyncSession,
        email: str,
    ) -> Optional[UserModel]:
        stmt = select(UserModel).filter(UserModel.email == email)
        return await session.scalar(stmt)

    @staticmethod
    async def get_all(
        session: AsyncSession,
    ) -> List[UserModel]:
        stmt = select(UserModel)
        result = await session.scalars(stmt)
        return list(result.all())


__all__ = ["UserRepo"]
