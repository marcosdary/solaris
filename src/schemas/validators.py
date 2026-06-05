from uuid import UUID

from src.config import Dir, FileDocx, MimeTypes

class Validators:

    @staticmethod
    def validate_uuid(value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("Campo invalido.")
        try:
            UUID(value)
        except ValueError:
            raise TypeError("Campo invalido.")
        return value

    @staticmethod
    def validate_string(value: str) -> str:
        if not isinstance(value, str):
            raise TypeError("Campo invalido.")
        return value
    
    @staticmethod
    def validate_cv(value: str) -> FileDocx:
        try:
            return FileDocx(value)
        except ValueError:
            allowed_values = [cv.value for cv in FileDocx]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")
        
    @staticmethod
    def validate_dir(value: str) -> Dir:
        try:
            return Dir(value)
        except ValueError:
            allowed_values = [dir.value for dir in Dir]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")
        
    @staticmethod
    def validate_mimetype(value: str) -> MimeTypes:
        try:
            return MimeTypes(value)
        except ValueError:
            allowed_values = [mimetype.value for mimetype in MimeTypes]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")