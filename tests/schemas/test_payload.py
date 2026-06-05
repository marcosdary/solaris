from src.schemas import PayloadSchema
from src.config import Dir, FileDocx

def test_payload_schema_valid(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": True
    }
    
    payload = PayloadSchema(**data)
    payload_dict = payload.model_dump()
    assert payload_dict["info"] == data["info"]
    assert payload_dict["cv"] == FileDocx.portuguese
    assert payload_dict["dirname"] == Dir.portuguese
    assert payload_dict["pdf"] == data["pdf"]
    
def test_payload_schema_invalid_cv(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "invalid.docx",
        "dirname": "portuguese",
        "pdf": True
    }
    
    try:
        PayloadSchema(**data)
    except ValueError as e:
        assert "Inválido valor: invalid.docx. Os valores permitidos são: ['english.docx', 'portuguese.docx']" in str(e) 

def test_payload_schema_invalid_dir(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "dirname": "invalid_dir",
        "pdf": True
    }
    
    try:
        PayloadSchema(**data)
    except ValueError as e:
        assert "Inválido valor: invalid_dir. Os valores permitidos são: ['english', 'portuguese']" in str(e)

def test_payload_schema_invalid_info():
    data = {
        "info": 12345,
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": True
    }
    
    try:
        PayloadSchema(**data)
    except TypeError as e:
        assert "Campo invalido." in str(e)

def test_payload_schema_invalid_pdf():
    data = {
        "info": "Some info",
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": "not_a_boolean"
    }
    
    try:
        PayloadSchema(**data)
    except TypeError as e:
        assert "Campo invalido." in str(e)

