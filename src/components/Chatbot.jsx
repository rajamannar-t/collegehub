import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // Will rely on global index.css rules or inline if needed. We'll use index.css for cleaner styles.

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: "Hi! 👋 I'm your CollegeHub Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message history to the backend
      const payload = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload }),
      });
      
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: 'bot', text: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), role: 'bot', text: data.error || "Sorry, I had trouble processing that! 🤖" },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: 'bot', text: "Network error. Is the backend server running?" },
      ]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      {/* Floating Action Button */}
      <button 
        className={`chatbot-fab ${isOpen ? 'open' : ''}`} 
        onClick={toggleChat}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
           <span className="fab-icon">✕</span>
        ) : (
           <span className="fab-icon">💬</span>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">🤖</span>
            <div className="chatbot-title-box">
               <h4>CollegeHub Assistant</h4>
               <span className="chatbot-status">Online</span>
            </div>
          </div>
          <button className="icon-btn close-btn" onClick={toggleChat}>✕</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.role}`}>
              {msg.role === 'bot' && <div className="chat-avatar bot-avatar">🤖</div>}
              <div className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
              {msg.role === 'user' && <div className="chat-avatar user-avatar">👤</div>}
            </div>
          ))}
          
          {isLoading && (
            <div className="chat-bubble-wrapper bot">
              <div className="chat-avatar bot-avatar">🤖</div>
              <div className="chat-bubble bot typing-indicator">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <form className="chatbot-form" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={!input.trim() || isLoading} className="send-btn">
               ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
