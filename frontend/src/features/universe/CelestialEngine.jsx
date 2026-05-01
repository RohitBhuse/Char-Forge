import React from 'react';

const CelestialEngine = ({ 
  isChatActive, 
  setIsChatActive, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  isForging 
}) => {
  return (
    <div className="h-full w-full">
      {isChatActive ? (
        <div className="bg-surface-container-high p-7 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl border border-primary/20 animate-in fade-in slide-in-from-left-4 duration-300 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4 shrink-0 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-4 h-px bg-primary"></span>
              <span className="font-label uppercase tracking-widest text-[0.6rem] text-primary">Cosmic Chat</span>
            </div>
            <button
              onClick={() => setIsChatActive(false)}
              className="p-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-all hover:rotate-90 active:scale-90"
              title="Back to Engine"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 mb-4 pr-1 scroll-smooth min-h-0">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary/10 border border-primary/20 text-on-surface'
                    : 'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isForging && (
              <div className="flex justify-start">
                <div className="bg-surface-container-highest text-on-surface-variant p-3 rounded-lg text-xs animate-pulse">
                  Processing intent...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="relative mt-auto shrink-0">
            <input
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-4 py-3 rounded-sm text-xs transition-all focus:shadow-[inset_0_-1px_0_0_#59de9b]"
              placeholder="Intent..."
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="p-7 rounded-xl bg-surface-container-low border border-outline-variant/10 shadow-[0px_24px_48px_rgba(0,57,33,0.1)] flex flex-col h-full animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-primary mb-4 font-headline">Celestial Engine</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
              Every universe begins with a single intent. Define the physical constants and the narrative soul of your next creation.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">schema</span>
                Define cosmic laws and physical constants.
              </li>
              <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">diversity_3</span>
                Describe primary deities or governing forces.
              </li>
              <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">auto_awesome_motion</span>
                Use the Weaver for creative inspiration.
              </li>
            </ul>
          </div>
          <button
            onClick={() => setIsChatActive(true)}
            className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            Initialize Weaver
          </button>
        </div>
      )}
    </div>
  );
};

export default CelestialEngine;
