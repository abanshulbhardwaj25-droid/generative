import React, { useState, useRef, useEffect } from "react";
import "../styles.css";

const BOT_NAME = "GrokBot"; // Bot name define

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
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/message/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      let botText = data.reply.reply || "Sorry, no reply.";

      // Ensure bot name not duplicated
      if (botText.startsWith(`${BOT_NAME}: `)) {
        botText = botText.replace(`${BOT_NAME}: `, "");
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking
            ? { ...msg, text: botText, thinking: false, type: "bot" }
            : msg
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking
            ? { ...msg, text: "Error from server", thinking: false, type: "bot" }
            : msg
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
    <div className="chat-container">
      <div className="chat-card">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.type}`}>
              {/* Avatar */}
              <div
                className="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: msg.type === "bot" ? "#e5e5ea" : "#4f46e5",
                  color: msg.type === "bot" ? "black" : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  marginRight: msg.type === "bot" ? "10px" : "0",
                  marginLeft: msg.type === "user" ? "10px" : "0",
                }}
              >
                {msg.type === "bot" ? "🤖" : "👤"}
              </div>

              {/* Message Bubble */}
              <div className={`bubble ${msg.thinking ? "thinking" : ""}`}>
                {msg.thinking ? (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                ) : msg.type === "bot" ? (
                  <>
                    <strong>{BOT_NAME}: </strong>
                    {msg.text}
                  </>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
