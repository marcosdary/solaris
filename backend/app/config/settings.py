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
    
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    
    APP_SCRIPT_KEY: str
    
    SUPABASE_URL: str
    SUPABASE_KEY: str

    SUPABASE_POSTGRES_URL: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    JWT_ALGORITHM: str

    SUPABASE_BUCKET_NAME: str
    SUPABASE_FOLDER_PUBLIC: str

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