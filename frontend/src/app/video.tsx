"use client";
import { RecordingState } from "./utils";

function uploadVideoToServer(videoUrl: string) {
  // upload a blob to the server
  const data = new FormData();
  fetch(videoUrl)
    .then((r) => r.blob())
    .then((blob) => {
      data.append("file", blob);
      return fetch("/api/upload", {
        method: "PUT",
        body: data,
      });
    })
    .then((res: Response) => {
      console.log("Uploaded to server");
      console.log(res.json());
    });
}

export function VideoPlayer({
  mediaSource,
  recordingState,
}: {
  mediaSource: string | MediaStream | null;
  recordingState: RecordingState;
}) {
  if (
    recordingState == RecordingState.Ready ||
    recordingState == RecordingState.RequestingPermission
  ) {
    return <p>No video source</p>;
  } else if (
    recordingState == RecordingState.Recording &&
    mediaSource instanceof MediaStream
  ) {
    // return <p>Recording video...</p>;
    return (
      <>
        <p>Recording video</p>
        <video
          muted
          ref={(ref) => {
            if (ref) ref.srcObject = mediaSource;
          }}
          autoPlay
          width="600"
        />
      </>
    );
  } else if (
    recordingState == RecordingState.Recorded &&
    typeof mediaSource == "string"
  ) {
    return (
      <>
        <video src={mediaSource} controls autoPlay width="600" />
        <br />
        <a href={mediaSource} download>
          Download recording
        </a>
        <br />
        <a href="#" onClick={() => uploadVideoToServer(mediaSource)}>
          Upload to the server
        </a>
      </>
    );
  } else {
    return <p color="red">Unknown state {recordingState}</p>;
  }
}
