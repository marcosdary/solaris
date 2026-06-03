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
                .create(body=file_metadata, media_body=media, fields="id")
                .execute()
            )

        except HttpError as exc:
            file = None
            raise Exception(f"Erro externo do servidor: {exc}")
        
        finally:
            return file.get("id")
