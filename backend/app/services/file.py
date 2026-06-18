from docxtpl import DocxTemplate
from uuid import uuid4

from app.config import DirPaths, MimeTypes, TemplateFile

class FileService:
    def __init__(self, template: TemplateFile):
        self.template = template
        self.__docx_template = DocxTemplate(DirPaths.DIR_DATA.value / self.template.value)
        self.__basename = f"cv_{uuid4()}"
    
    @property
    def docx_filename(self):
        return f"{self.__basename}.docx"

    @property
    def pdf_filename(self):
        return f"{self.__basename}.pdf"
    
    @property
    def mimetype_to_pdf(self):
        return MimeTypes.pdf.value
    
    @property
    def mimetype_to_docx(self):
        return MimeTypes.docx.value

    @property
    def docx_template(self):
        return self.__docx_template
