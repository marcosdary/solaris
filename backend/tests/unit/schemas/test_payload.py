from pytest import mark

from app.schemas import  GenerateCVRequestSchema

def test_validar_schema_valido(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "pdf": True
    }
    
    payload =  GenerateCVRequestSchema(**data)
    payload_dict = payload.model_dump()
    assert data.get("info") == payload_dict.get("info")
  
def test_gerar_nome_padrao_para_filename(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "pdf": True
    }

    payload =  GenerateCVRequestSchema(**data)

    assert payload.filename.startswith("cv_")

@mark.parametrize(
    "cv,pdf",
    (
        # Erro ocorre por o nome invalid.docx não está armazenado na enum Dir
        ("invalid.docx", True),
        # Erro ocorre por o nome invalid.docx não está armazenado na enum Dir
        ("portuguese.docx", True),
        # Erro ocorre por não haver o tipo correto (booleano)
        ("portuguese.docx", "not_a_boolean")
    )        
)
@mark.xfail(reason="Erro ocorre por causa de argumento incorreto.")
def test_erro_sobre_campo_incongruente_ao_requisitado(cv, pdf, faker):    
    data = {
        "info": faker.paragraph(),
        "cv": cv,
        "pdf": pdf
    }
     GenerateCVRequestSchema.model_validate(**data)
