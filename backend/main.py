from fastapi import FastAPI, UploadFile, Response, status
from fastapi.responses import FileResponse
import os
import uuid

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Hello World"}


@app.put("/upload")
async def upload_video(file: UploadFile, response: Response):
    if file is None or file.filename is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "No file"}
    filename: str = f"/tmp/{uuid.uuid4()}"

    with open(filename, "wb") as f:
        f.write(file.file.read())
        f.close()

    return {"filename": filename.lstrip("/tmp/")}


@app.get("/video/{filename}")
async def get_video(filename: str, response: Response):
    if filename is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "No file"}
    if not os.path.exists("/tmp/" + filename):
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"error": "File not found"}
    return FileResponse("/tmp/" + filename)
