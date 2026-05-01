import React, { useState } from 'react';
import { api } from '../../services/api';

function WorldForgeForm({ universeId, onWorldForged }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isForging, setIsForging] = useState(false);

  const handleForge = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsForging(true);
    try {
      await api.post(`/universes/${universeId}/worlds/`, {
        world_name: name,
        world_description: description,
        world_timeline: timeline,
      });
      setName(''); setDescription(''); setTimeline('');
      if (onWorldForged) onWorldForged();
    } catch (e) {
      console.error('Failed to forge world:', e);
    } finally {
      setIsForging(false);
    }
  };

  return (
    <form 
      onSubmit={handleForge} 
      className="h-full bg-surface-container-high p-7 rounded-xl space-y-4 relative overflow-hidden shadow-[0px_24px_48px_rgba(0,57,33,0.1)] flex flex-col"
    >
      {/* Subtle Background Texture */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      
      <div className="flex-grow space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-px bg-primary"></span>
          <span className="font-label uppercase tracking-widest text-[0.65rem] text-primary">Create World</span>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">World Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Silver Sea"
              required
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b]"
            />
          </div>

          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">World Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the cosmic laws, primary deities, and the flavor of existence..."
              rows={5}
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b] resize-none"
            />
          </div>

          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Timeline / Era</label>
            <input
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 1900"
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 shrink-0">
        <button 
          type="button"
          onClick={() => { setName(''); setDescription(''); setTimeline(''); }}
          className="px-6 py-2 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-on-surface transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isForging || !name.trim()}
          className={`px-8 py-2 bg-primary-container text-on-primary-container font-bold rounded-md hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isForging ? 'Creating…' : 'Create World'}
        </button>
      </div>
    </form>
  );
}

export default WorldForgeForm;
