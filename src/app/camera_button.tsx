"use client";
import { Dispatch, SetStateAction, useRef } from "react";
import "./button.css";
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

    let displayStream = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // TODO: give user option to record audio or not
    });

    displayStream.then((stream) => {
      mediaRecorder.current = new MediaRecorder(stream);
      mediaStream.current = stream;
      mediaRecorder.current.ondataavailable = (event) => {
        recordedChunks.current.push(event.data);
      };
      mediaRecorder.current.start();
      setRecordingState(RecordingState.Recording);
      setMediaSource(stream);

      mediaRecorder.current.onstop = (event) => {
        mediaStream.current?.getTracks().forEach((track) => track.stop());
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setMediaSource(videoUrl);
        setRecordingState(RecordingState.Recorded);
      };
    });
  }

  function stopRecording() {
    mediaRecorder.current?.requestData;
    mediaRecorder.current?.stop();
  }

  if (
    recordingState == RecordingState.Ready ||
    recordingState == RecordingState.Recorded
  ) {
    return <button onClick={startRecording}>Share camera</button>;
  } else {
    return <button onClick={stopRecording}>Stop sharing camera</button>;
  }
}
