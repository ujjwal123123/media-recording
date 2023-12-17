"use client";
import { useState } from "react";
import "./button.css";

let recordedChunks: Blob[] = [];
let mediaRecorder: MediaRecorder | null = null;
let mediaStream: MediaStream | null = null;

enum RecordingState {
  Ready, // Recording stopped or ready to record
  RequestingPermission,
  PermissionDenied,
  Recording,
}

export default function Button() {
  const [recordingState, setRecordingState] = useState(RecordingState.Ready);

  function startRecording() {
    setRecordingState(RecordingState.RequestingPermission);
    let displayStream = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // TODO: give user option to record audio or not
    });

    displayStream.catch((error) => {
      setRecordingState(RecordingState.PermissionDenied);
      throw error;
    });

    displayStream.then((stream) => {
      setRecordingState(RecordingState.Recording);
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        recordedChunks.push(event.data);
      };
      mediaRecorder.onstop = (event) => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);

        const video = document.createElement("video");
        video.src = videoUrl;
        video.controls = true;
        document.body.appendChild(video);
        video.width = 640;

        console.log("recording stopped");
      };
      mediaRecorder.start();

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      video.width = 640;
      document.body.appendChild(video);

      mediaStream = stream;

      stream.getTracks().forEach((track) => (track.onended = stopRecording));
    });
  }

  function stopRecording() {
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaRecorder?.requestData;
    mediaRecorder?.stop();
    mediaRecorder = null;
    mediaStream = null;
    setRecordingState(RecordingState.Ready);
  }

  if (recordingState == RecordingState.Ready) {
    return <button onClick={startRecording}>Share camera</button>;
  } else {
    return <button onClick={stopRecording}>Stop sharing camera</button>;
  }
}
