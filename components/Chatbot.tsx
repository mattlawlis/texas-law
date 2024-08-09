import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const Chatbot = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (status === 'unauthenticated') {
      signIn();  // Redirect to sign-in page if not authenticated
      return;
    }

    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session?.user?.id, // Use the user ID from the session
        message: input,
      }),
    });

    const data = await response.json();
    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: data.response }]);
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;

