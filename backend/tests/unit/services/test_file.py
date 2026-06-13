from app.services import FileService
from app.config import FileDocx, TypeDir

def test_se_o_caminho_gerado_do_arquivo_vai_para_uploads(filename , paths):
    full_file_path = paths.DIR_UPLOAD.value / TypeDir.DOCX.value / f"{filename}.docx" 
    file_service = FileService(
        cv=FileDocx.portuguese.value,
        filename=filename
    )
    assert full_file_path == file_service.full_file_path

def test_se_o_caminho_gerado_do_arquivo_pdf_esta_uploads(filename, paths):
    path_from_pdf = paths.DIR_UPLOAD.value / TypeDir.PDF.value
    file_service = FileService(
        cv=FileDocx.portuguese.value,
        filename=filename
    )
    assert file_service.path_from_pdf == path_from_pdf

def test_salva_arquivo_docx_em_uploads(text_file, filename):
    file_service = FileService(
        cv=FileDocx.portuguese.value,
        filename=filename
    )
    file_service.save_file(text_file)
    assert file_service.full_file_path.exists()

def test_converter_e_salvar_docx_para_pdf_em_uploads(filename, paths):
    path_file_pdf = paths.DIR_UPLOAD.value / TypeDir.PDF.value / f"{filename}.pdf" 
    file_service = FileService(
        cv=FileDocx.portuguese.value,
        filename=filename
    )
    file_service.save_from_pdf()
    assert path_file_pdf.exists()
