from uuid import uuid4
from pydantic import ValidationError
from fastapi import (
    APIRouter, 
    Depends, 
    status,
    HTTPException
)
from app.models import CurriculumModel
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
    GenerateCurriculumToFileSchema,
    StructuredCurriculumSchema,
    StructuredCurriculumResponseSchema,
    StructuredCurriculumEditSchema,
    ListStructuredCurriculumResponse,
    StructuredCurriculumSummarySchema
)
from app.services import (
    LoadInfoToFilePDFService,
    DriveUploadService,
    FilePDFService,
    EditCurriculum,
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
    response_model=StructuredCurriculumSummarySchema
)
async def curriculum(
    schema: StructuredCurriculumSchema,
    session = Depends(get_session)
) -> StructuredCurriculumSummarySchema: 
    
        cv = CurriculumModel.from_schema(schema)
        session.add(cv)
        await session.commit()
        await session.refresh(cv)
        return cv
    
    

@router.get(
    "", 
    status_code=status.HTTP_200_OK, 
    response_model=ListStructuredCurriculumResponse
)
async def get_curriculum_all(
    session = Depends(get_session),
    category: CVCategory = None,
    language: Language = None
) -> ListStructuredCurriculumResponse: 
    try:

        filters = []

        if category:
            filters.append(CurriculumModel.category == category)
        
        if language:
            filters.append(CurriculumModel.language == language)
        
        stmt = select(CurriculumModel).filter(*filters)


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
    response_model=StructuredCurriculumResponseSchema
)
async def get_curriculum(
    id: str,
    session = Depends(get_session)
) -> StructuredCurriculumResponseSchema: 
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        data = await session.scalar(stmt)

        if not data : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")
        
        return data
    
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc
        )
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )


@router.post(
    "/pdf/{id}", 
    status_code=status.HTTP_201_CREATED, 
    response_model=GenerateCurriculumToFileSchema
)
async def generate_curriculum_to_pdf(
    id: str,
    settings = Depends(get_settings),
    template: TemplateFile = TemplateFile.standard,
    session: AsyncSession = Depends(get_session),
    load_info_to_file = Depends(LoadInfoToFilePDFService)
) -> GenerateCurriculumToFileSchema: 
    try:
        _basename = f"pdf_{uuid4()}"
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        curriculum_model = await session.scalar(stmt)

        if not curriculum_model : 
            raise ValueError("Conteúdo não encontrado. Tente novamente.")

        context = StructuredCurriculumSchema.model_validate(curriculum_model)

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
        drive_upload.upload(filepath=filepath, mimetype=mimetype)
            
        file_pdf.delete()

        return {
            "name": f"{_basename}.pdf"
        }

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=exc
        )
    
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
async def delete_curriculum(
    id: str,
    session = Depends(get_session)
) -> None: 
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
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
    
@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema
)
async def edit_curriculum(
    id: str,
    schema: StructuredCurriculumEditSchema,
    session: AsyncSession = Depends(get_session)
) -> StructuredCurriculumResponseSchema:
    try:
        stmt = select(CurriculumModel).filter(CurriculumModel.id == id)
        curriculum = await session.scalar(stmt)

        if not curriculum:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Currículo não encontrado."
            )

        editor = EditCurriculum(model=curriculum, schema=schema)
        await editor.apply(session)

        return curriculum

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc)
        )

__all__ = ["router"]