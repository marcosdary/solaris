from functools import lru_cache
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class Settings(BaseSettings):
    """
    Configurações globais da aplicação.

    As variáveis são carregadas automaticamente
    a partir do arquivo `.env`.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    DB_URL: str
    API_KEY: str
    APP_SCRIPT_KEY: str

@lru_cache(maxsize=1)
def get_settings():
    """
    Retorna uma instância única das configurações.

    O uso de cache evita recriar o objeto
    Settings múltiplas vezes durante a execução.

    Returns:
        Settings:
            Instância das configurações da aplicação.
    """
    return Settings()

__all__ = ["Settings", "get_settings"]