import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext"; // ✅ logged-in student

const socket = io("http://localhost:5000"); // ✅ backend socket server

const StudentChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [coach, setCoach] = useState(null);

  // ✅ Fetch assigned coach + previous messages
  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/student/${user._id}`
        );
        setMessages(res.data.messages || []);
        setCoach(res.data.coach);
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };

    fetchData();

    // ✅ Join student socket room
    socket.emit("joinRoom", { userId: user._id, role: "student" });

    // ✅ Receive messages
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  // ✅ Send message
  const handleSend = () => {
    if (!newMessage.trim() || !coach) return;

    const msgData = {
      senderId: user._id,
      receiverId: coach._id,
      text: newMessage,
      role: "student",
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">💬 Chat with Coach</h1>

      <div className="bg-white/10 rounded-xl p-4 h-[70vh] overflow-y-auto mb-4">
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
                  ? "bg-blue-600 text-white"
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
          className="bg-green-600 hover:bg-green-700 px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentChat;
