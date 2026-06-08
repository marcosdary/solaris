from pytest import raises

from src.services import FileService
from src.config import Dir, FileDocx

def test_erro_ao_nao_encontrar_template(faker, test_add_text_file):    
    cv = faker.file_name(extension="docx")
    filename = faker.file_name()
    dirname = faker.word()
    with raises(FileNotFoundError) as exc_info:
        file_service = FileService(cv, filename, dirname)
        file_service.save_file(test_add_text_file)

    assert "[Errno 2] No such file or directory:" in str(exc_info.value)

def test_arquivo_salvo_com_sucesso(faker, test_add_text_file):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = Dir.portuguese.value
    
    file_service = FileService(cv, filename, dirname)
    file_service.save_file(test_add_text_file)

def test_erro_sobre_nao_encontrada_pasta_destino(faker, test_add_text_file):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = ""
    with raises(FileNotFoundError) as exc_info:
        file_service = FileService(cv, filename, dirname)
        file_service.save_file(test_add_text_file)
    assert "[Errno 2] No such file or directory:" in str(exc_info.value)
       

def test_conversao_feita_com_sucesso_para_pdf(faker, test_add_text_file, monkeypatch):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = Dir.portuguese.value
    calls = []
    
    file_service = FileService(cv, filename, dirname)
    file_service.save_file(test_add_text_file)

    def fake_run(cmd, check):
        calls.append((cmd, check))

    monkeypatch.setattr("src.services.file.subprocess.run", fake_run)

    file_service.save_from_pdf()

    assert calls == [(
        [
            "libreoffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            file_service.path_from_pdf,
            file_service.full_file_path
        ],
        True
    )]

def test_erro_ao_converter_arquivo_que_nao_existe(faker):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = Dir.portuguese.value
    
    file_service = FileService(cv, filename, dirname)
    
    with raises(FileNotFoundError) as exc_info:
        file_service.save_from_pdf()

    assert "Arquivo não encontrado para conversão:" in str(exc_info.value)
