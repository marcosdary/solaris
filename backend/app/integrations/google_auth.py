from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import GoogleAuthError

import httpx

from app.exceptions import InvalidCredentialsException

class GoogleAuthIntegration:
    def __init__(self, client_google_id: str, url_user_info: str):
        self._client_google_id = client_google_id
        self._url_user_info = url_user_info

    def verify(self, token: str) -> bool:
        """
        Verifica a validade do token de autenticação do Google.

        Args:
            token (str): Token de autenticação do Google.

        Returns:
            bool: True se o token for válido, False caso contrário.
        """
        # Aqui você pode implementar a lógica para verificar o token
        # usando a biblioteca oficial do Google ou qualquer outra abordagem.
        # Por exemplo, você pode usar a biblioteca `google-auth` para validar o token.
        # Exemplo de uso da biblioteca `google-auth`:
        #
        # from google.oauth2 import id_token
        # from google.auth.transport import requests
        #
        # try:
        #     id_info = id_token.verify_oauth2_token(token, requests.Request(), self.__client_google_id)
        #     return True
        # except ValueError:
        #     return False
        try:
            payload = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                self._client_google_id
            )
            return payload  # Retorna o payload do token se for válido, caso contrário, uma exceção será lançada.
        except GoogleAuthError as exc:
            raise InvalidCredentialsException(f"Token de autenticação do Google inválido: {exc}")
        
    async def get_userinfo(self, access_token: str) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:

            response = await client.get(
                self._url_user_info,
                headers={
                    "Authorization": f"Bearer {access_token}",
                },
            )

        if response.status_code != 200:
            raise InvalidCredentialsException("Token do Google inválido ou expirado.",
            )

        return response.json()

