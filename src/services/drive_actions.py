from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload 
from typing import List

class DriveActionsService:
    def __init__(self, creds) -> None:
        self.creds = creds

    def upload(self, filepath: str, filename: str, mimetype: str, parents: List[str]) -> str:
        try:
            service = self.creds
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
                    fields="id,name,mimeType,size,webViewLink"
                )
                .execute()
            )
            
            return file

        except HttpError as exc:
            raise Exception(f"Erro externo do servidor: {exc}")
        

