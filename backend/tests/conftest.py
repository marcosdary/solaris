from pytest import fixture
from pytest_asyncio import fixture as async_fixture
from faker import Faker
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from tempfile import TemporaryDirectory

from app.integrations import LoadInfoToFilePDFIntegration
from app.config import Settings, DirPaths, PostgresAsyncDB, PostgresSyncDB

@fixture(scope="session")
def faker():
    return Faker()

@fixture(scope="session")
def loading_info_service():
    return LoadInfoToFilePDFIntegration()

@fixture(scope="function")
def filename(faker):
    return faker.file_name(extension="")

@fixture(scope="session")
def text_file(faker, loading_info_service):
    text = f"**bold** {faker.text()}"
    rt = loading_info_service.add_text_file(text)
    return loading_info_service.info(rt)

@fixture(scope="session")
def settings():
    return Settings()

@fixture(scope="module")
def paths():
    return DirPaths

@fixture(scope="session")
def tmp_dir():
    with TemporaryDirectory() as tmp_dir:
        yield tmp_dir

@async_fixture(scope="function")
async def async_session(
    settings,
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = PostgresAsyncDB(settings.DB_TEST_URL)
    async with postgres_db.get_session() as session:
        yield session

@fixture
def session(
    settings,
):
    postgres_db = PostgresSyncDB(settings.DB_TEST_URL)
    with postgres_db.get_session() as session:
        yield session    

