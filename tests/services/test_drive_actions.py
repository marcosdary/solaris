from pytest import raises

from src.services import DriveActionsService
from src.config import Dir, ProjectPaths, TypeDir, MimeTypes


def test_com_sucesso_uploado_para_diretorio_pdf_drive(drive_service, settings):
    filename = "cv_1780937592.634825.pdf"
    filepath = ProjectPaths.DIR_UPLOAD.value / Dir.portuguese.value / TypeDir.PDF.value / filename
    mimetype = MimeTypes.docx.value

    file_service = DriveActionsService(drive_service, settings)
    response = file_service.upload(filepath, filename, mimetype)
    assert response["name"] == filename


def test_com_sucesso_uploado_para_diretorio_docx_drive(drive_service, settings):
    filename = "cv_1780937592.634825.docx"
    filepath = ProjectPaths.DIR_UPLOAD.value / Dir.portuguese.value / TypeDir.DOCX.value / filename
    mimetype = MimeTypes.docx.value

    file_service = DriveActionsService(drive_service, settings)
    response = file_service.upload(filepath, filename, mimetype)
    assert response["name"] == filename


def test_de_arquivo_nao_encontrado(drive_service, faker, settings):
    filename = faker.file_name(extension="pdf")
    filepath = ProjectPaths.DIR_UPLOAD.value / Dir.portuguese.value / TypeDir.PDF.value / filename
    mimetype = MimeTypes.pdf.value

    file_service = DriveActionsService(drive_service, settings)
    with raises(FileNotFoundError) as exc_info:
        file_service.upload(filepath, filename, mimetype)
    
    assert "No such file or directory" in str(exc_info.value)
