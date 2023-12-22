from fastapi import FastAPI
from fastapi.responses import RedirectResponse

import requests
import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from google.auth.transport.requests import Request

from utils import upload_file

app = FastAPI()

scopes = ["https://www.googleapis.com/auth/drive.file"]

flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    "../secrets/client_secret.json",
    scopes=scopes,
    redirect_uri="http://127.0.0.1:8000/coderedirect",
)

@app.get("/")
def index():
    authorization_uri, state = flow.authorization_url(access_type="offline")
    print(authorization_uri, state)
    return RedirectResponse(authorization_uri)


@app.get("/coderedirect")
def coderedirect(code: str = None):
    try:
        flow.fetch_token(code=code)
        credentials = flow.credentials
        if credentials.expired and credentials.refresh_token: 
            print('refreshing token')
            credentials.refresh_token(Request())

        drive = build('drive', 'v3', credentials=credentials)
        res = upload_file(drive)


    except HttpError as error: 
        print(f"err: {error}")

    return res
