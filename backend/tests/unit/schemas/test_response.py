from pytest import mark

from app.schemas import GenerateCVResponseSchema
from app.config import MimeTypes

def test_validar_schema_de_resposta(faker):
    data = {
        "name": faker.file_name(),
        "mimeType": MimeTypes.docx.value
    }
    
    response = GenerateCVResponseSchema(**data)
    response_dict = response.model_dump()
    assert response_dict["name"] == data["name"]

@mark.parametrize(
    "mimetype",
    (    
        "mime/fake",
        "application/pdf"
    )
    
)
@mark.xfail(reason="Erro ocorre por causa de argumentos inválidos")
def test_erro_sobre_campo_incongruente_ao_requisito(mimetype, faker):
   
    data = {
        "name": faker.file_name(),
        "mimeType": mimetype
    }    
    GenerateCVResponseSchema.model_validate(**data)

