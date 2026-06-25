import subprocess
from os import remove

from app.services.file import FileService
from app.config import DirPaths, MimeTypes, TypeFolder


class FilePDFService(FileService):
    def __init__(self):
        self.__folder_pdf = TypeFolder.PDF.value
        self.__folder_upload = DirPaths.DIR_UPLOAD.value

        super().__init__()
      
    @property
    def filename(self):
        return f"{self._basename}.pdf"
    
    @property
    def path(self):
        return self.__folder_upload / self.__folder_pdf

    @property
    def mimetype(self):
        return MimeTypes.docx.value
    
    def save(self):
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
        return 
    
    def delete(self):
        remove(self.path / self.filename)
           
    
