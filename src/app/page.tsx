// import { useState } from "react";
import CameraButton from "./camera_button";
import ScreenButton from "./screen_button";

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
  return (
    <div>
      <Header title="Screen and Presentation Recorder" />

      <CameraButton />
      <ScreenButton />
    </div>
  );
}
