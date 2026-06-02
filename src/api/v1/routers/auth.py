from fastapi import APIRouter, status, Depends, Request
from google_auth_oauthlib.flow import Flow

from fastapi.responses import RedirectResponse

from src.config import get_settings, SCOPES, Settings, BASE_DIR

router = APIRouter(tags=["auth"])

@router.get("/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def login_google(settings: Settings = Depends(get_settings)):
    cred_secret_file = BASE_DIR / "credentials.json"

    flow = Flow.from_client_secrets_file(
        cred_secret_file,
        scopes=SCOPES
    )

    flow.redirect_uri = settings.REDIRECT_URI

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )
    print(authorization_url)

    return RedirectResponse(authorization_url)

@router.get("/callback")
async def callback(request: Request, settings: Settings = Depends(get_settings)):
    cred_secret_file = BASE_DIR / "credentials.json"
    flow = Flow.from_client_secrets_file(
        cred_secret_file,
        scopes=SCOPES
    )

    flow.redirect_uri = settings.REDIRECT_URI

    flow.fetch_token(
        authorization_response=str(request.url)
    )

    credentials = flow.credentials

    return {
        "access_token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "expiry": str(credentials.expiry)
    }