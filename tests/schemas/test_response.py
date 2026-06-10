from pytest import mark
from random import randint

from src.schemas import ResponseSchema

def test_validar_schema_de_resposta(faker):
    data = {
        "id": faker.uuid4(),
        "name": faker.file_name(),
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": faker.random_number(digits=5),
        "webViewLink": faker.url()
    }
    
    response = ResponseSchema(**data)
    response_dict = response.model_dump()
    assert response_dict["id"] == data["id"]

@mark.parametrize(
    "mimetype,size",
    (
        
        ("mime/fake", randint(100_000, 999_999)),
        ("application/pdf", str(randint(100_000, 999_999)))
    )
)
@mark.xfail(reason="Erro ocorre por causa de argumentos inválidos")
def test_erro_sobre_campo_incongruente_ao_requisito(mimetype, size, faker):
   
    data = {
        "id": faker.uuid4(),
        "name": faker.file_name(),
        "mimeType": mimetype,
        "size": size,
        "webViewLink": faker.url()
    }    
    ResponseSchema.model_validate(**data)

