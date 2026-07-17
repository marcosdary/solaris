import asyncio
from pathlib import Path
from typing import List
import requests
from supabase import acreate_client
from abc import ABC, abstractmethod
from base64 import b64encode

from app.config import Settings

class BucketIntegration(ABC):
    def __init__(self, settings: Settings):
        self._settings = settings

    @abstractmethod
    async def upload(self, filepath: Path, mimetype: str) -> dict: ...

    @abstractmethod
    async def delete(self, filename_list: List[str]) -> None: ...

class GoogleDriveBucketService(BucketIntegration):
    def __init__(self, settings: Settings) -> None:
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

class SupabaseBucketService(BucketIntegration):
    def __init__(self, settings: Settings) -> None:
        super().__init__(settings)
        self._folder_public = self._settings.SUPABASE_FOLDER_PUBLIC
        self._bucket_name = self._settings.SUPABASE_BUCKET_NAME
 
    async def _get_client(self):
        return await acreate_client(
            supabase_url=self._settings.SUPABASE_URL,
            supabase_key=self._settings.SUPABASE_KEY,
        )

    async def upload(self, filepath: Path, mimetype: str) -> dict:
        client = await self._get_client()
        distpath = f"{self._folder_public}/{filepath.name}"

        with open(filepath, "rb") as f:
            await (
                client.storage.
                from_(
                    self._bucket_name
                ).upload(
                    path=distpath,
                    file=f,
                    file_options={"content-type": mimetype}
                )
            )

        public_url = (
            await client.storage
            .from_(
               self._bucket_name
            )
            .get_public_url(distpath)
        )

        return {
            "name": filepath.name,
            "mimeType": mimetype,
            "distpath": distpath, 
            "url": public_url
        }
     
    async def download(self, distpath: str) -> dict:
        client = await self._get_client()

        response = (
            await client.storage
            .from_(self._bucket_name)
            .create_signed_url(
                distpath,
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
            await client.storage
            .from_(self._settings.SUPABASE_BUCKET_NAME)
            .remove(filename_list)
        )
        
        return
    

__all__ = ["GoogleDriveBucketService", "SupabaseBucketService", "BucketIntegration"]
