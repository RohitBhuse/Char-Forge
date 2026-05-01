import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function CharacterForgeForm({ universeId, worldId, characterSchema = [], onCharacterForged }) {
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState({});
  const [isForging, setIsForging] = useState(false);

  // Initialize attributes based on schema
  useEffect(() => {
    const initialAttrs = {};
    characterSchema.forEach(attr => {
      initialAttrs[attr] = '';
    });
    setAttributes(initialAttrs);
  }, [characterSchema]);

  const handleAttributeChange = (key, value) => {
    setAttributes(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleForge = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsForging(true);
    try {
      await api.post(`/universes/${universeId}/worlds/${worldId}/characters/`, {
        character_name: name,
        character_attribute: attributes,
        universe_id: universeId,
        world_id: worldId,
      });
      setName('');
      // Reset attributes
      const resetAttrs = {};
      characterSchema.forEach(attr => {
        resetAttrs[attr] = '';
      });
      setAttributes(resetAttrs);
      
      if (onCharacterForged) onCharacterForged();
    } catch (e) {
      console.error('Failed to forge character:', e);
    } finally {
      setIsForging(false);
    }
  };

  const formatLabel = (str) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <form
      onSubmit={handleForge}
      className="h-full bg-surface-container-high p-7 rounded-xl space-y-4 relative overflow-hidden shadow-[0px_24px_48px_rgba(0,57,33,0.1)] flex flex-col"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

      <div className="flex-grow space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-px bg-primary"></span>
          <span className="font-label uppercase tracking-widest text-[0.65rem] text-primary">Create Persona</span>
        </div>

        <div className="space-y-6">
          {/* Always show Name */}
          <div className="group">
            <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Character Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Elara Windwalker"
              required
              className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b]"
            />
          </div>

          {/* Dynamic attributes based on world schema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characterSchema.map((attr) => {
              const isLong = ['appearance', 'background_story', 'habits', 'strengths'].includes(attr);
              return (
                <div key={attr} className={`group ${isLong ? 'md:col-span-2' : ''}`}>
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
                    {formatLabel(attr)}
                  </label>
                  {isLong ? (
                    <textarea
                      value={attributes[attr] || ''}
                      onChange={(e) => handleAttributeChange(attr, e.target.value)}
                      placeholder={`Enter ${formatLabel(attr).toLowerCase()}...`}
                      rows={attr === 'background_story' ? 4 : 2}
                      className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b] resize-none"
                    />
                  ) : (
                    <input
                      value={attributes[attr] || ''}
                      onChange={(e) => handleAttributeChange(attr, e.target.value)}
                      placeholder={`e.g. ${attr === 'age' ? '24' : (attr === 'race' ? 'Elf' : '...')}`}
                      className="w-full bg-surface-container-highest border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/30 px-6 py-4 rounded-sm transition-all focus:shadow-[inset_0_-2px_0_0_#59de9b]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 shrink-0">
        <button
          type="button"
          onClick={() => { setName(''); setAttributes({}); }}
          className="px-6 py-2 text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-on-surface transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isForging || !name.trim()}
          className={`px-8 py-2 bg-primary-container text-on-primary-container font-bold rounded-md hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isForging ? 'Creating…' : 'Create Persona'}
        </button>
      </div>
    </form>
  );
}

export default CharacterForgeForm;
