from pytest import raises

from src.services import DriveActionsService
from src.config import Dir, ProjectPaths, TypeDir, MimeTypes


def test_com_sucesso_uploado_para_drive(drive_service, settings):
    filename = "cv_1780937592.634825.pdf"
    filepath = ProjectPaths.DIR_UPLOAD.value / Dir.portuguese.value / TypeDir.PDF.value / filename
    mimetype = MimeTypes.docx.value
    parents = [settings.ID_DIR_PORTUGUESE_DOCX]

    file_service = DriveActionsService(drive_service)
    response = file_service.upload(filepath, filename, mimetype, parents)
    assert response["name"] == filename
    

def test_de_arquivo_nao_encontrado(drive_service, faker, settings):
    filename = faker.file_name(extension="pdf")
    filepath = ProjectPaths.DIR_UPLOAD.value / Dir.portuguese.value / TypeDir.PDF.value / filename
    mimetype = MimeTypes.pdf.value
    parents = [settings.ID_DIR_PORTUGUESE_DOCX]

    file_service = DriveActionsService(drive_service)
    with raises(FileNotFoundError) as exc_info:
        file_service.upload(filepath, filename, mimetype, parents)
    
    assert "No such file or directory" in str(exc_info.value)
