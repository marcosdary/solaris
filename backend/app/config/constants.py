from enum import Enum
from pathlib import Path

class TemplateFile(Enum):
    english = "english.docx"
    portuguese = "portuguese.docx"
    resume_docx = "resume.docx"
    resume_html = "resume.html"

class Language(Enum):
    english = "english"
    portuguese = "portuguese"

class DirPaths(Enum):
    DIR_DATA = Path(__file__).parent.parent.parent / "data"
    BASE_DIR =  Path(__file__).parent.parent.parent
    DIR_UPLOAD = Path(__file__).parent.parent.parent / "data" / "uploads" 
    DIR_FILES_TEMP = Path(__file__).parent.parent.parent / "data" / "temp"
    DIR_TEMPLATES = Path(__file__).parent.parent.parent / "templates"

class TypeFolder(Enum):
    PDF = "pdf"
    DOCX = "docx"

class MimeTypes(Enum):
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    pdf = "application/pdf"

class Sites(str, Enum):
    linkedin = "linkedin"
    indeed = "indeed"


def initialize_directories():
    """
    Inicializa os diretórios necessários para o armazenamento dos arquivos.
    """
    for type_dir in TypeFolder:
        path = DirPaths.DIR_UPLOAD.value / type_dir.value
        path.mkdir(parents=True, exist_ok=True)