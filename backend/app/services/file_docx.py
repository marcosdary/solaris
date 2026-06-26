from docxtpl import DocxTemplate, RichText
from typing import Dict
from os import remove

from app.services.file import FileService
from app.config import DirPaths, MimeTypes, TemplateFile, TypeFolder


class FileDocxService(FileService):
    def __init__(self, template: TemplateFile, data: Dict[str, RichText], basename: str):
        self.template = template
        self.__docx_template = DocxTemplate(DirPaths.DIR_DATA.value / self.template.value)
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
        self.__docx_template.render(context=self.data)
        self.__docx_template.save(self.path / self.filename)
        return 
    
    def delete(self):
        remove(self.path / self.filename)
           
    

    