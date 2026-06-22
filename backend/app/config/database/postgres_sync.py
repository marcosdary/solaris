from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

from app.config.database.base import BaseDB

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

        

            