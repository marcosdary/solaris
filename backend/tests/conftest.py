from pytest import fixture
from faker import Faker
from tempfile import TemporaryDirectory

from app.services import LoadInfoToFileService
from app.config import Settings, DirPaths

@fixture(scope="session")
def faker():
    return Faker()

@fixture(scope="session")
def loading_info_service():
    return LoadInfoToFileService()

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