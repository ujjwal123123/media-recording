"use client";
import { useRef, useState } from "react";
import ScreenButton from "./screen_button";
import { RecordingState } from "./utils";
import { VideoPlayer } from "./video";
import "./style.scss";

function Hero() {
  return (
    <div className="hero">
      <h1>Record screen and presentations, for free!</h1>
      <h2>Without downloading any software!</h2>
    </div>
  );
}

export default function HomePage() {
  const [mediaSource, setMediaSource] = useState<null | MediaStream | string>(
    null
  ); // media to be displayed in video element
  const [recordingState, setRecordingState] = useState(RecordingState.Ready);

  const recordedChunks = useRef<Blob[]>([]);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  function requestRecording() {
    setRecordingState(RecordingState.RequestingPermission);

    let displayStreamPromise = navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false, // TODO: give user option to record system audio or not
    });
    let userAudioStreamPromise = navigator.mediaDevices.getUserMedia({
      video: false, // TODO: give user an option to record their camera as well
      audio: true, // TODO: give user option to record audio or not
    });

    Promise.all([displayStreamPromise, userAudioStreamPromise])
      .then(([displayStream, userAudioStream]) => {
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
        URL.revokeObjectURL(mediaSource as string);
        setMediaSource(null);
        setRecordingState(RecordingState.Recording);
        setMediaSource(combinedStream);

        mediaRecorder.current.onstop = (event) => {
          stopRecording();
        };
        combinedStream
          .getTracks()
          .forEach((track) => (track.onended = stopRecording));
      })
      .catch((error) => {
        setRecordingState(RecordingState.Recorded);
      });
  }

  function stopRecording() {
    mediaRecorder.current?.requestData;
    mediaRecorder.current?.stop();
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    const blob = new Blob(recordedChunks.current, { type: "video/webm" });
    recordedChunks.current = [];
    const videoUrl = URL.createObjectURL(blob);
    setMediaSource(videoUrl);
    setRecordingState(RecordingState.Recorded);
  }

  return (
    <>
      <Hero />

      <div className="container">
        <ScreenButton
          recordingState={recordingState}
          requestRecording={requestRecording}
          stopRecording={stopRecording}
        />
        <VideoPlayer
          mediaSource={mediaSource}
          recordingState={recordingState}
        />
      </div>
    </>
  );
}
