from uuid import uuid4
from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)
from app.models import CVModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import AsyncGenerator

from app.config import (
    get_settings,
    DirPaths,
    TemplateFile,
    CVCategory,
    Language,
    Settings,
    PostgresAsyncDB
)
from app.schemas import (
    GenerateCVResponseSchema,
    StructuredCVSchema,
    StructuredCVResponseSchema,
    ListStructuredCVResponse,
    StructuredCVSummarySchema
)
from app.services import (
    LoadInfoToFilePDFService,
    DriveUploadService,
    FilePDFService
)

async def get_session(
    settings: Settings = Depends(get_settings),
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = PostgresAsyncDB(settings.DB_URL)
    async with postgres_db.get_session() as session:
        yield session

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=StructuredCVSummarySchema
)
async def cv(
    schema: StructuredCVSchema,
    session = Depends(get_session)
) -> StructuredCVSummarySchema: 
    try:
        cv = CVModel.from_schema(schema)
        session.add(cv)
        await session.commit()
        await session.refresh(cv)
        return cv
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )

@router.get(
    "", 
    status_code=status.HTTP_200_OK, 
    response_model=ListStructuredCVResponse
)
async def get_cv_all(
    session = Depends(get_session),
    category: CVCategory = None,
    language: Language = None
) -> ListStructuredCVResponse: 
    try:

        filters = []

        if category:
            filters.append(CVModel.category == category)
        
        if language:
            filters.append(CVModel.language == language)
        
        stmt = select(CVModel).filter(*filters)


        data = await session.scalars(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        return data
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )
    
@router.get(
    "/{id}", 
    status_code=status.HTTP_200_OK, 
    response_model=StructuredCVResponseSchema
)
async def get_cv(
    id: str,
    session = Depends(get_session)
) -> StructuredCVResponseSchema: 
    try:
        stmt = select(CVModel).filter(CVModel.id == id)
        data = await session.scalar(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        return data
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )


@router.post(
    "/pdf/{id}", 
    status_code=status.HTTP_201_CREATED, 
    response_model=GenerateCVResponseSchema
)
async def generate_cv_to_pdf(
    id: str,
    settings = Depends(get_settings),
    template: TemplateFile = TemplateFile.standard,
    session: AsyncSession = Depends(get_session),
    load_info_to_file = Depends(LoadInfoToFilePDFService)
) -> GenerateCVResponseSchema: 
    try:
        _basename = f"pdf_{uuid4()}"
        stmt = select(CVModel).filter(CVModel.id == id)
        cv = await session.scalar(stmt)

        if not cv : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")

        context = StructuredCVSchema.model_validate(cv)

        template_dir = DirPaths.DIR_TEMPLATES.value
    
       
        data = load_info_to_file.load_info(
            template=template.value, 
            template_dir=template_dir, 
            context=context.model_dump()
        )
    
        file_pdf = FilePDFService(basename=_basename, data=data)

        file_pdf.save_from_html()

        # Mimetype e filename para pdf
        mimetype = file_pdf.mimetype
        filepath = file_pdf.path / file_pdf.filename

        # Realizar upload na nuvem do Google Drive
        drive_upload = DriveUploadService(settings)
        response = drive_upload.upload(filepath=filepath, mimetype=mimetype)
        
        file_pdf.delete()

        return response
    
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )

@router.delete(
    "/{id}", 
    status_code=status.HTTP_200_OK, 
    response_model=None
)
async def delete_cv(
    id: str,
    session = Depends(get_session)
) -> None: 
    try:
        stmt = select(CVModel).filter(CVModel.id == id)
        data = await session.scalar(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        await session.delete(data)
        await session.commit()
        
        return 
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )
    
__all__ = ["router"]