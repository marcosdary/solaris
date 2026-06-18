from enum import Enum
from pathlib import Path

class TemplateFile(Enum):
    english = "english.docx"
    portuguese = "portuguese.docx"

class DirPaths(Enum):
    DIR_DATA = Path(__file__).parent.parent.parent / "data"
    BASE_DIR =  Path(__file__).parent.parent.parent
    DIR_UPLOAD = Path(__file__).parent.parent.parent / "data" / "uploads" 
    DIR_FILES_TEMP = Path(__file__).parent.parent.parent / "data" / "temp"

class TypeFolder(Enum):
    PDF = "pdf"
    DOCX = "docx"

class MimeTypes(Enum):
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    pdf = "application/pdf"


def initialize_directories():
    """
    Inicializa os diretórios necessários para o armazenamento dos arquivos.
    """
    for type_dir in TypeFolder:
        path = DirPaths.DIR_UPLOAD.value / type_dir.value
        path.mkdir(parents=True, exist_ok=True)