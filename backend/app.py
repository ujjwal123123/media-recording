from fastapi import FastAPI, UploadFile, Response, status
from fastapi.responses import FileResponse, RedirectResponse
import os
import uuid
import requests
import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request
from utils import upload_file

app = FastAPI()

google_api_scopes = ["https://www.googleapis.com/auth/drive.file"]

# flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
#     "../secrets/client_secret.json",
#     scopes=google_api_scopes,
#     redirect_uri="http://127.0.0.1:8000/coderedirect",
# )


# @app.get("/")
# async def index():
#     authorization_uri, state = flow.authorization_url(access_type="offline")
#     print(authorization_uri, state)
#     return RedirectResponse(authorization_uri)


# @app.get("/coderedirect")
# async def coderedirect(code: str):
#     try:
#         flow.fetch_token(code=code)
#         credentials = flow.credentials
#         if credentials.expired and credentials.refresh_token:
#             print("refreshing token")
#             credentials.refresh_token(Request())

#         drive = build("drive", "v3", credentials=credentials)
#         res = upload_file(drive)

#         return res

#     except HttpError as error:
#         print(f"err: {error}")


@app.put("/upload")
async def upload_video(file: UploadFile, response: Response):
    """Upload video to the file system"""
    if file is None or file.filename is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "No file"}
    assert file.content_type == "video/webm"
    filename: str = f"/tmp/{uuid.uuid4()}.webm"

    with open(filename, "wb") as f:
        f.write(file.file.read())
        f.close()

    return {"filename": filename.lstrip("/tmp/")}


@app.get("/video/{filename}")
async def get_video(filename: str, response: Response):
    """Send video from the file system to the client"""
    if filename is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "No file"}
    if not os.path.exists("/tmp/" + filename):
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "File not found"}

    return FileResponse("/tmp/" + filename, media_type="video/webm")
