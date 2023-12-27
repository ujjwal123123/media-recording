"use client";
import { Dispatch, SetStateAction, useRef } from "react";
import { RecordingState } from "./utils";

export default function CameraButton({
  recordingState,
  setRecordingState,
  setMediaSource,
}: {
  recordingState: RecordingState;
  setRecordingState: Dispatch<SetStateAction<RecordingState>>;
  setMediaSource: Dispatch<SetStateAction<string | MediaStream | null>>;
}) {
  const recordedChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  function startRecording() {
    setRecordingState(RecordingState.RequestingPermission);
    setMediaSource(null);

    let displayStreamPromise = navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false, // TODO: give user option to record system audio or not
    });
    let userAudioStreamPromise = navigator.mediaDevices.getUserMedia({
      video: false, // TODO: give user an option to record their camera as well
      audio: true, // TODO: give user option to record audio or not
    });

    Promise.all([displayStreamPromise, userAudioStreamPromise]).then(
      ([displayStream, userAudioStream]) => {
        let combinedStream = new MediaStream([
          ...displayStream.getTracks(),
          ...userAudioStream.getTracks(),
        ]);
        mediaRecorder.current = new MediaRecorder(combinedStream);
        recordedChunks.current = [];
        mediaStream.current = combinedStream;
        mediaRecorder.current.ondataavailable = (event) => {
          recordedChunks.current.push(event.data);
        };
        mediaRecorder.current.start();
        setRecordingState(RecordingState.Recording);
        setMediaSource(combinedStream);

        mediaRecorder.current.onstop = (event) => {
          mediaStream.current?.getTracks().forEach((track) => track.stop());
          const blob = new Blob(recordedChunks.current, { type: "video/webm" });
          recordedChunks.current = [];
          const videoUrl = URL.createObjectURL(blob);
          setMediaSource(videoUrl);
          setRecordingState(RecordingState.Recorded);
        };
      }
    );
  }

  function stopRecording() {
    mediaRecorder.current?.requestData;
    mediaRecorder.current?.stop();
  }

  if (
    recordingState == RecordingState.Ready ||
    recordingState == RecordingState.Recorded
  ) {
    return <button onClick={startRecording}>Start a new recording</button>;
  } else {
    return <button onClick={stopRecording}>Stop recording</button>;
  }
}
