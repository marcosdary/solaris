from pytest import fixture
from faker import Faker

@fixture(scope="session")
def faker():
    return Faker()

