from fastapi import FastAPI, UploadFile, File, Response, status
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
    filename = f"/tmp/{uuid.uuid4()}"

    with open(filename, "wb") as f:
        f.write(file.file.read())
        f.close()

    return {"filename": filename}
