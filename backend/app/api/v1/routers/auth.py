from fastapi import APIRouter, status, BackgroundTasks
from fastapi.exceptions import HTTPException
from sqlalchemy.exc import IntegrityError, DBAPIError

from app.schemas import (
    TokenResponseSchema,
    LoginRequestSchema,
    UserResponseSchema,
    UserUpdateSchema,
    UserCreateSchema,
    PasswordForgotSchema 
)
from app.exceptions import InvalidCredentialsException, NotFoundError
from app.services import (
    UserServiceDep, 
    PasswordForgotDep,
    AuthServiceDep, 
    CurrentUserDep
)

router = APIRouter()

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponseSchema,
)
async def create_user(
    schema: UserCreateSchema,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try:
        return await user_service.create(schema)
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um usuário cadastrado com essas informações.",
        )
    except DBAPIError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço indisponível no momento.",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor. {exc}",
        )

@router.post("/login", response_model=TokenResponseSchema)
async def login(
    body: LoginRequestSchema,
    user_service: UserServiceDep,
    auth_service: AuthServiceDep,
) -> TokenResponseSchema:
    try:
        user = await user_service.login(body.phone, body.password)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro externo do servidor: {exc}",
        )

    try:
        return auth_service.create_access_token(user.id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro externo do servidor: {exc}",
        )


@router.get("/me", response_model=UserResponseSchema)
async def get_me(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try: 
        user_id = await current_user.get_me()
        return await user_service.get_by_id(user_id)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {exc}",
        )

@router.put("/me", response_model=UserResponseSchema)
async def update_me(
    schema: UserUpdateSchema,
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> UserResponseSchema:
    try:
        user_id = await current_user.get_me()
        return await user_service.update(user_id, schema)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
    except NotFoundError as exc:
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
 

@router.patch("/me/deactivate", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_me(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> None:
    try:
        user_id = await current_user.get_me()
        await user_service.deactivate(user_id)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
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
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro interno do servidor: {exc}",
        )


@router.patch("/me/activate", status_code=status.HTTP_204_NO_CONTENT)
async def activate_me(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
) -> None:
    try:
        user_id = await current_user.get_me()
        await user_service.activate(user_id)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
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

@router.post("/password/forgot", status_code=status.HTTP_201_CREATED)
async def password_forgot(
    password_forgot: PasswordForgotDep,
    user_service: UserServiceDep,
    background_tasks: BackgroundTasks,
    body: PasswordForgotSchema
) -> dict:
    try:
        user = await user_service.get_by_id(body.phone)
    except InvalidCredentialsException as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )
    except NotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro externo do servidor: {exc}",
        )
    
    try:
        background_tasks.add_task(
            password_forgot.send_password_reset_link,
            phone=user.id
        )
        return {
            "message": "Link enviado com sucesso."
        } 
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro externo do servidor: {exc}",
        )



__all__ = ["router"]
