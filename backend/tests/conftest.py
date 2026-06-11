from pytest import fixture
from faker import Faker

from src.services import LoadingInfoService
from src.config import DriveAuth, Settings

@fixture(scope="session")
def faker():
    return Faker()

@fixture(scope="session")
def loading_info_service():
    return LoadingInfoService()

@fixture(scope="session")
def test_add_text_file(faker, loading_info_service):
    text = f"**bold** {faker.text()}"
    rt = loading_info_service.add_text_file(text)
    return loading_info_service.info(rt)


@fixture(scope="session")
def drive_service():
    drive = DriveAuth()
    creds = drive()
    return creds


@fixture(scope="session")
def settings():
    return Settings()