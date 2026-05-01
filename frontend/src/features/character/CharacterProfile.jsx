import React, { useState, useRef, useEffect } from 'react';
import { updateCharacter } from '../../services/characterService';

const CharacterProfile = ({ character, onBack, userData, onLogout, onOpenSettings, onCharacterUpdated }) => {
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);

  const [tagInput, setTagInput] = useState('');
  const [isUpdatingTags, setIsUpdatingTags] = useState(false);
  const [localTags, setLocalTags] = useState([]);

  useEffect(() => {
    if (character?.tags) {
      setLocalTags(character.tags.split(',').map(t => t.trim()).filter(t => t));
    } else {
      setLocalTags([]);
    }
  }, [character?.tags]);

  const saveTags = async (tagsArray) => {
    setIsUpdatingTags(true);
    try {
      await updateCharacter(character.universe_id, character.world_id, character.character_id, { tags: tagsArray.join(',') });
      if (onCharacterUpdated) onCharacterUpdated();
    } catch (error) {
      console.error("Failed to update tags", error);
      setLocalTags(character?.tags ? character.tags.split(',').map(t => t.trim()).filter(t => t) : []);
    } finally {
      setIsUpdatingTags(false);
    }
  };

  const handleAddTag = async (newTag) => {
    const trimmed = newTag.trim();
    if (!trimmed || localTags.includes(trimmed)) return;
    const updatedTags = [...localTags, trimmed];
    setLocalTags(updatedTags);
    setTagInput('');
    await saveTags(updatedTags);
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = localTags.filter(t => t !== tagToRemove);
    setLocalTags(updatedTags);
    await saveTags(updatedTags);
  };

  const suggestedTags = ['MC', 'Heroine', 'Ally', 'Villain', 'Mentor', 'Rival'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (!character) return null;

  return (
    <div className="flex-grow flex flex-col h-full bg-background animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden">
      {/* Top Header Navigation */}
      <header className="flex justify-between items-center w-full px-12 py-6 bg-[#0e1512] shrink-0 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">chevron_left</span>
            <span className="font-label uppercase tracking-widest text-xs">Back to Personas</span>
          </button>
          <span className="text-[#3d4a41] mx-2">/</span>
          <span className="text-on-surface font-headline uppercase tracking-widest text-sm">Character Profile</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary hover:text-on-primary transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">edit</span>
            <span className="font-label uppercase tracking-widest text-[10px]">Edit Persona</span>
          </button>
          
          <div className="h-8 w-px bg-outline-variant/10"></div>

          <div className="relative" ref={avatarMenuRef}>
            <button
              onClick={() => setIsAvatarMenuOpen(prev => !prev)}
              className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden hover:border-primary transition-all active:scale-95 flex items-center justify-center bg-primary/10"
            >
              <span className="material-symbols-outlined text-primary">person</span>
            </button>
            {isAvatarMenuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-[#1a211e] border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-on-surface text-xs font-semibold font-headline">{userData?.user_name || 'Architect'}</p>
                  <p className="text-outline text-[10px] mt-0.5 truncate">{userData?.user_email}</p>
                </div>
                <button
                  onClick={() => { onOpenSettings(); setIsAvatarMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all text-xs font-label uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Narrative Settings
                </button>
                <button
                  onClick={() => { onLogout(); setIsAvatarMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-red-400 transition-all text-xs font-label uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto px-12 py-10 space-y-16 custom-scrollbar">

          {/* Hero Section */}
          <section className="flex flex-col xl:flex-row gap-12">
            <div className="w-full xl:w-2/5 aspect-[4/5] rounded-xl overflow-hidden shadow-[0px_24px_48px_rgba(0,57,33,0.3)] bg-surface-container-high relative group shrink-0">
              <img
                alt={character.character_name}
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                src={`https://picsum.photos/seed/${character.character_id}/800/1000`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1512] via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-5xl font-bold font-headline text-white leading-tight uppercase tracking-tighter">{character.character_name}</h2>
                <p className="text-[#59de9b] font-headline uppercase tracking-[0.3em] text-sm mt-2">{character.tags || 'Persona of the Weaver'}</p>
              </div>
            </div>

            <div className="flex-grow flex flex-col justify-start xl:justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(character.character_attribute || {})
                  .filter(([_, value]) => !value || value.length <= 60)
                  .map(([key, value]) => {
                  const formatLabel = (str) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  
                  return (
                    <div key={key} className="bg-surface-container-low p-6 rounded-lg border-l-4 border-primary transition-all hover:bg-surface-container-high">
                      <p className="text-outline text-[10px] uppercase tracking-widest font-headline mb-2">{formatLabel(key)}</p>
                      <p className="text-on-surface font-headline text-lg font-bold uppercase truncate">
                        {value || 'Unknown'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Long Attributes Section (Cards Placed Below Image) */}
          {Object.entries(character.character_attribute || {}).some(([_, value]) => value && value.length > 60) && (
            <section className="space-y-6">
              {Object.entries(character.character_attribute || {})
                .filter(([_, value]) => value && value.length > 60)
                .map(([key, value]) => {
                  const formatLabel = (str) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                  return (
                    <div key={key} className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary transition-all hover:bg-surface-container-high">
                      <p className="text-outline text-xs uppercase tracking-widest font-headline mb-4">{formatLabel(key)}</p>
                      <p className="text-on-surface font-body text-sm leading-loose opacity-90 whitespace-pre-wrap">
                        {value}
                      </p>
                    </div>
                  );
                })}
            </section>
          )}

          <div className="h-20" /> {/* Spacer */}
        </div>

        {/* Right Essence Sidebar */}
        <aside className="w-80 bg-surface-container-low h-full flex flex-col p-8 overflow-y-auto space-y-10 border-l border-outline-variant/10 shrink-0">
          <div className="space-y-2">
            <h3 className="font-headline text-sm font-bold text-[#59de9b] uppercase tracking-widest">Character Essence</h3>
            <p className="text-[10px] text-outline font-headline uppercase tracking-widest">Summary & Core Alignment</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-outline font-bold font-headline">Status</label>
              <div className="flex items-center gap-3 bg-surface-container-high p-4 rounded border-b-2 border-primary">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {character.status === 'New' ? 'new_releases' : 'auto_mode'}
                </span>
                <span className="text-xs font-headline uppercase tracking-widest text-on-surface">{character.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-widest text-outline font-bold font-headline flex items-center justify-between">
                <span>Tags</span>
                {isUpdatingTags && <span className="material-symbols-outlined text-[10px] animate-spin text-primary">sync</span>}
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {localTags.length > 0 ? localTags.map((tag, i) => (
                  <span key={i} className="group flex items-center gap-1 bg-surface-container-highest text-primary text-[9px] pl-3 pr-2 py-1.5 rounded-full font-headline border border-primary/10 uppercase tracking-widest">
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-[10px] hover:text-error transition-all"
                    >
                      close
                    </button>
                  </span>
                )) : (
                  <span className="text-outline-variant text-[9px] font-label uppercase">No tags assigned</span>
                )}
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag(tagInput)}
                  placeholder="Add custom tag..."
                  className="bg-surface-container-highest text-on-surface text-xs px-3 py-2 rounded-md outline-none focus:border-primary border border-transparent w-full transition-all"
                />
                <button 
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="bg-primary/10 text-primary p-2 rounded-md hover:bg-primary hover:text-on-primary disabled:opacity-50 transition-all flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>

              <div className="pt-2">
                <p className="text-[9px] text-outline-variant font-label uppercase mb-2">Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.filter(t => !localTags.includes(t)).map(tag => (
                    <button 
                      key={tag}
                      onClick={() => handleAddTag(tag)}
                      className="text-[9px] bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded border border-outline-variant/10 uppercase tracking-wider transition-all"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </aside>
      </div>
    </div>
  );
};

export default CharacterProfile;
