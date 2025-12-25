import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext.jsx";
import apiClient from "@/lib/api.js";
import { ENDPOINTS } from "@/lib/endpoints.js";

const StudentChat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [coach, setCoach] = useState(null);
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Socket Connection
  useEffect(() => {
    if (!token) return;

    socket.current = io(import.meta.env.VITE_CHAT_SOCKET_URL, {
      auth: { token },
    });

    socket.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage");
        socket.current.disconnect();
      }
    };
  }, [token]);

  // 2. Fetch Coach & History
  useEffect(() => {
    if (!user?._id) return;

    const fetchCoachAndHistory = async () => {
      try {
        // Step A: Get the student's assigned coach via their course
        // ✅ FIXED: Updated to match your endpoints.js file key
        const courseResponse = await apiClient.get(
          ENDPOINTS.COURSES.GET_MY_COURSES_AS_STUDENT
        );
        
        const primaryCourse = courseResponse.data.data?.[0];

        if (!primaryCourse || !primaryCourse.coach) {
          console.warn("No assigned coach found for this student.");
          return;
        }

        const coachInfo = primaryCourse.coach;
        setCoach(coachInfo);

        // Step B: Fetch chat history
        const historyResponse = await apiClient.get(
          ENDPOINTS.CHATS.GET_CHAT_HISTORY(coachInfo._id)
        );
        setMessages(historyResponse.data.data);

      } catch (err) {
        console.error("Error loading chat data:", err);
      }
    };

    fetchCoachAndHistory();
  }, [user]);

  // 3. Send Handler
  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !coach ||
      !socket.current ||
      !socket.current.connected
    ) {
      return;
    }

    socket.current.emit("sendMessage", {
      receiverId: coach._id,
      content: newMessage.trim(),
    });

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        sender: user._id,
        receiver: coach._id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewMessage("");
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white">
      <div className="flex-1 flex flex-col p-6 max-w-5xl mx-auto w-full">
        <div className="mb-4 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold">
            Chat with {coach ? coach.fullname : "your Coach"}
          </h1>
          {coach && (
            <p className="text-sm text-gray-400">
              Direct line to your instructor
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar pr-2">
          {coach ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${
                    msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] break-words shadow-md ${
                      msg.sender === user._id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-700 text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                    <div className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Finding your coach...</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={!coach}
            placeholder={coach ? "Type a message..." : "Connecting..."}
            className="flex-1 p-4 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!coach}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentChat;