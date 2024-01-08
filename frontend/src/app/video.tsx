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

export function DownloadButton({ mediaSource }: { mediaSource: string }) {
  return (
    <a id="download-button" href={mediaSource} download>
      Download this recording
    </a>
  );
}

export function StateMessage({
  recordingState,
}: {
  recordingState: RecordingState;
}) {
  if (recordingState == RecordingState.Ready) {
    return <p>Ready to record</p>;
  } else if (recordingState == RecordingState.RequestingPermission) {
    return <p>Requesting permission...</p>;
  } else if (recordingState == RecordingState.Recording) {
    return <p>Recording...</p>;
  } else if (recordingState == RecordingState.Recorded) {
    return <p>Recorded</p>;
  } else {
    throw new Error("unknown recording state");
  }
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
    recordingState == RecordingState.RequestingPermission ||
    mediaSource == null
  ) {
    return <StateMessage recordingState={recordingState} />;
  } else if (
    recordingState == RecordingState.Recording &&
    mediaSource instanceof MediaStream
  ) {
    return (
      <>
        <StateMessage recordingState={recordingState} />;
        <video
          muted
          ref={(ref) => {
            if (ref) ref.srcObject = mediaSource;
          }}
          autoPlay
        />
      </>
    );
  } else if (
    recordingState == RecordingState.Recorded &&
    typeof mediaSource == "string"
  ) {
    return (
      <>
        <DownloadButton mediaSource={mediaSource.toString()} />
        <br />
        <StateMessage recordingState={recordingState} />
        <video src={mediaSource} controls autoPlay />
      </>
    );
  } else {
    throw new Error("unknown video state");
  }
}
