from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

from app.config import get_settings, TemplateFile, CurriculumCategory, Language
from app.schemas import (
    GenerateCurriculumToFileSchema,
    StructuredCurriculumSchema,
    StructuredCurriculumEditSchema,
    ListStructuredCurriculumResponse,
    StructuredCurriculumSummarySchema,
    StructuredCurriculumResponseSchema,
)
from app.services import CurriculumService
from app.integrations import (
    LoadInfoToFilePDFService,
    SupabaseBucketService
)


async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session

async def get_supabase_bucket(
    settings = Depends(get_settings)
) -> SupabaseBucketService:
    return SupabaseBucketService(settings)


router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=StructuredCurriculumSummarySchema,
)
async def create_curriculum(
    schema: StructuredCurriculumSchema,
    session = Depends(get_session),
) -> StructuredCurriculumSummarySchema:
    try:
        return await CurriculumService.create(session, schema)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro desconhecido: {exc}",
        )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=ListStructuredCurriculumResponse,
)
async def list_curriculums(
    session = Depends(get_session),
    category: CurriculumCategory = None,
    language: Language = None,
) -> ListStructuredCurriculumResponse:
    try:
        return await CurriculumService.get_all(session, category, language)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema,
)
async def get_curriculum(
    id: str,
    session = Depends(get_session),
) -> StructuredCurriculumResponseSchema:
    try:
        return await CurriculumService.get_by_id(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.post(
    "/pdf/{id}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=GenerateCurriculumToFileSchema,
)
async def generate_curriculum_pdf(
    id: str,
    background_tasks: BackgroundTasks,
    supabase_bucket = Depends(get_supabase_bucket),
    template: TemplateFile = TemplateFile.standard,
    session: AsyncSession = Depends(get_session),
    load_info_to_file = Depends(LoadInfoToFilePDFService),
) -> GenerateCurriculumToFileSchema:
    try:
        context = await CurriculumService.prepare_pdf_context(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))

    _basename = f"pdf_{uuid4()}"

    background_tasks.add_task(
        CurriculumService.process_pdf_background,
        curriculum_data_dict=context,
        basename=_basename,
        template_value=template.value,
        bucket=supabase_bucket,
        load_info_to_file=load_info_to_file,
    )
   
    return {"name": f"{_basename}.pdf"}


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def delete_curriculum(
    id: str,
    session = Depends(get_session),
) -> None:
    try:
        await CurriculumService.delete(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema,
)
async def edit_curriculum(
    id: str,
    schema: StructuredCurriculumEditSchema,
    session: AsyncSession = Depends(get_session),
) -> StructuredCurriculumResponseSchema:
    try:
        return await CurriculumService.edit(session, id, schema)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


__all__ = ["router"]
