from abc import ABC, abstractmethod
from os import remove

from weasyprint import HTML

from app.config import DirPaths, MimeTypes, TypeFolder

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
    
class FilePDFIntegration(FileService):
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
    
    def save(self):
        distpath = self.path / self.filename
        HTML(string=self.data).write_pdf(distpath)
        return 
    
    def delete(self):
        remove(self.path / self.filename)
           
           
    
__all__ = ["FilePDFIntegration"]
