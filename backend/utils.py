from googleapiclient.http import MediaFileUpload
import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def upload_file(drive):
    try:
        media = MediaFileUpload("../tsconfig.json", mimetype="application/json")
        metadata = {"name": "test.json"}
        file = (
            drive.files().create(body=metadata, media_body=media, fields="id").execute()
        )
        print(f'File ID: {file.get("id")}')

        return file.get("id")

    except HttpError as error:
        print(f"error: {error}")
