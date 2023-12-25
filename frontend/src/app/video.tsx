"use client";
import { RecordingState } from "./utils";
import { useRef } from "react";

function uploadVideoToServer(
  videoUrl: string,
  infoText: React.RefObject<HTMLParagraphElement>
) {
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
    .then(async (res: Response) => {
      const data = await res.json();
      if (infoText.current) {
        infoText.current.innerText = `Uploaded to server with filename ${data.filename}. Use this filename to get the video from the server.`;
      }
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
    const infoText = useRef<HTMLParagraphElement>(null);
    return (
      <>
        <video src={mediaSource} controls autoPlay width="600" />
        <br />
        <a href={mediaSource} download>
          Download recording
        </a>
        <br />
        <a href="#" onClick={() => uploadVideoToServer(mediaSource, infoText)}>
          Upload to the server
        </a>
        <p ref={infoText}></p>
      </>
    );
  } else {
    return <p color="red">Unknown state {recordingState}</p>;
  }
}
