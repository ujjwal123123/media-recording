import { FormEventHandler, useRef } from "react";

export default function GetVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const textInput = useRef<HTMLInputElement>(null);

  const fetchVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const url = "/api/video/" + textInput.current?.value;
    const response = await fetch(url);
    const blob = await response.blob();

    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(blob);
      videoRef.current.play();
    }
  };

  return (
    <>
      <h1>Get a video</h1>
      <form onSubmit={fetchVideo}>
        <input ref={textInput} type="text" name="name" />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Video:</p>
        <video ref={videoRef}></video>
      </div>
    </>
  );
}
