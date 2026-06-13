from fastapi.exceptions import RequestValidationError

class ValidationException:
    def __init__(self, exc: RequestValidationError) -> None:
        self.exc = exc 

    def generate_dict_for_exc(self):
        messages = []

        for error in self.exc.errors():
            msg = error["msg"]
            loc = error["loc"]
            if error["type"] == "missing":
                msg = "O campo é obrigatório"

            messages.append({
                "msg": msg,
                "loc": loc
            })
            
        return messages