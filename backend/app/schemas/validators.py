from app.config import TemplateFile, MimeTypes

class Validators:

    @staticmethod
    def validate_string(value: str) -> str:
        if not isinstance(value, str) or value == "":
            raise ValueError("Campo invalido ou campo obrigatório.")
        return value
    
    @staticmethod
    def validate_cv(value: str) -> TemplateFile:
        try:
            return TemplateFile(value)
        except ValueError:
            allowed_values = [cv.value for cv in TemplateFile]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")
        
    @staticmethod
    def validate_mimetype(value: str) -> MimeTypes:
        try:
            return MimeTypes(value)
        except ValueError:
            allowed_values = [mimetype.value for mimetype in MimeTypes]
            raise ValueError(f"Inválido valor: {value}. Os valores permitidos são: {allowed_values}")
        
    @staticmethod
    def validate_number(value: int) -> int:
        if value <= 0:
            raise ValueError(f"Inválido valor: {value}. Somente números maior que zero.")
        return value
        
