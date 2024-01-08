"use client";
import { Dispatch, SetStateAction } from "react";
import { RecordingState } from "./utils";

export default function CameraButton({
  recordingState,
  requestRecording,
  stopRecording,
}: {
  recordingState: RecordingState;
  requestRecording: () => void;
  stopRecording: () => void;
}) {
  if (
    recordingState == RecordingState.Ready ||
    recordingState == RecordingState.Recorded
  ) {
    return <button onClick={requestRecording}>Start a new recording</button>;
  } else if (recordingState == RecordingState.RequestingPermission) {
    return <button disabled>Requesting permission...</button>;
  } else {
    return <button onClick={stopRecording}>Stop recording</button>;
  }
}
