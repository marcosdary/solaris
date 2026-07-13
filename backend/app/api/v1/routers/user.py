from fastapi import APIRouter, Depends, Request, status
from fastapi.exceptions import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

from app.schemas import UserCreateSchema, UserResponseSchema
from app.services import UserService


async def get_session(
    request: Request,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = request.state.postgres_db
    async with postgres_db.get_session() as session:
        yield session


router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponseSchema,
)
async def create_user(
    schema: UserCreateSchema,
    session = Depends(get_session),
) -> UserResponseSchema:
    try:
        return await UserService.create(session, schema)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao criar usuário: {exc}",
        )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[UserResponseSchema],
)
async def list_users(
    session = Depends(get_session),
) -> list[UserResponseSchema]:
    try:
        return await UserService.get_all(session)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=UserResponseSchema,
)
async def get_user(
    id: str,
    session = Depends(get_session),
) -> UserResponseSchema:
    try:
        return await UserService.get_by_id(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.patch(
    "/{id}/deactivate",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def deactivate_user(
    id: str,
    session = Depends(get_session),
) -> None:
    try:
        await UserService.deactivate(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.patch(
    "/{id}/activate",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def activate_user(
    id: str,
    session = Depends(get_session),
) -> None:
    try:
        await UserService.activate(session, id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


__all__ = ["router"]
