import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';

const ClassroomChat = ({ messages, onSendMessage }) => {
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        
        onSendMessage(inputText);
        setInputText("");
    };

    return (
        <div className="absolute inset-0 flex flex-col bg-[#111]">
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <User className="w-12 h-12 mb-2" />
                        <p className="text-xs uppercase tracking-widest">No messages yet</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.isMe;
                        return (
                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                    isMe 
                                    ? 'bg-violet-600 text-white rounded-br-none' 
                                    : 'bg-[#252525] text-gray-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] text-gray-600 mt-1 font-mono">
                                    {msg.time}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-3 bg-[#161616] border-t border-white/10 flex gap-2">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
                <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="p-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 text-white rounded-lg transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};

export default ClassroomChat;