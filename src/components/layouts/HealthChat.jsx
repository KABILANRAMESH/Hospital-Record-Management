import { useState } from "react";
import "./HealthChat.css";
import axios from "axios";

function HealthChat() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    { text: "Hello 👋 I am your Health Assistant.", sender: "bot" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/health-chat`,
        { message: input }
      );

      const botReply = {
        text: res.data.reply,
        sender: "bot",
      };

      // add the reply to the chat history
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      // log the raw error so we can debug quickly
      console.log("OpenAI Error:", error.response?.data || error.message);

      // if the backend returned a more descriptive message, show it
      const errorText =
        error.response?.data?.reply?.message ||
        error.response?.data?.reply ||
        error.response?.data?.error?.message ||
        "AI service error. Please try again later.";

      const botReply = {
        text: errorText,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botReply]);
    }

    setInput("");

  };

  return (
    <>
      {/* CHAT BUTTON */}
      {!isOpen && (
        <div className="chat-toggle" onClick={() => setIsOpen(true)}>
          <span className="material-symbols-outlined">support_agent</span>
        </div>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="chatbox">

          <div className="chat-header">
            Health Assistant
            <span
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </span>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button onClick={sendMessage}>
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default HealthChat;