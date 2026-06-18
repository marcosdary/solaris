from app.services import SaveFileService
from app.config import TemplateFile, TypeFolder

def test_caminho_gerado_do_arquivo_docx_vai_para_pasta_docx(filename, paths):
    full_file_path = paths.DIR_UPLOAD.value / TypeFolder.DOCX.value / f"{filename}.docx" 
    file_service = SaveFileService(
        cv=TemplateFile.portuguese.value,
        filename=filename
    )
    assert full_file_path == file_service.path_from_docx

def test_caminho_gerado_do_arquivo_pdf_vai_para_pasta_pdf(filename, paths):
    path_from_pdf = paths.DIR_UPLOAD.value / TypeFolder.PDF.value
    file_service = SaveFileService(
        cv=TemplateFile.portuguese.value,
        filename=filename
    )
    assert file_service.path_from_pdf == path_from_pdf

def test_salva_arquivo_docx_em_uploads(text_file, filename):
    file_service = SaveFileService(
        cv=TemplateFile.portuguese.value,
        filename=filename
    )
    file_service.save_docx_file(text_file)
    assert file_service.path_from_docx.exists()

def test_converter_e_salvar_docx_para_pdf_em_uploads(filename, paths):
    path_file_pdf = paths.DIR_UPLOAD.value / TypeFolder.PDF.value / f"{filename}.pdf" 
    file_service = SaveFileService(
        cv=TemplateFile.portuguese.value,
        filename=filename
    )
    file_service.save_pdf_file()
    assert path_file_pdf.exists()
