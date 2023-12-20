"use client";
import { useState } from "react";
import CameraButton from "./camera_button";
import ScreenButton from "./screen_button";
import { RecordingState } from "./utils";
import { VideoPlayer } from "./video";
import GetVideo from "./getVideo";

function Header({ title }: { title: string }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

function Ul({ names }: { names: string[] }) {
  return (
    <ul>
      {names.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  const [mediaSource, setMediaSource] = useState<null | MediaStream | string>(
    null
  ); // media to be displayed in video element
  const [recordingState, setRecordingState] = useState(RecordingState.Ready);

  return (
    <>
      <Header title="Screen and Presentation Recorder" />

      {/* <CameraButton
        recordingState={recordingState}
        setRecordingState={setRecordingState}
        setMediaSource={setMediaSource}
      /> */}
      <ScreenButton
        recordingState={recordingState}
        setRecordingState={setRecordingState}
        setMediaSource={setMediaSource}
      />
      <br />
      <VideoPlayer mediaSource={mediaSource} recordingState={recordingState} />

      <br />
      <GetVideo />
    </>
  );
}
