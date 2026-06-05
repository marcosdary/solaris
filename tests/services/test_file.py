from src.services import FileService
from src.config import Dir, FileDocx

def test_file_not_found(faker, test_add_text_file):    
    cv = "template.docx"
    filename = faker.file_name()
    dirname = faker.word()
    try:
        file_service = FileService(cv, filename, dirname)
        file_service.save_file(test_add_text_file)
    except FileNotFoundError as e:
        assert "[Errno 2] No such file or directory:" in str(e)

def test_save_file(faker, test_add_text_file):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = Dir.portuguese.value
    
    file_service = FileService(cv, filename, dirname)
    file_service.save_file(test_add_text_file)

def test_error_dir(faker, test_add_text_file):
    cv = FileDocx.portuguese.value
    filename = faker.file_name()
    dirname = ""
    try:
        file_service = FileService(cv, filename, dirname)
        file_service.save_file(test_add_text_file)
    except FileNotFoundError as e:
        assert "[Errno 2] No such file or directory:" in str(e)

