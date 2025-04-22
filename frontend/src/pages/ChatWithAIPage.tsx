import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'ai';
  content: string;
  timestamp?: string;
  emoji?: string;
}

const ChatWithAIPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const initializeSession = async () => {
      let storedId = localStorage.getItem('sessionId');
  
      if (!storedId) {
        try {
          const res = await axios.post('/api/auth/register');
          storedId = res.data.sessionId;
  
          if (storedId) {
            localStorage.setItem('sessionId', storedId);
            setSessionId(storedId);
            
            // Show default welcome message only for new sessions
            
          }
        } catch (err) {
          console.error('Session creation failed:', err);
        }
      } else {
        setSessionId(storedId);
      }
    };
  
    initializeSession();
  }, []);
  useEffect(() => {
      if (sessionId) {
        const defaultMessage: Message = {
          sender: 'ai',
          content: "Hey there! How's it going? 😄",
          timestamp: getFormattedTime(),
        };
        setMessages((prev) => [...prev, defaultMessage]);
      }
    }, [sessionId]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      sender: 'user',
      content: input,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`/api/chat`, {
        message: input,
      });

      const aiReply: Message = {
        sender: 'ai',
        content: res.data.response,
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          content: "⚠️ Oops! Something went wrong. Please try again.",
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const addEmojiReaction = (index: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, emoji } : msg))
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 md:p-6 relative">
      <div className="text-center text-3xl font-extrabold text-gray-700 drop-shadow-md mb-4 tracking-wide">
        Your AI-Buddy
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2 py-4 md:p-6 bg-white rounded-3xl shadow-2xl border border-gray-200 backdrop-blur-md">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className="min-w-[40px] min-h-[40px] rounded-full bg-gradient-to-tr from-indigo-200 to-blue-200 flex items-center justify-center text-xl shadow">
              {msg.sender === 'user' ? '👤' : '🤖'}
            </div>
            <div
              className={`relative p-4 rounded-2xl text-sm md:text-base whitespace-pre-wrap shadow-md transition-all duration-300 ease-in-out ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white text-right'
                  : 'bg-green-500 text-white text-left'
              }`}
            >
              <div>{msg.content}</div>
              <div className="text-xs text-gray-200 mt-1">{msg.timestamp}</div>
              {msg.emoji && (
                <div className="absolute -bottom-3 -right-3 text-xl animate-bounce">{msg.emoji}</div>
              )}
              {!msg.emoji && (
                <div className="flex space-x-2 mt-2 text-xl justify-end opacity-80">
                  <button onClick={() => addEmojiReaction(index, '😊')}>😊</button>
                  <button onClick={() => addEmojiReaction(index, '❤️')}>❤️</button>
                  <button onClick={() => addEmojiReaction(index, '👍')}>👍</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-sm bg-green-200 max-w-[70%] p-3 rounded-2xl shadow-md animate-pulse">
            <span className="text-green-900 font-medium">Thinking...</span>
            <div className="animate-spin rounded-full border-4 border-t-4 border-green-500 w-6 h-6"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex space-x-4 items-center bg-white px-4 py-3 mt-4 rounded-full shadow-2xl border border-gray-300 backdrop-blur-lg sticky bottom-4">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-full shadow-md disabled:opacity-50 transition-all duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWithAIPage;
