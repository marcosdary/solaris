from typing import List, Annotated, AsyncGenerator
from fastapi import Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CurriculumFileModel
from app.schemas.curriculum_file import (
    CurriculumFileCreateSchema,
    DownloadCurriculumResponseSchema,
)
from app.repos.curriculum_file import CurriculumFileRepo
from app.integrations.bucket import BucketService


async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session


class _CurriculumFileService:

    def __init__(self, db: AsyncSession):
        self._db = db

    async def create(
        self, schema: CurriculumFileCreateSchema
    ) -> CurriculumFileModel:
        file = CurriculumFileModel(**schema.model_dump())
        return await CurriculumFileRepo.create(self._db, file)

    async def get_by_id(self, file_id: str) -> CurriculumFileModel:
        file = await CurriculumFileRepo.get_by_id(self._db, file_id)
        if not file:
            raise ValueError("Arquivo não encontrado.")
        return file

    async def get_by_curriculum_id(
        self, curriculum_id: str
    ) -> List[CurriculumFileModel]:
        files = await CurriculumFileRepo.get_by_curriculum_id(
            self._db, curriculum_id
        )
        if not files:
            raise ValueError("Nenhum arquivo encontrado para este currículo.")
        return files

    async def delete(self, file_id: str, bucket: BucketService) -> None:
        file = await self.get_by_id(file_id)
        await bucket.delete([file.name])
        await CurriculumFileRepo.delete(self._db, file)

    async def get_download_url(
        self, file_id: str, bucket: BucketService
    ) -> DownloadCurriculumResponseSchema:
        file = await self.get_by_id(file_id)
        result = await bucket.download(file.name)
        return DownloadCurriculumResponseSchema(
            url=result["url"],
            name=file.name,
            mimetype=file.mimetype,
        )


def get_curriculum_file_service(
    db: Annotated[AsyncSession, Depends(get_session)]
) -> _CurriculumFileService:
    return _CurriculumFileService(db)


CurriculumFileServiceDep = Annotated[
    _CurriculumFileService, Depends(get_curriculum_file_service)
]

__all__ = ["CurriculumFileServiceDep"]
