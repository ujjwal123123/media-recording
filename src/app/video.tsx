"use client";
import { RecordingState } from "./utils";

export function VideoPlayer({
  mediaSource,
  recordingState,
}: {
  mediaSource: Blob | MediaStream | null;
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
    mediaSource instanceof Blob
  ) {
    const videoUrl = URL.createObjectURL(mediaSource);
    console.log("videoUrl", videoUrl);

    return (
      <>
        <video controls autoPlay width="600">
          <source src={videoUrl} type="video/webm" />
        </video>
        <br />
        <a href={videoUrl} download>
          Download recording
        </a>
      </>
    );
  } else {
    return <p color="red">Unknown state {recordingState}</p>;
  }
}
