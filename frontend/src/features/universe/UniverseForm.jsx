import React from 'react';

const UniverseForm = ({ 
  name, 
  setName, 
  description, 
  setDescription, 
  handleForge, 
  isForging 
}) => {
  return (
    <div className="w-full h-full">
      <form onSubmit={handleForge} className="bg-surface-container-high p-7 rounded-xl space-y-4 relative overflow-hidden h-full flex flex-col border border-outline-variant/5 shadow-[0px_24px_48px_rgba(0,57,33,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-px bg-primary"></span>
          <span className="font-label uppercase tracking-widest text-[0.65rem] text-primary">Create Universe</span>
        </div>
        <div className="space-y-4 flex-grow">
          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Universe Name</label>
            <input
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b]"
              placeholder="e.g., The Silver Sea"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Universal Description</label>
            <textarea
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b] resize-none"
              placeholder="Describe the cosmic laws, primary deities, and the flavor of existence..."
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 mt-auto shrink-0">
          <button 
            type="button" 
            onClick={() => { setName(''); setDescription(''); }} 
            className="px-6 py-2 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-on-surface transition-colors"
          >
            Discard
          </button>
          <button 
            type="submit" 
            disabled={isForging || !name.trim()} 
            className="px-8 py-2 bg-primary-container text-on-primary-container font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-50 active:scale-95"
          >
            {isForging ? 'Forging...' : 'Initiate Weave'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UniverseForm;
