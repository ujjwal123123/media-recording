"use client";
import { useState } from "react";
import CameraButton from "./camera_button";
import ScreenButton from "./screen_button";
import { RecordingState } from "./utils";
import { VideoPlayer } from "./video";
import GetVideo from "./getVideo";
import "./style.scss";

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

  return (
    <>
      <Hero />

      {/* <CameraButton
        recordingState={recordingState}
        setRecordingState={setRecordingState}
        setMediaSource={setMediaSource}
      /> */}
      <div className="container">
        <ScreenButton
          recordingState={recordingState}
          setRecordingState={setRecordingState}
          setMediaSource={setMediaSource}
        />
        <VideoPlayer
          mediaSource={mediaSource}
          recordingState={recordingState}
        />
      </div>

      {/* <br />
      <GetVideo /> */}
    </>
  );
}
