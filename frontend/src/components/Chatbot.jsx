@'
import React, { useState, useEffect } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        setError("Chatbot failed to load");
      }
    }
    fetchChat();
  }, []);

  if (error) return <div>{error}</div>;
  return (
    <div>
      <h3>Chatbot</h3>
      {messages.map((m, i) => <p key={i}>{m.text}</p>)}
    </div>
  );
}

export default Chatbot;
'@ | Out-File client\src\components\Chatbot.jsx -NoClobber
