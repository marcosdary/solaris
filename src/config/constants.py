from enum import Enum
from pathlib import Path

class FileDocx(Enum):
    english = "english.docx"
    portuguese = "portuguese.docx"

class Dir(Enum):
    english = "english"
    portuguese = "portuguese"


class ProjectPaths(Enum):
    DIR_DATA = Path(__file__).parent.parent.parent / "data"
    BASE_DIR =  Path(__file__).parent.parent.parent
    DIR_UPLOAD = Path(__file__).parent.parent.parent / "data" / "uploads" 

class TypeDir(Enum):
    PDF = "pdf"
    DOCX = "docx"

class MimeTypes(Enum):
    docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    pdf = "application/pdf"

SCOPES = (
    "https://www.googleapis.com/auth/drive.file",
)

