from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CurriculumModel
from app.config import CurriculumCategory, Language


class CurriculumRepo:

    @staticmethod
    async def create(
        session: AsyncSession,
        cv: CurriculumModel,
    ) -> CurriculumModel:
        session.add(cv)
        await session.commit()
        await session.refresh(cv)
        return cv

    @staticmethod
    async def get_by_id(
        session: AsyncSession,
        id: str,
    ) -> Optional[CurriculumModel]:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        return await session.scalar(stmt)

    @staticmethod
    async def get_all(
        session: AsyncSession,
        category: Optional[CurriculumCategory] = None,
        language: Optional[Language] = None,
    ) -> List[CurriculumModel]:
        filters: list = []

        if category:
            filters.append(CurriculumModel.category == category)
        if language:
            filters.append(CurriculumModel.language == language)

        stmt = select(CurriculumModel).filter(*filters)
        result = await session.scalars(stmt)
        return list(result.all())

    @staticmethod
    async def delete(
        session: AsyncSession,
        cv: CurriculumModel,
    ) -> None:
        await session.delete(cv)
        await session.commit()


__all__ = ["CurriculumRepo"]
