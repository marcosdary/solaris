from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, Request
from jose import JWTError, jwt

from app.exceptions import InvalidCredentialsException
from app.config import get_settings, Settings
from app.integrations import EvolutionAPIIntegration


class _AuthService:
    def __init__(self, settings: Settings):
        self._settings = settings

    def expires_in(self, expire_minutes: int) -> int:
        return expire_minutes * 60

    def create_access_token(self, phone: str) -> dict:
        access_token = self._settings.ACCESS_TOKEN_EXPIRE_MINUTES
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=access_token
        )
        payload = {
            "sub": phone,
            "iat": datetime.now(timezone.utc),
            "exp": expire,
            "type": "access"
        }
        expires_in = self.expires_in(access_token)
        return {
            "access_token": jwt.encode(
                payload,
                self._settings.JWT_SECRET,
                algorithm=self._settings.JWT_ALGORITHM,
            ),
            "token_type": "bearer",
            "expires_in": expires_in,
        }

    def decode_access_token(self, token: str) -> dict:
        payload = jwt.decode(
            token,
            self._settings.JWT_SECRET,
            algorithms=[self._settings.JWT_ALGORITHM],
        )
        if payload.get("type") != "access":
            raise jwt.InvalidTokenError("Tipo de token inválido")
        return payload
    
    def create_password_reset_token(self, phone: str) -> str:
        reset_password = self._settings.PASSWORD_RESET_EXPIRE_MINUTES
        
        expire = datetime.now(timezone.utc) + timedelta(minutes=reset_password)

        payload = {
            "sub": phone,
            "iat": datetime.now(timezone.utc),
            "exp": expire,
            "type": "password_reset"
        }
        
        return jwt.encode(
            payload,
            self._settings.JWT_SECRET,
            algorithm=self._settings.JWT_ALGORITHM,
        )

    def decode_password_reset_token(self, token: str) -> dict:
        payload = jwt.decode(
            token,
            self._settings.JWT_SECRET,
            algorithms=[self._settings.JWT_ALGORITHM],
        )
        if payload.get("type") != "password_reset":
            raise jwt.InvalidTokenError("Tipo de token inválido")
        return payload


class _PasswordForgotService: 
    def __init__(self, settings: Settings, auth_service: _AuthService):
        self._settings = settings
        self._evolution_api_integration = EvolutionAPIIntegration(
            api_key=self._settings.EVOLUTION_API_APIKEY,
            url=self._settings.EVOLUTION_API_URL,
            instance=self._settings.EVOLUTION_API_INSTANCE
        )
        self._auth_service = auth_service

    def send_password_reset_link(self, phone: str) -> None:
        token = self._auth_service.create_password_reset_token(phone)
        url = f"{self._settings.PASSWORD_RESET_URL}?token={token}"
        TEXT = f"""Acesse o link para realizar sua redefinição de senha:\n{url}"""
        self._evolution_api_integration.send_text(
            phone,
            text=TEXT
        )    

class _CurrentUser:
    def __init__(
        self, 
        request: Request, 
        auth_service: _AuthService,
    ):
        self._request = request
        self._auth_service = auth_service

    async def get_me(
        self,
    ) -> str:
        auth = self._request.headers.get("authorization")
        if not auth:
            raise InvalidCredentialsException(
               "Acesso negado."
            )
        try:
            t, token = auth.split(" ")
            
            if t.lower() != "bearer":
                raise ValueError(
                    "Token inválido"
                )
           
            payload = self._auth_service.decode_access_token(token)
            sub = payload.get("sub")
            
            if not sub:
                raise ValueError(
                    "Token inválido"
                )

            return sub
        except JWTError:
            raise InvalidCredentialsException(
                "Token inválido ou expirado"
            )
        except ValueError:
            raise InvalidCredentialsException(
                "Usuário inativo ou não encontrado"
            )

    async def password_forgot(
        self,
        phone: str
    ) -> None:
        self._password_forgot.send_password_reset_link(phone)
        return 

def get_auth_service(
    settings: Annotated[Settings, Depends(get_settings)]) -> _AuthService:
    return _AuthService(settings)

def get_password_forgot_service(
    settings: Annotated[Settings, Depends(get_settings)],
    auth_service: Annotated[_AuthService, Depends(get_auth_service)]
):
    return _PasswordForgotService(settings, auth_service)

def get_current_user_service(
    auth_service: Annotated[_AuthService, Depends(get_auth_service)],
    request: Request,
) -> _CurrentUser:
    return _CurrentUser(
        auth_service=auth_service,
        request=request,
    )

AuthServiceDep = Annotated[_AuthService, Depends(get_auth_service)]
CurrentUserDep = Annotated[_CurrentUser, Depends(get_current_user_service)]
PasswordForgotDep = Annotated[_PasswordForgotService, Depends(get_password_forgot_service)]

__all__ = ["AuthServiceDep", "CurrentUserDep", "PasswordForgotDep"]
