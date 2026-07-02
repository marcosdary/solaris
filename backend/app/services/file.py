from abc import ABC, abstractmethod
from typing import Dict
from docxtpl import DocxTemplate, RichText
import subprocess
from os import remove
from pathlib import Path
from weasyprint import HTML

from app.config import DirPaths, MimeTypes, TypeFolder, TemplateFile

class FileService(ABC):
    def __init__(self, basename: str):
        self._basename = basename
    
    @property
    @abstractmethod
    def filename(self): ...
    
    @property
    @abstractmethod
    def mimetype(self): ...

    @property
    @abstractmethod
    def path(self): ...
    
    @abstractmethod
    def save(self) -> None: ...
    
class FilePDFService(FileService):
    def __init__(self, basename: str, data: str):
        self.__folder_pdf = TypeFolder.PDF.value
        self.__folder_upload = DirPaths.DIR_UPLOAD.value
        self.data = data

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
    
    def save_from_html(self):
        distpath = self.path / self.filename
        HTML(string=self.data).write_pdf(distpath)
        return 
    
    def delete(self):
        remove(self.path / self.filename)
           
class FileDocxService(FileService):
    def __init__(self, template: TemplateFile, data: Dict[str, RichText], basename: str):
        self.template = template
        self.__docx_template = DocxTemplate(DirPaths.DIR_TEMPLATES.value / self.template.value)
        self.__folder_docx = TypeFolder.DOCX.value
        self.__folder_upload = DirPaths.DIR_UPLOAD.value
        self.data = data

        super().__init__(basename=basename)

    @property
    def filename(self):
        return f"{self._basename}.docx"
    
    @property
    def path(self):
        return self.__folder_upload / self.__folder_docx

    @property
    def mimetype(self):
        return MimeTypes.docx.value
    
    def save(self):
        distpath = self.path / self.filename
        self.__docx_template.render(context=self.data)
        self.__docx_template.save(distpath)
        return  
    
    def delete(self):
        remove(self.path / self.filename)
           
    
__all__ = ["FileDocxService", "FilePDFService"]