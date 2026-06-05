from src.schemas import ResponseSchema

def test_response_schema_valid(faker):
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
    assert response_dict["name"] == data["name"]
    assert response_dict["mimetype"] == data["mimeType"]
    assert response_dict["size"] == data["size"]
    assert response_dict["web_view_link"] == data["webViewLink"]

def test_response_schema_invalid_id():
    data = {
        "id": 12345,
        "name": "test.docx",
        "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "size": 1024,
        "webViewLink": "https://example.com/view/test.docx"
    }
    
    try:
        ResponseSchema(**data)
    except TypeError as e:
        assert "Campo invalido." in str(e)

def test_response_schema_invalid_mimetype(faker):
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

def test_response_schema_invalid_size(faker):
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