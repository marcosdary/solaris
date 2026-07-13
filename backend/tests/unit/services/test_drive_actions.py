from pathlib import Path

from docx import Document
from pytest import mark
from reportlab.pdfgen import canvas

from app.integrations import GoogleDriveBucketService
from app.config import MimeTypes

@mark.asyncio
async def test_upload_no_google_drive_para_arquivo_docx(tmp_dir, faker, filename, settings):
    drive_actions = GoogleDriveBucketService(
        settings=settings
    )
    filename_docx = f"{filename}.docx"
    mimetype = MimeTypes.docx.value
    filepath = Path(tmp_dir) / filename_docx

    doc = Document()
    doc.add_paragraph(faker.paragraph())
    doc.save(filepath)

    response = await drive_actions.upload(
        filepath=filepath,
        mimetype=mimetype
    )
    assert response == {
        "success": True,
        "name": filename_docx,
        "mimeType": mimetype
    }

@mark.asyncio
async def test_upload_no_google_drive_para_arquivo_pdf(tmp_dir, faker, filename, settings):
    drive_actions = GoogleDriveBucketService(
        settings=settings
    )

    filename_pdf = f"{filename}.pdf"
    mimetype = MimeTypes.pdf.value
    filepath = Path(tmp_dir) / filename_pdf

    c = canvas.Canvas(str(filepath))
    c.drawString(100, 750, faker.paragraph())
    c.save()

    response = await drive_actions.upload(
        filepath=filepath,
        mimetype=mimetype
    )

    assert response == {
        "success": True,
        "name": filename_pdf,
        "mimeType": mimetype
    }

@mark.xfail(reason="O erro ocorre devido ao fato de não ter criado o arquivo doc")
@mark.asyncio
async def test_erro_devido_ao_fato_do_arquivo_docx_nao_foi_criado(tmp_dir, filename, settings):
    drive_actions = GoogleDriveBucketService(
        settings=settings
    )
    filename_docx = f"{filename}.docx"
    mimetype = MimeTypes.docx.value
    filepath = Path(tmp_dir) / filename_docx
    await drive_actions.upload(
        filepath=filepath,
        mimetype=mimetype
    )

@mark.xfail(reason="O erro ocorre devido ao fato de não ter criado o arquivo pdf")
@mark.asyncio
async def test_erro_devido_ao_fato_do_arquivo_pdf_nao_foi_criado(tmp_dir, filename, settings):
    drive_actions = GoogleDriveBucketService(
        settings=settings
    )
    filename_pdf = f"{filename}.pdf"
    mimetype = MimeTypes.pdf.value
    filepath = Path(tmp_dir) / filename_pdf
    await drive_actions.upload(
        filepath=filepath,
        mimetype=mimetype
    )
