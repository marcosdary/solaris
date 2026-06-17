from docxtpl import DocxTemplate, RichText
from typing import Dict
import subprocess

from app.config import TypeDir, ProjectPaths, initialize_directories

class FileService:
    def __init__(self, cv: str, filename: str):
        initialize_directories()
        self.cv = cv
        self.filename = filename
        self.dist_path = ProjectPaths.DIR_UPLOAD.value
       
        self.docx = DocxTemplate(ProjectPaths.DIR_DATA.value / self.cv)

    @property
    def full_file_path(self):
        return self.dist_path / TypeDir.DOCX.value / f"{self.filename}.docx"
    
    @property
    def path_from_pdf(self):
        return self.dist_path / TypeDir.PDF.value

    def save_file(self, data: Dict[str, RichText]) -> None:
        self.docx.render(context=data)
        self.docx.save(self.full_file_path)
    
    def validate_before_pdf(self) -> None:
        full_file_path = self.full_file_path
        path_from_pdf = self.path_from_pdf

        if not full_file_path.is_file():
            raise FileNotFoundError(f"Arquivo não encontrado para conversão: {full_file_path}")

        if not path_from_pdf.is_dir():
            raise FileNotFoundError(f"Pasta de destino não encontrada para conversão: {path_from_pdf}")

    def save_from_pdf(self) -> None:
        self.validate_before_pdf()

        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            TypeDir.PDF.value,
            "--outdir",
            self.path_from_pdf,
            self.full_file_path
        ]
        subprocess.run(cmd, check=True)

        
