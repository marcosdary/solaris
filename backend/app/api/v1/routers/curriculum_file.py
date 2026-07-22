from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.exc import DBAPIError

from app.config import get_settings
from app.schemas import (
    CurriculumFileResponseSchema,
    DownloadCurriculumResponseSchema,
)
from app.services import CurriculumFileServiceDep
from app.integrations import SupabaseBucketService
from app.exceptions import NotFoundError


async def get_supabase_bucket(
    settings = Depends(get_settings)
) -> SupabaseBucketService:
    return SupabaseBucketService(settings)


router = APIRouter()


@router.get(
    "/curriculum/{curriculum_id}",
    status_code=status.HTTP_200_OK,
    response_model=List[CurriculumFileResponseSchema],
)
async def list_files_by_curriculum(
    curriculum_id: str,
    file_service: CurriculumFileServiceDep,
) -> List[CurriculumFileResponseSchema]:
    try:
        return await file_service.get_by_curriculum_id(curriculum_id)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
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
    "/{file_id}/download",
    status_code=status.HTTP_200_OK,
    response_model=DownloadCurriculumResponseSchema,
)
async def download_file(
    file_id: str,
    file_service: CurriculumFileServiceDep,
    supabase_bucket = Depends(get_supabase_bucket),
) -> DownloadCurriculumResponseSchema:
    try:
        return await file_service.get_download_url(file_id, supabase_bucket)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
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


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
async def delete_file(
    file_id: str,
    file_service: CurriculumFileServiceDep,
    supabase_bucket = Depends(get_supabase_bucket),
) -> None:
    try:
        await file_service.delete(file_id, supabase_bucket)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
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
