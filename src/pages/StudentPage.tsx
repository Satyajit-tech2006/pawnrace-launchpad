import React from "react";
import ChessGame from "../components/ChessGame";

export default function StudentPage() {
  const roomId = "session-12345"; // must match coach's roomId
  return (
    <div>
      <h1>Student panel</h1>
      <ChessGame roomId={roomId} role="student" />
    </div>
  );
}