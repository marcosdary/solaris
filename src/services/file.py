from docxtpl import DocxTemplate, RichText
from pathlib import Path
from typing import Dict
import subprocess

from src.config import TypeDir, ProjectPaths

class FileService:
    def __init__(self, cv: str, filename: str, dirname: str):
        self.cv = cv
        self.filename = filename
        self.dirname = dirname
        self.dist_path = ProjectPaths.DIR_UPLOAD.value
       
        self.docx = DocxTemplate(ProjectPaths.DIR_DATA.value / self.cv)

    @property
    def full_file_path(self):
        return f"{self.dist_path}/{self.dirname}/{TypeDir.DOCX.value}/{self.filename}.docx"
    
    @property
    def path_from_pdf(self):
        return f"{self.dist_path}/{self.dirname}/{TypeDir.PDF.value}"

    def save_file(self, data: Dict[str, RichText]) -> None:
        self.docx.render(context=data)
        self.docx.save(self.full_file_path)
    
    def save_from_pdf(self) -> None:
        subprocess.run(
            [
                "libreoffice",
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                self.path_from_pdf,
                self.full_file_path
            ],
            check=True
        )

        
