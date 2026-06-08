from src.schemas import ResponseSchema

def test_validar_schema_de_resposta(faker):
    data = {
        "id": str(faker.uuid4()),
        "name": faker.file_name(),
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": faker.random_number(digits=5),
        "webViewLink": faker.url()
    }
    
    response = ResponseSchema(**data)
    response_dict = response.model_dump()
    assert response_dict["id"] == data["id"]


def test_invalida_opcao_de_mimetype(faker):
    mimetype = faker.mime_type()
    data = {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "test.docx",
        "mimeType": mimetype,
        "size": faker.random_number(digits=5),
        "webViewLink": faker.url()
    }
    
    try:
        ResponseSchema(**data)
    except ValueError as e:
        assert f"Inválido valor: {mimetype}" in str(e)

def test_campo_size_com_tipo_primitivo_invalido(faker):
    data = {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "test.docx",
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": str(faker.random_number(digits=5)),
        "webViewLink": "https://example.com/view/test.docx"
    }
    
    try:
        ResponseSchema(**data)
    except TypeError as e:
        assert "Campo invalido." in str(e)