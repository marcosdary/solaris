from src.config import FileDocx, MimeTypes

class Validators:

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
    def validate_mimetype(value: str) -> MimeTypes:
        try:
            return MimeTypes(value)
        except ValueError:
            allowed_values = [mimetype.value for mimetype in MimeTypes]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")