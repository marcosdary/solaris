from pytest import mark

from src.schemas import PayloadSchema

def test_validar_schema_valido(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": True
    }
    
    payload = PayloadSchema(**data)
    payload_dict = payload.model_dump()
    assert data.get("info") == payload_dict.get("info")
  
def test_gerar_nome_padrao_para_filename(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": True
    }

    payload = PayloadSchema(**data)

    assert payload.filename.startswith("cv_")

@mark.parametrize(
    "cv,dirname,pdf",
    (
        # Erro ocorre por o nome invalid.docx não está armazenado na enum Dir
        ("invalid.docx", "portuguese", True),
        # Erro ocorre por o nome invalid.docx não está armazenado na enum Dir
        ("portuguese.docx", "invalid_dir", True),
        # Erro ocorre por não haver o tipo correto (booleano)
        ("portuguese.docx", "portuguese", "not_a_boolean")
    )        
)
@mark.xfail(reason="Erro ocorre por causa de argumento incorreto.")
def test_erro_sobre_campo_incongruente_ao_requisitado(cv, dirname, pdf, faker):    
    data = {
        "info": faker.paragraph(),
        "cv": cv,
        "dirname": dirname,
        "pdf": pdf
    }
    PayloadSchema.model_validate(**data)
