import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext.jsx";
import apiClient from "@/lib/api.js";
import { ENDPOINTS } from "@/lib/endpoints.js";

const CoachChat = () => {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Socket Connection
  useEffect(() => {
    if (!token) return;

    socket.current = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    socket.current.on("receiveMessage", (message) => {
      setSelectedStudent((currentStudent) => {
        // Only append message if it belongs to the currently open chat
        if (currentStudent && currentStudent._id === message.sender) {
          setMessages((prev) => [...prev, message]);
        }
        return currentStudent;
      });
    });

    return () => {
      if (socket.current) {
        socket.current.off("receiveMessage");
        socket.current.disconnect();
      }
    };
  }, [token]);

  // 2. Fetch Students
  useEffect(() => {
    const fetchStudentsForCoach = async () => {
      try {
        const response = await apiClient.get(
          ENDPOINTS.CHATS.GET_STUDENTS_FOR_COACH
        );
        setStudents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    fetchStudentsForCoach();
  }, []);

  // 3. Load Chat History
  const handleSelectStudent = async (student) => {
    if (selectedStudent?._id === student._id) return;

    setSelectedStudent(student);
    try {
      const response = await apiClient.get(
        ENDPOINTS.CHATS.GET_CHAT_HISTORY(student._id)
      );
      setMessages(response.data.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setMessages([]);
    }
  };

  // 4. Send Handler
  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !selectedStudent ||
      !socket.current ||
      !socket.current.connected
    ) {
      return;
    }

    // Emit Event
    socket.current.emit("sendMessage", {
      receiverId: selectedStudent._id,
      content: newMessage.trim(),
    });

    // Optimistic UI Update
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        sender: user._id,
        receiver: selectedStudent._id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewMessage("");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white">
      {/* Sidebar: Student List */}
      <div className="w-1/4 bg-white/5 p-4 border-r border-white/10">
        <h2 className="text-xl font-bold mb-4">My Students</h2>
        {students.map((student) => (
          <button
            key={student._id}
            onClick={() => handleSelectStudent(student)}
            className={`block w-full text-left p-3 rounded-lg mb-2 ${
              selectedStudent?._id === student._id
                ? "bg-blue-600"
                : "hover:bg-white/10"
            }`}
          >
            {student.fullname}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        {selectedStudent ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-3 flex ${
                    msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                      msg.sender === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
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
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a student to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachChat;