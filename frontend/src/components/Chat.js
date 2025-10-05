import React, { useState, useRef, useEffect } from "react";
import "../styles.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, type: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsThinking(true);
    const thinkingMsg = { text: "", type: "bot", thinking: true };
    setMessages((prev) => [...prev, thinkingMsg]);

    try {
      // Replace with your backend API
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/message/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      // Replace thinking message with actual reply
      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking ? { ...msg, text: data.reply, thinking: false } : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking ? { ...msg, text: "Error from server", thinking: false } : msg
        )
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      
      <div className="chat-card">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.type}`}>
              
              {/* Bot Avatar */}
              {msg.type === "bot" && (
                <div className="avatar" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#e5e5ea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  🤖
                </div>
              )}

              {/* Message Bubble */}
              <div className={`bubble ${msg.thinking ? "thinking" : ""}`}>
                {msg.thinking ? (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                ) : (
                  msg.text
                )}
              </div>

              {/* User Avatar */}
              {msg.type === "user" && (
                <div className="avatar" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#4f46e5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "20px"
                }}>
                  👤
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
