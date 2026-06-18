from docxtpl import RichText
from typing import Dict
import subprocess

from app.config import TypeFolder, DirPaths
from app.services.file import FileService

class SaveFileService:
    def __init__(self, file: FileService):
        self.file = file
        self.__folder_pdf = TypeFolder.PDF.value
        self.__folder_upload = DirPaths.DIR_UPLOAD.value

    @property
    def path_from_docx(self):
        return self.__folder_upload / TypeFolder.DOCX.value
    
    @property
    def path_from_pdf(self):
        return self.__folder_upload / TypeFolder.PDF.value

    def save_docx_file(self, data: Dict[str, RichText]) -> None:
        self.file.docx_template.render(context=data)
        self.file.docx_template.save(self.path_from_docx / self.file.docx_filename)

    def save_pdf_file(self) -> None:

        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            self.__folder_pdf,
            "--outdir",
            self.path_from_pdf,
            self.path_from_docx / self.file.docx_filename
        ]
        subprocess.run(cmd, check=True)

        
