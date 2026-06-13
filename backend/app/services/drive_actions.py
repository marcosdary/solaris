from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload 
from typing import List
from pathlib import Path

from app.config import MimeTypes, Settings
from app.schemas import ResponseSchema

class DriveActionsService:
    def __init__(self, creds, settings: Settings) -> None:
        self.creds = creds
        self.settings = settings

    def upload(self, filepath: Path, filename: str, mimetype: str) -> ResponseSchema:
        try:
            service = self.creds
            parents = self.__get_parents_for_mimetype(mimetype=mimetype)
            file_metadata = {
                "name": filename,
                "parents": parents
            }  
            media = MediaFileUpload(filepath, mimetype=mimetype)

            file = (
                service.files()
                .create(
                    body=file_metadata, 
                    media_body=media, 
                    fields="name,mimeType"
                )
                .execute()
            )
            
            return file

        except HttpError as exc:
            raise Exception(f"Erro externo do servidor: {exc}")
        

    def __get_parents_for_mimetype(self, mimetype: str) -> List[str]:
        if MimeTypes.docx.value == mimetype:
            return [self.settings.ID_DIR_DOCX,]
        
        return [self.settings.ID_DIR_PDF,]
        

