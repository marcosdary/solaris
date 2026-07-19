from fastapi import APIRouter, status
from fastapi.exceptions import HTTPException
from sqlalchemy.exc import DBAPIError

from app.schemas import UserResponseSchema
from app.services import UserServiceDep, CurrentUserDep


router = APIRouter()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[UserResponseSchema],
)
async def list_users(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> list[UserResponseSchema]:
    try:
        return await user_service.get_all()
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)
        )
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor {exc}",
        )


__all__ = ["router"]
