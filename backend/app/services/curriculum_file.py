from typing import List, Annotated, AsyncGenerator
from fastapi import Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import CurriculumFileModel
from app.schemas import (
    CurriculumFileCreateSchema,
    DownloadCurriculumResponseSchema,
)
from app.repos import CurriculumFileRepo
from app.integrations import BucketIntegration, FilePDFIntegration, LoadInfoToFilePDFIntegration
from app.config import DirPaths
from app.config.database import PostgresAsyncDB


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
        self, curriculum_id: str, schema: CurriculumFileCreateSchema
    ) -> CurriculumFileModel:
        file = CurriculumFileModel.from_schema(curriculum_id, schema)
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

    async def delete(self, file_id: str, bucket: BucketIntegration) -> None:
        file = await self.get_by_id(file_id)
        await bucket.delete([file.distpath])
        await CurriculumFileRepo.delete(self._db, file)

    async def get_download_url(
        self, file_id: str, bucket: BucketIntegration
    ) -> DownloadCurriculumResponseSchema:
        file = await self.get_by_id(file_id)
        result = await bucket.download(file.distpath)
        return DownloadCurriculumResponseSchema(
            url=result["url"],
            name=file.name,
            mimetype=file.mimetype,
        )

    async def process_pdf_background(
        self,
        *,
        curriculum_id: str,
        curriculum_data_dict: dict,
        template_value: str,
        bucket: BucketIntegration,
        basename: str,
        load_info_to_file: LoadInfoToFilePDFIntegration,
        postgres_db: PostgresAsyncDB,
    ) -> None:
        generator = _PdfGenerator(
            curriculum_data_dict=curriculum_data_dict,
            template_value=template_value,
            bucket=bucket,
            basename=basename,
            load_info_to_file=load_info_to_file,
        )
        result = await generator.execute()

        async with postgres_db.get_session() as session:
            file = CurriculumFileModel(
                curriculum_id=curriculum_id,
                name=result["name"],
                mimetype=result["mimeType"],
                distpath=result["distpath"],
                url=result["url"],
                template=template_value,
            )
            session.add(file)
            await session.commit()


class _PdfGenerator:

    def __init__(
        self,
        *,
        basename: str,
        curriculum_data_dict: dict,
        template_value: str,
        bucket: BucketIntegration,
        load_info_to_file: LoadInfoToFilePDFIntegration,
    ) -> None:
        self._curriculum_data_dict = curriculum_data_dict
        self._template_value = template_value
        self._bucket = bucket
        self._basename = basename
        self._load_info_to_file = load_info_to_file

    async def execute(self) -> dict:
        try:
            file_pdf = await self._generate()
            return await self._upload_and_cleanup(file_pdf)
        except Exception as exc:
            print(f"Erro ao processar PDF em segundo plano: {exc}")

    async def _generate(self) -> FilePDFIntegration:
        template_dir = DirPaths.DIR_TEMPLATES.value

        data = self._load_info_to_file.load_info(
            template=self._template_value,
            template_dir=template_dir,
            context=self._curriculum_data_dict,
        )

        file_pdf = FilePDFIntegration(basename=self._basename, data=data)
        file_pdf.save()
        return file_pdf

    async def _upload_and_cleanup(self, file_pdf: FilePDFIntegration) -> dict:
        mimetype = file_pdf.mimetype
        filepath = file_pdf.path / file_pdf.filename

        response = await self._bucket.upload(filepath=filepath, mimetype=mimetype)
        file_pdf.delete()
        print(f"PDF {file_pdf._basename} gerado e enviado com sucesso!")
        return response


def get_curriculum_file_service(
    db: Annotated[AsyncSession, Depends(get_session)]
) -> _CurriculumFileService:
    return _CurriculumFileService(db)


CurriculumFileServiceDep = Annotated[
    _CurriculumFileService, Depends(get_curriculum_file_service)
]

__all__ = ["CurriculumFileServiceDep"]
