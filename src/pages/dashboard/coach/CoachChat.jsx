import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // ✅ logged-in coach

const socket = io("http://localhost:5000");

const CoachChat = () => {
  const { user } = useAuth(); // coach user
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ Fetch students assigned to this coach
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/coach/${user._id}/students`
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();

    // ✅ Join coach room
    socket.emit("joinRoom", { userId: user._id, role: "coach" });

    socket.on("receiveMessage", (msg) => {
      if (msg.senderId === selectedStudent?._id || msg.receiverId === user._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user, selectedStudent]);

  // ✅ Select student & load chat history
  const loadChat = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/chat/conversation/${user._id}/${studentId}`
      );
      setMessages(res.data);
      const student = students.find((s) => s._id === studentId);
      setSelectedStudent(student);
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  // ✅ Send message
  const handleSend = () => {
    if (!newMessage.trim() || !selectedStudent) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedStudent._id,
      text: newMessage,
      role: "coach",
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-white/10 p-4">
        <h2 className="text-xl font-bold mb-4">🎓 My Students</h2>
        {students.map((student) => (
          <button
            key={student._id}
            onClick={() => loadChat(student._id)}
            className={`block w-full text-left p-2 rounded-lg mb-2 ${
              selectedStudent?._id === student._id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            {student.name}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-6">
        {selectedStudent ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Chat with {selectedStudent.name}
            </h2>

            <div className="flex-1 bg-white/10 rounded-xl p-4 overflow-y-auto mb-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 flex ${
                    msg.senderId === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs ${
                      msg.senderId === user._id
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex">
              <input
                type="text"
                className="flex-1 p-3 rounded-l-lg bg-black/40 border border-gray-600 text-white"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">Select a student to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default CoachChat;
