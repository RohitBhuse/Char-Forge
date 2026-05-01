import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';

function CharacterWeaverChat({ universeId, worldId, worldName, onClose }) {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `What soul shall we breathe life into within "${worldName}"?` }
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
      const res = await api.post(`/universes/${universeId}/worlds/${worldId}/characters/chat`, { messages: [...chatMessages, userMsg] });
      setChatMessages(prev => [...prev, res.data]);
    } catch (e) {
      console.error('Chat failed:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-surface-container-high rounded-xl flex flex-col h-full border border-primary/20 shadow-[0px_24px_48px_rgba(0,57,33,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
      <div className="flex items-center justify-between px-6 py-4 shrink-0 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-4 h-px bg-primary" />
          <span className="font-label uppercase tracking-widest text-[0.6rem] text-primary">Character Weaver</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-all hover:rotate-90 active:scale-90"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto px-6 space-y-3 mb-4 pr-5 scroll-smooth custom-scrollbar min-h-0">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary/10 border border-primary/20 text-on-surface' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-surface-container-highest text-on-surface-variant p-3 rounded-lg text-xs animate-pulse">Processing persona intent...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative mx-6 mb-6 shrink-0">
        <input
          className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-4 py-3.5 rounded-sm text-sm focus:shadow-[inset_0_-1px_0_0_#59de9b] transition-all"
          placeholder="Describe this character..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors">
          <span className="material-symbols-outlined text-sm">send</span>
        </button>
      </form>
    </div>
  );
}

export default CharacterWeaverChat;
