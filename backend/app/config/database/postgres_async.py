from typing import AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession,
)

from app.config.database.base import BaseDB

class PostgresAsyncDB(BaseDB):

    def __init__(self, url: str):
        self._engine = create_async_engine(
            url=url.replace("psycopg2", "asyncpg"),
            pool_size=10,             # Mantém até 10 conexões abertas
            max_overflow=20,          # Permite até 20 conexões extras em picos
            pool_recycle=3600,        # Recicla conexões a cada hora
            pool_pre_ping=True,       # Verifica se a conexão está viva antes de usar (evita erros 500)    
        )
        self._session_local = async_sessionmaker(
            autoflush=False, 
            bind=self._engine,
            expire_on_commit=False
        )
        super().__init__()

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        db = self._session_local()
        try:
            yield db
        except Exception:
            await db.rollback()
            raise
        finally:
            await db.close()

    

            
