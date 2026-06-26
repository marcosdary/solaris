import subprocess
from os import remove
from pathlib import Path

from app.services.file import FileService
from app.config import DirPaths, MimeTypes, TypeFolder


class FilePDFService(FileService):
    def __init__(self, basename: str):
        self.__folder_pdf = TypeFolder.PDF.value
        self.__folder_upload = DirPaths.DIR_UPLOAD.value

        super().__init__(basename=basename)
      
    @property
    def filename(self):
        return f"{self._basename}.pdf"
    
    @property
    def path(self):
        return self.__folder_upload / self.__folder_pdf

    @property
    def mimetype(self):
        return MimeTypes.pdf.value
    
    def save(self, filepath: Path):
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            self.__folder_pdf,
            "--outdir",
            self.path,
            filepath
        ]
        subprocess.run(cmd, check=True)
        return 
    
    def delete(self):
        remove(self.path / self.filename)
           
    
