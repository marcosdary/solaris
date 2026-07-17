from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, Depends, Request, status
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
from app.services import (
    CurriculumServiceDep,
    CurriculumFileServiceDep,
    CurrentUserDep
)
from app.integrations import (
    LoadInfoToFilePDFIntegration,
    SupabaseBucketService,
)


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
    curriculum_service: CurriculumServiceDep,
    current_user: CurrentUserDep,
) -> StructuredCurriculumSummarySchema:
    try:
        user_id = await current_user.get_me()
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
    "/users",
    status_code=status.HTTP_200_OK,
    response_model=ListStructuredCurriculumResponse,
)
async def list_curriculums_to_user(
    current_user: CurrentUserDep,
    curriculum_service: CurriculumServiceDep,
    category: CurriculumCategory = None,
    language: Language = None,
) -> ListStructuredCurriculumResponse:
    try:
        user_id = await current_user.get_me()
        return await curriculum_service.get_all(user_id, category, language)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento",
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
    request: Request,
    current_user: CurrentUserDep,
    curriculum_service: CurriculumServiceDep,
    curriculum_file_service: CurriculumFileServiceDep,
    background_tasks: BackgroundTasks,
    supabase_bucket = Depends(get_supabase_bucket),
    template: TemplateFile = TemplateFile.standard,
    load_info_to_file = Depends(LoadInfoToFilePDFIntegration),
) -> GenerateCurriculumToFileSchema:
    try:
        await current_user.get_me()
        context = await curriculum_service.prepare_pdf_context(id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {exc}",
        )
    try:
        _basename = f"pdf_{uuid4()}"

        background_tasks.add_task(
            curriculum_file_service.process_pdf_background,
            curriculum_id=id,
            curriculum_data_dict=context,
            basename=_basename,
            template_value=template.value,
            bucket=supabase_bucket,
            load_info_to_file=load_info_to_file,
            postgres_db=request.state.postgres_db,
        )

        return {"name": f"{_basename}.pdf"}
    
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
    current_user: CurrentUserDep,
    curriculum_service: CurriculumServiceDep,
) -> StructuredCurriculumResponseSchema:
    try:
        await current_user.get_me()
        return await curriculum_service.get_by_id(id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um currículo com estes dados.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {exc}",
        )


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def delete_curriculum(
    id: str,
    current_user: CurrentUserDep,
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
