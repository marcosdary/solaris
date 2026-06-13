from docx import Document
from pathlib import Path
from reportlab.pdfgen import canvas

from app.services import DriveActionsService
from app.config import MimeTypes

def test_upload_no_google_drive_para_arquivo_docx(drive_service, tmp_dir, faker, filename, settings):
    drive_actions = DriveActionsService(
        creds=drive_service,
        settings=settings
    )
    filename_docx = f"{filename}.docx"
    mimetype = MimeTypes.docx.value
    filepath = Path(tmp_dir) / filename_docx

    doc = Document()
    doc.add_paragraph(faker.paragraph())
    doc.save(filepath)
        
    response = drive_actions.upload(
        filepath=filepath,
        filename=filename_docx,
        mimetype=mimetype
    )
    assert response == {
        "name": filename_docx,
        "mimeType": mimetype
    }

def test_upload_no_google_drive_para_arquivo_pdf(drive_service, tmp_dir, faker, filename, settings):
    drive_actions = DriveActionsService(
        creds=drive_service,
        settings=settings
    )

    filename_pdf = f"{filename}.pdf"
    mimetype = MimeTypes.pdf.value
    filepath = Path(tmp_dir) / filename_pdf

    c = canvas.Canvas(str(filepath))
    c.drawString(100, 750, faker.paragraph())
    c.save()

    response = drive_actions.upload(
        filepath=filepath,
        filename=filename_pdf,
        mimetype=mimetype
    )

    assert response == {
        "name": filename_pdf,
        "mimeType": mimetype
    }
