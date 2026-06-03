

from src.services.drive import get_drive_service, DriveActionsService, DriveAuthService
from src.config import MimeTypes, get_settings, TypeDir, Dir, ProjectPaths

if __name__ == "__main__":
   
    settings = get_settings()
    filename = "cv_1780430092.991291.pdf"
    filepath = f"{ProjectPaths.DIR_UPLOAD.value}/{Dir.portuguese.value}/{TypeDir.PDF.value}/{filename}"
    mimetype = MimeTypes.pdf.value
    parents = [settings.ID_DIR_PORTUGUESE_PDF]
 
    creds = DriveAuthService().authenticate()
    drive_actions_service = DriveActionsService(creds=creds)
    file_id = drive_actions_service.upload(
        filepath=filepath, 
        filename=filename, 
        mimetype=mimetype,
        parents=parents
    )

