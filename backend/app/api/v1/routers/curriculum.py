from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, status
from fastapi.exceptions import HTTPException

from sqlalchemy.exc import IntegrityError, DBAPIError

from app.config import get_settings, TemplateFile, CurriculumCategory, Language
from app.schemas import (
    GenerateCurriculumToFileSchema,
    StructuredCurriculumSchema,
    StructuredCurriculumEditSchema,
    ListStructuredCurriculumResponse,
    StructuredCurriculumSummarySchema,
    StructuredCurriculumResponseSchema,
)
from app.services import CurriculumServiceDep
from app.integrations import (
    LoadInfoToFilePDFService,
    SupabaseBucketService
)


async def get_supabase_bucket(
    settings = Depends(get_settings)
) -> SupabaseBucketService:
    return SupabaseBucketService(settings)


router = APIRouter()


@router.post(
    "/{user_id}",
    status_code=status.HTTP_201_CREATED,
    response_model=StructuredCurriculumSummarySchema,
)
async def create_curriculum(
    user_id: str,
    schema: StructuredCurriculumSchema,
    curriculum_service: CurriculumServiceDep,
) -> StructuredCurriculumSummarySchema:
    try:
        return await curriculum_service.create(user_id, schema)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um currículo com estes dados.",
        )
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )


@router.get(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=ListStructuredCurriculumResponse,
)
async def list_curriculums(
    user_id: str,
    curriculum_service: CurriculumServiceDep,
    category: CurriculumCategory = None,
    language: Language = None,
) -> ListStructuredCurriculumResponse:
    try:
        return await curriculum_service.get_all(user_id, category, language)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema,
)
async def get_curriculum(
    id: str,
    curriculum_service: CurriculumServiceDep,
) -> StructuredCurriculumResponseSchema:
    try:
        return await curriculum_service.get_by_id(id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )


@router.post(
    "/pdf/{id}",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=GenerateCurriculumToFileSchema,
)
async def generate_curriculum_pdf(
    id: str,
    curriculum_service: CurriculumServiceDep,
    background_tasks: BackgroundTasks,
    supabase_bucket = Depends(get_supabase_bucket),
    template: TemplateFile = TemplateFile.standard,
    load_info_to_file = Depends(LoadInfoToFilePDFService),
) -> GenerateCurriculumToFileSchema:
    try:
        context = await curriculum_service.prepare_pdf_context(id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )

    _basename = f"pdf_{uuid4()}"

    background_tasks.add_task(
        curriculum_service.process_pdf_background,
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
    curriculum_service: CurriculumServiceDep,
) -> None:
    try:
        await curriculum_service.delete(id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )


@router.put(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=StructuredCurriculumResponseSchema,
)
async def edit_curriculum(
    id: str,
    schema: StructuredCurriculumEditSchema,
    curriculum_service: CurriculumServiceDep,
) -> StructuredCurriculumResponseSchema:
    try:
        return await curriculum_service.edit(id, schema)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um currículo com estes dados.",
        )
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor.",
        )


__all__ = ["router"]
