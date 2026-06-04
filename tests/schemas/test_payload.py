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
        assert str(e) == "Invalid cv value: invalid.docx. Allowed values are: ['portuguese.docx', 'english.docx']"