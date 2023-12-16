// import { useState } from "react";
import Button from "./button";

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
  const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"];

  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <Ul names={names} />

      <Button />
    </div>
  );
}
