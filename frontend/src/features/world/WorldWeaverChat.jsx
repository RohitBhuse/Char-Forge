import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';

function WorldWeaverChat({ universeId, universeName }) {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `What world shall we forge within "${universeName}"?` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSending(true);
    try {
      const res = await api.post(`/universes/${universeId}/worlds/chat`, { messages: [...chatMessages, userMsg] });
      setChatMessages(prev => [...prev, res.data]);
    } catch (e) {
      console.error('Chat failed:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center gap-2 mb-6 shrink-0 relative z-10">
        <span className="w-4 h-px bg-primary" />
        <span className="font-label uppercase tracking-widest text-[0.6rem] text-primary">Cosmic Chat</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-4 scroll-smooth custom-scrollbar min-h-0 flex flex-col">
        {/* Spacer to push content to bottom */}
        <div className="flex-1 min-h-0" />

        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-surface-container-high text-on-surface p-4 rounded-2xl text-xs animate-pulse">Processing world intent...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative mt-auto pt-4 border-t border-outline-variant/10 shrink-0">
        <input
          className="w-full bg-surface-container border border-outline-variant/20 focus:border-primary/50 focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-5 py-4 rounded-xl text-sm focus:shadow-none transition-all"
          placeholder="Describe this world..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button type="submit" className="absolute right-4 top-[calc(50%+8px)] -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>
    </div>
  );
}

export default WorldWeaverChat;
