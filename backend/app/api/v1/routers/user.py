from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException

from sqlalchemy.exc import IntegrityError, DBAPIError

from app.schemas import UserCreateSchema, UserUpdateSchema, UserResponseSchema
from app.services import UserServiceDep


router = APIRouter()


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponseSchema,
)
async def create_user(
    schema: UserCreateSchema,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try:
        await user_service.get_by_email(schema.email)
        return await user_service.create(schema)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário cadastrado com este email.",
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
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[UserResponseSchema],
)
async def list_users(
    user_service: UserServiceDep,
) -> list[UserResponseSchema]:
    try:
        return await user_service.get_all()
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
    response_model=UserResponseSchema,
)
async def get_user(
    id: str,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try:
        return await user_service.get_by_id(id)
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
    response_model=UserResponseSchema,
)
async def update_user(
    id: str,
    schema: UserUpdateSchema,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try:
        return await user_service.update(id, schema)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário cadastrado com este email.",
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


@router.patch(
    "/{id}/deactivate",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def deactivate_user(
    id: str,
    user_service: UserServiceDep,
) -> None:
    try:
        await user_service.deactivate(id)
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


@router.patch(
    "/{id}/activate",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def activate_user(
    id: str,
    user_service: UserServiceDep,
) -> None:
    try:
        await user_service.activate(id)
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


__all__ = ["router"]
