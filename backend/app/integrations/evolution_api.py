from requests import post

class EvolutionAPIIntegration:

    def __init__(self, api_key: str, url: str, instance: str) -> None:
        self._base_url = url
        self._api_key = api_key
        self._instance = instance
    
    def send_text(self, number: str, text: str) -> None:
        url = f"{self._base_url}/message/sendText/{self._instance}"
        headers = {
            "apikey": self._api_key
        }
        body = {
            "number": number,
            "text": text
        }
        response = post(url=url, headers=headers, json=body)
        response.raise_for_status()
        return 
    
