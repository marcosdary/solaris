import asyncio
from pathlib import Path
from typing import List
import requests
from supabase import acreate_client
from abc import ABC, abstractmethod
from base64 import b64encode

from app.config import Settings

class BucketService(ABC):
    def __init__(self, settings: Settings):
        self._settings = settings

    @abstractmethod
    async def upload(self, filepath: Path, mimetype: str) -> dict: ...

    @abstractmethod
    async def delete(self, filename_list: List[str]) -> None: ...

class GoogleDriveBucketService(BucketService):
    def __init__(self, settings: Settings) -> None:
        print(settings)
        super().__init__(settings=settings)

    async def upload(self, filepath: Path, mimetype: str) -> dict:
        return await asyncio.to_thread(self._upload_sync, filepath, mimetype)

    def _upload_sync(self, filepath: Path, mimetype: str) -> dict:
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
                f"{self._settings.APP_SCRIPT_KEY}/exec"
            )

            payload = {
                "key": self._settings.API_KEY,
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

        except Exception:
            raise 

class SupabaseBucketService(BucketService):
    def __init__(self, settings: Settings) -> None:
        super().__init__(settings)

    async def _get_client(self):
        return await acreate_client(
            supabase_url=self._settings.SUPABASE_URL,
            supabase_key=self._settings.SUPABASE_KEY,
        )

    async def upload(self, filepath: Path, mimetype: str) -> dict:
        client = await self._get_client()

        with open(filepath, "rb") as f:
            await (
                client.storage.
                from_(
                    self._settings.SUPABASE_BUCKET_NAME
                ).upload(
                    path=filepath.name,
                    file=f,
                    file_options={"content-type": mimetype}
                )
            )

        public_url = (
            client.storage.from_(
                self._settings.SUPABASE_BUCKET_NAME
            ).get_public_url(filepath.name)
        )

        return {
            "success": True,
            "name": filepath.name,
            "mimeType": mimetype,
            "url": public_url
        }
     
    async def download(self, filename: str) -> dict:
        client = await self._get_client()

        response = (
            client.storage
            .from_(self._settings.SUPABASE_BUCKET_NAME)
            .create_signed_url(
                filename,
                3600,
                {"download": True},
            )
        )
            
        return {
            "url": response["signedURL"],
        }
    
    async def delete(self, filename_list: List[str]) -> None:
        client = await self._get_client()

        (
            client.storage
            .from_(self._settings.SUPABASE_BUCKET_NAME)
            .remove(filename_list)
        )
        
        return
    

__all__ = ["GoogleDriveBucketService", "SupabaseBucketService", "BucketService"]
