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

  // 1. Establish Authenticated Socket Connection
  useEffect(() => {
    if (!token) return;

    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token }
    });

    // 4. Listen for incoming messages from the coach
    socket.current.on('receiveMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Cleanup function on unmount
    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, [token]);

  // 2 & 3. Implement Chat History Loading
  useEffect(() => {
    if (!user?._id) return;

    const fetchCoachAndHistory = async () => {
      try {
        // Assumption: The student's coach is determined by their first enrolled course.
        const courseResponse = await apiClient.get(ENDPOINTS.COURSES.GET_STUDENT_COURSES);
        const primaryCourse = courseResponse.data.data[0];

        if (!primaryCourse || !primaryCourse.coach) {
          console.error("Student does not have an assigned coach.");
          return;
        }
        const coachInfo = primaryCourse.coach;
        setCoach(coachInfo);
        
        // Now that we have the coach's ID, fetch the chat history
        const historyResponse = await apiClient.get(`${ENDPOINTS.CHATS.GET_CHAT_HISTORY}/${coachInfo._id}`);
        setMessages(historyResponse.data.data);

      } catch (err) {
        console.error("Error loading chat data:", err);
      }
    };

    fetchCoachAndHistory();
  }, [user]);

  // 4. Wire up the "Send" Message Event
  const handleSendMessage = () => {
    if (!newMessage.trim() || !coach || !socket.current) return;

    const messagePayload = {
      receiverId: coach._id,
      content: newMessage.trim(),
    };

    socket.current.emit('sendMessage', messagePayload);
    
    // Optimistic UI update
    const optimisticMessage = {
        _id: Date.now().toString(),
        sender: user._id,
        receiver: coach._id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessage("");
  };
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat with {coach ? coach.fullname : 'your Coach'}</h1>
      <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg._id} className={`mb-3 flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl max-w-lg shadow-md ${msg.sender === user._id ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"}`}>
              {msg.content}
              <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={!coach}
        />
        <button onClick={handleSendMessage} disabled={!coach} className="bg-green-600 hover:bg-green-700 px-6 font-semibold rounded-r-lg transition-colors disabled:bg-gray-500">
          Send
        </button>
      </div>
    </div>
  );
};

export default StudentChat;

