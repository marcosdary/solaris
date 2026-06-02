from enum import Enum
from pathlib import Path

class FileDocx(Enum):
    english = "english.docx"
    portuguese = "portuguese.docx"

class Dir(Enum):
    english = "english"
    portuguese = "portuguese"


SCOPES = (
    "https://www.googleapis.com/auth/drive.file"
)

DIR_DATA = Path(__file__).parent.parent.parent / "data"

BASE_DIR =  Path(__file__).parent.parent.parent