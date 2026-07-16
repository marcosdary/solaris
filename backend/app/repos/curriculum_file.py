from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CurriculumFileModel


class CurriculumFileRepo:

    @staticmethod
    async def create(
        session: AsyncSession, file: CurriculumFileModel
    ) -> CurriculumFileModel:
        session.add(file)
        await session.commit()
        await session.refresh(file)
        return file

    @staticmethod
    async def get_by_id(
        session: AsyncSession, file_id: str
    ) -> Optional[CurriculumFileModel]:
        stmt = select(CurriculumFileModel).filter(
            CurriculumFileModel.id == file_id
        )
        return await session.scalar(stmt)

    @staticmethod
    async def get_by_curriculum_id(
        session: AsyncSession, curriculum_id: str
    ) -> List[CurriculumFileModel]:
        stmt = select(CurriculumFileModel).filter(
            CurriculumFileModel.curriculum_id == curriculum_id
        )
        result = await session.scalars(stmt)
        return list(result.all())

    @staticmethod
    async def delete(
        session: AsyncSession, file: CurriculumFileModel
    ) -> None:
        await session.delete(file)
        await session.commit()


__all__ = ["CurriculumFileRepo"]
