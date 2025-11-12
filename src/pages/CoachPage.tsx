import React from "react";
import ChessGame from "../components/ChessGame";

export default function CoachPage() {
  const roomId = "session-12345"; // generate dynamically: appointment ID / UUID
  return (
    <div>
      <h1>Coach panel</h1>
      <ChessGame roomId={roomId} role="coach" />
    </div>
  );
}