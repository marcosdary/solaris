from src.services import DriveActionsService
from src.config import Dir, FileDocx

def test_upload_file(drive_service, settings):
    filename = "address.flac.docx"
    filepath = f"{Dir.portuguese.value}/{filename}"
    mimetype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    parents = [settings.ID_DIR_PORTUGUESE_DOCX]

    file_service = DriveActionsService(drive_service)
    file_service.upload(filepath, filename, mimetype, parents)

    