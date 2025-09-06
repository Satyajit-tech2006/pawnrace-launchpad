import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext.jsx";
import apiClient from "@/lib/api.js";
import { ENDPOINTS } from "@/lib/endpoints.js";

const CoachChat = () => {
  const { user, token } = useAuth(); // We'll use the 'token' which is the accessToken
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Fix Connection & Authenticate Socket
  useEffect(() => {
    if (!token) return; // Don't connect until we have the auth token

    // Connect to the correct backend URL and pass the accessToken for authentication
    socket.current = io(import.meta.env.VITE_API_URL, {
      auth: { token }
    });

    // 4. Set up the real-time event listener for incoming messages
    socket.current.on('receiveMessage', (message) => {
      // We need to check if the incoming message is from the currently selected student
      setSelectedStudent(currentStudent => {
        if (currentStudent && currentStudent._id === message.sender) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
        return currentStudent; // Return the state unchanged if the chat is not active
      });
    });

    // Cleanup function to disconnect socket and remove listener on component unmount
    return () => {
      if (socket.current) {
        socket.current.off('receiveMessage');
        socket.current.disconnect();
      }
    };
  }, [token]);

  // 2. Implement Coach's Student List Fetching
  useEffect(() => {
    const fetchStudentsForCoach = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.CHATS.GET_STUDENTS_FOR_COACH);
        setStudents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch students for chat:", error);
      }
    };
    fetchStudentsForCoach();
  }, []);

  // 3. Implement Chat History Loading
  const handleSelectStudent = async (student) => {
    if (selectedStudent?._id === student._id) return; // Don't re-fetch if already selected

    setSelectedStudent(student);
    try {
      const response = await apiClient.get(`${ENDPOINTS.CHATS.GET_CHAT_HISTORY}/${student._id}`);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      setMessages([]); // Clear messages on error or if there's no history
    }
  };

  // 4. Wire Up the "Send" Message Event
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStudent || !socket.current) return;

    const messagePayload = {
      receiverId: selectedStudent._id,
      content: newMessage.trim(),
    };

    socket.current.emit('sendMessage', messagePayload);

    // Optimistically update the UI for a better user experience
    const optimisticMessage = {
        _id: Date.now().toString(), // Use a temporary unique key
        sender: user._id,
        receiver: selectedStudent._id,
        content: newMessage.trim(),
        createdAt: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessage("");
  };

  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] to-black text-white">
      {/* Sidebar with Student List */}
      <div className="w-1/4 bg-white/5 p-4 flex flex-col border-r border-white/10">
        <h2 className="text-xl font-bold mb-4">My Students</h2>
        <div className="overflow-y-auto">
          {students.map((student) => (
            <button
              key={student._id}
              onClick={() => handleSelectStudent(student)}
              className={`block w-full text-left p-3 rounded-lg mb-2 transition-colors duration-200 ${selectedStudent?._id === student._id ? "bg-blue-600 text-white font-semibold" : "hover:bg-white/10 text-gray-300"}`}
            >
              {student.fullname}
            </button>
          ))}
        </div>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-6">
        {selectedStudent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-4">Chat with {selectedStudent.fullname}</h2>
            <div className="flex-1 bg-black/20 rounded-xl p-4 overflow-y-auto mb-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`mb-3 flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-lg shadow-md ${msg.sender === user._id ? "bg-green-600 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"}`}>
                    {msg.content}
                    <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex">
              <input type="text" className="flex-1 p-3 rounded-l-lg bg-black/40 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
              <button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 px-6 font-semibold rounded-r-lg transition-colors">Send</button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full"><p className="text-gray-400 text-lg">Select a student to start chatting.</p></div>
        )}
      </div>
    </div>
  );
};

export default CoachChat;

