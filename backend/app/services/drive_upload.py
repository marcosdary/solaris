from pathlib import Path
import requests
from base64 import b64encode

from app.config import Settings

class DriveUploadService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def upload(self, filepath: Path, mimetype: str) -> dict:
        try:
            if not filepath.exists():
                raise FileNotFoundError(
                    f"Arquivo não encontrado em: {filepath.name}"
                )

            # Lê e converte para Base64
            with open(filepath, "rb") as f:
                file_b64 = b64encode(f.read()).decode("utf-8")

            url = (
                f"https://script.google.com/macros/s/"
                f"{self.settings.APP_SCRIPT_KEY}/exec"
            )

            payload = {
                "key": self.settings.API_KEY,
                "mimetype": mimetype,
                "filename": filepath.name,
                "content": file_b64,
            }

            response = requests.post(
                url,
                json=payload,  
                timeout=60
            )

            response.raise_for_status()

            data = response.json()

            if not data.get("success"):
                raise Exception(
                    f"Erro interno no script do Google: {data.get('error')}"
                )

            return data

        except requests.exceptions.RequestException as exc:
            raise Exception(
                f"Erro na comunicação com o servidor: {exc}"
            )

        except Exception as exc:
            raise 