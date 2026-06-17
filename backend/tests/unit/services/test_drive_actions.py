from docx import Document
from pytest import mark, raises
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
        "success": True,
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
        "success": True,
        "name": filename_pdf,
        "mimeType": mimetype
    }

@mark.xfail(reason="O erro ocorre devido ao fato de não ter criado o arquivo doc")
def test_erro_devido_ao_fato_do_arquivo_docx_nao_foi_criado(drive_service, tmp_dir, filename, settings):
    drive_actions = DriveActionsService(
        creds=drive_service,
        settings=settings
    )
    filename_docx = f"{filename}.docx"
    mimetype = MimeTypes.docx.value
    filepath = Path(tmp_dir) / filename_docx
    drive_actions.upload(
        filepath=filepath,
        filename=filename_docx,
        mimetype=mimetype
    )

@mark.xfail(reason="O erro ocorre devido ao fato de não ter criado o arquivo pdf")
def test_erro_devido_ao_fato_do_arquivo_pdf_nao_foi_criado(drive_service, tmp_dir, filename, settings):
    drive_actions = DriveActionsService(
        creds=drive_service,
        settings=settings
    )
    filename_pdf = f"{filename}.pdf"
    mimetype = MimeTypes.pdf.value
    filepath = Path(tmp_dir) / filename_pdf
    drive_actions.upload(
        filepath=filepath,
        filename=filename_pdf,
        mimetype=mimetype
    )

