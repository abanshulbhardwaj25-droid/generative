import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles.css";

const BOT_NAME = "GrokBot";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

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
      if (botText.startsWith(`${BOT_NAME}: `)) botText = botText.replace(`${BOT_NAME}: `, "");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking
            ? { ...msg, text: botText, thinking: false, type: "bot" }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.thinking
            ? { ...msg, text: "Error from server", thinking: false, type: "bot" }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.type}`}>
              {msg.type === "bot" && <div className="avatar bot-avatar">🤖</div>}
              <div className={`bubble ${msg.thinking ? "thinking" : ""}`}>
                {msg.thinking ? (
                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>
                ) : msg.type === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {`${BOT_NAME}: ${msg.text}`}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
              {msg.type === "user" && <div className="avatar user-avatar">👤</div>}
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
