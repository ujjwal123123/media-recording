"use client";
import { RecordingState } from "./utils";

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
    console.log("videoUrl", mediaSource);

    return (
      <>
        <video src={mediaSource} controls autoPlay width="600" />
        <br />
        <a href={mediaSource} download>
          Download recording
        </a>
      </>
    );
  } else {
    return <p color="red">Unknown state {recordingState}</p>;
  }
}
