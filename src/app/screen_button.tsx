"use client";
import { useState } from "react";
import "./button.css";

export default function Button() {
  const [likes, setLikes] = useState(0);

  function handleClick() {
    let displayStream = navigator.mediaDevices.getDisplayMedia();
    displayStream.then((stream) => {
      stream.getTracks().forEach((track) => console.log(track.label));

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      video.width = 640;
      document.body.appendChild(video);
    });
  }

  return <button onClick={handleClick}>Share screen</button>;
}
