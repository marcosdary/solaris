from pytest import fixture
from faker import Faker
from tempfile import TemporaryDirectory

from app.services import LoadingInfoService
from app.config import DriveAuth, Settings, ProjectPaths

@fixture(scope="session")
def faker():
    return Faker()

@fixture(scope="session")
def loading_info_service():
    return LoadingInfoService()

@fixture(scope="module")
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


@fixture(scope="session")
def drive_service(settings):
    drive = DriveAuth()
    creds = drive(settings)
    return creds

@fixture(scope="module")
def paths():
    return ProjectPaths

@fixture(scope="module")
def tmp_dir():
    with TemporaryDirectory() as tmp_dir:
        yield tmp_dir