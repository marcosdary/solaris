from pytest import raises

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
  
    
def test_erro_sobre_o_nome_errado_do_template_para_campo_cv(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "invalid.docx",
        "dirname": "portuguese",
        "pdf": True
    }
    with raises(ValueError) as exc_info:
        PayloadSchema(**data)
    assert "Inválido valor: invalid.docx. Os valores permitidos são: ['english.docx', 'portuguese.docx']" in str(exc_info.value)


def test_erro_sobre_o_nome_invalidado_do_diretório_para_salvar_novo_template(faker):
    data = {
        "info": faker.paragraph(),
        "cv": "portuguese.docx",
        "dirname": "invalid_dir",
        "pdf": True
    }
    with raises(ValueError) as exc_info:
        PayloadSchema(**data)
    assert "Inválido valor: invalid_dir. Os valores permitidos são: ['english', 'portuguese']" in str(exc_info.value)        


def test_erro_sobre_informar_valor_booleano_para_salvar_em_pdf():
    data = {
        "info": "Some info",
        "cv": "portuguese.docx",
        "dirname": "portuguese",
        "pdf": "not_a_boolean"
    }

    with raises(ValueError) as exc_info:
        PayloadSchema(**data)
    assert "Input should be a valid boolean, unable to interpret input" in str(exc_info.value)
 

