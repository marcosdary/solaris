from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow 
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

from app.config import SCOPES, ProjectPaths, Settings

class DriveAuth:
    def __init__(self):
        self.__scopes = SCOPES
        self.__path_token = ProjectPaths.BASE_DIR.value / "tokens.json"
        self.__path_credentials = ProjectPaths.BASE_DIR.value / "credentials.json"

    @property
    def path_token(self):
        return self.__path_token
    
    @property
    def path_credentials(self):
        return self.__path_credentials

    def __authenticate(self):
        creds = None
        if self.__path_token.exists():
            creds = Credentials.from_authorized_user_file(self.__path_token, self.__scopes)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.__path_credentials, self.__scopes
                )
                creds = flow.run_local_server(port=0)
            with open(self.__path_token, "w") as token:
                token.write(creds.to_json())

        return build("drive", "v3", credentials=creds)
    
    def __call__(self, settings: Settings):
        if not self.__path_credentials.exists():
            self.__path_credentials = settings.CREDENTIALS_FILE
            self.__path_token = settings.TOKEN_FILE
        
        return self.__authenticate()