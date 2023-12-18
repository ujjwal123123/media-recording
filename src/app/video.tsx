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
    return <p>No video source {typeof mediaSource}</p>;
  } else if (
    recordingState == RecordingState.Recording &&
    mediaSource instanceof MediaStream
  ) {
    // return <p>Recording... {typeof mediaSource}</p>;
    return (
      <video
        ref={(ref) => {
          if (ref) ref.srcObject = mediaSource;
        }}
        autoPlay
        width="600"
      />
    );
  } else if (
    recordingState == RecordingState.Recorded &&
    typeof mediaSource == "string"
  ) {
    console.log("mediaSource", mediaSource);
    // play bugs bunny
    return <video src={mediaSource} controls autoPlay width="600" />;
  }
}
