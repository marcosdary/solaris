from abc import abstractmethod, ABC
from typing import AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.orm import (
    sessionmaker,
)
from contextlib import (
    asynccontextmanager, 
    contextmanager
)
from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
    AsyncSession,
)

class BaseDB(ABC):

    @abstractmethod
    def get_session(self): ...

    @abstractmethod
    async def close(self) -> None: ...

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

    # Implementação do fechamento assíncrono do Engine
    async def close(self) -> None:
        await self._engine.dispose()

class PostgresSyncDB(BaseDB):

    def __init__(self, url: str):
        self._engine = create_engine(url=url)
        self._session_local = sessionmaker(autoflush=False, autocommit=False, bind=self._engine)
        super().__init__()

    @contextmanager
    def get_session(self):
        db = self._session_local()
        try:
            yield db
        except Exception:
            db.rollback()
        finally:
            db.close()
            
    async def close(self) -> None:
        self._engine.dispose()

        
