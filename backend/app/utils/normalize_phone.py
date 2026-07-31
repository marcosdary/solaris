from phonenumbers import (
    format_number, 
    parse, 
    region_code_for_number,
    PhoneNumberFormat,
    is_possible_number,
    is_valid_number
)
from phonenumbers import NumberParseException
from typing import Optional, Annotated
from pydantic import BaseModel, ConfigDict, Field

class NormalizedPhoneSchema(BaseModel):
    e164: str
    country_code: int
    national_number: str
    region: Annotated[Optional[str], Field(default=None)]

    model_config = ConfigDict(frozen=True)


class NormalizePhoneUtil:
    def __init__(self, phone: str, default_region: str = "BR"):
        self.phone = phone
        self.default_region = default_region


    def _normalize(
        self,
    ) -> NormalizedPhoneSchema:
        """
        Normaliza um telefone para E.164.

        Se o telefone começar com '+', ele será interpretado
        como um número internacional.

        Caso contrário, será utilizada a região informada ou
        a região padrão da classe.
        """

        if not self.phone:
            raise ValueError("Telefone não pode ser vazio.")

        region = self.default_region

        try:
            if self.phone.startswith("+"):
                parsed = parse(self.phone, None)
            else:
                parsed = parse(self.phone, region)

        except NumberParseException as exc:
            raise ValueError(
                f"Não foi possível interpretar o telefone: {self.phone}"
            ) from exc

        if not is_possible_number(parsed):
            raise ValueError(
                f"O telefone possui uma estrutura impossível: {self.phone}"
            )

        if not is_valid_number(parsed):
            raise ValueError(
                f"O telefone não é válido: {self.phone}"
            )

        e164 = format_number(
            parsed,
            PhoneNumberFormat.E164,
        )

        region_code = region_code_for_number(parsed)

        return NormalizedPhoneSchema(
            e164=e164,
            country_code=parsed.country_code,
            national_number=str(parsed.national_number),
            region=region_code,
        )
    
    def format_e164(self) -> str:
        normalized = self._normalize()
        return normalized.e164

    def format_international(self) -> str:
        """
        Retorna o telefone no formato internacional legível.

        Exemplo:

            +5598923458593

        retorna algo como:

            +55 98 92345-8593
        """

        normalized = self._normalize()

        parsed = parse(normalized.e164, None)

        return format_number(
            parsed,
            PhoneNumberFormat.INTERNATIONAL,
        )

    def format_national(
        self
    ) -> str:
        """
        Retorna o telefone no formato nacional da região.
        """

        normalized = self._normalize()

        parsed = parse(
            normalized.e164,
            None,
        )

        return format_number(
            parsed,
            PhoneNumberFormat.NATIONAL,
        )
    
    def normalize_whatsapp_number(self) -> str:
        """
        Aplica regras específicas para números recebidos
        através do WhatsApp.

        Atualmente trata o caso brasileiro em que o número
        recebido pelo remoteJid possui 8 dígitos nacionais
        e precisa do 9º dígito para representar o celular.
        """

        # Somente aplica a regra abaixo para Brasil.
        if not self.phone.startswith("55"):
            return self.phone

        # 55 + DDD + número
        if len(self.phone) != 12:
            return f"+{self.phone}"

        ddd = self.phone[2:4]
        national_number = self.phone[4:]

        # Celular brasileiro sem o 9.
        if len(national_number) == 8:
            return f"+55{ddd}9{national_number}"

        return f"+{self.phone}"



    

    