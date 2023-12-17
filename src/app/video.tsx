export function StreamView({ stream }: { stream: MediaStream }) {
  return <video width="640" controls autoPlay ref={stream}></video>;
}

export function VideoPlayer({ source }: { source: string }) {
  return <video width="640" controls src={source}></video>;
}
