import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const genresList = [
  { id: 'fantasy',         name: 'Fantasy',         icon: 'auto_awesome' },
  { id: 'scifi',           name: 'Sci-Fi',           icon: 'rocket_launch' },
  { id: 'cyberpunk',       name: 'Cyberpunk',        icon: 'terminal' },
  { id: 'gothic',          name: 'Gothic',           icon: 'castle' },
  { id: 'grimdark',        name: 'Grimdark',         icon: 'skull' },
  { id: 'historical',      name: 'Historical',       icon: 'history_edu' },
  { id: 'noir',            name: 'Noir',             icon: 'mystery' },
  { id: 'steampunk',       name: 'Steampunk',        icon: 'settings' },
  { id: 'lovecraftian',    name: 'Lovecraftian',     icon: 'visibility' },
  { id: 'postapocalyptic', name: 'Post-Apocalyptic', icon: 'landscape' },
  { id: 'urbanfantasy',    name: 'Urban Fantasy',    icon: 'location_city' },
  { id: 'spaceopera',      name: 'Space Opera',      icon: 'stars' },
];

const stylesList = [
  { id: 'mythic',        name: 'Mythic',        glyph: 'Ω', icon: 'storm' },
  { id: 'gritty',       name: 'Gritty',        glyph: '∴', icon: 'texture' },
  { id: 'concise',      name: 'Concise',       glyph: '—', icon: 'short_text' },
  { id: 'descriptive',  name: 'Descriptive',   glyph: '∞', icon: 'palette' },
  { id: 'poetic',       name: 'Poetic',        glyph: '♪', icon: 'music_note' },
  { id: 'cinematic',    name: 'Cinematic',     glyph: '◈', icon: 'movie' },
  { id: 'journalistic', name: 'Journalistic',  glyph: '§', icon: 'article' },
  { id: 'satirical',    name: 'Satirical',     glyph: '⚡', icon: 'comedy' },
];

const DEFAULT_ATTRIBUTES = [
  { id: 'age', label: 'Age', icon: 'calendar_month' },
  { id: 'gender', label: 'Gender', icon: 'wc' },
  { id: 'appearance', label: 'Appearance', icon: 'face' },
  { id: 'habits', label: 'Habits', icon: 'psychology' },
  { id: 'background_story', label: 'Background Story', icon: 'history_edu' },
  { id: 'strengths', label: 'Strengths', icon: 'fitness_center' },
  { id: 'race', label: 'Race', icon: 'groups' },
];

const ProfileSettingsPanel = ({ onClose, userName, userEmail, onLogout, selectedUniverse, selectedWorld, onWorldUpdate, hideWorldSettings }) => {
  const [genres, setGenres] = useState([]);
  const [styles, setStyles] = useState([]);
  const [worldAttributes, setWorldAttributes] = useState([]);
  const [customWorldAttributes, setCustomWorldAttributes] = useState([]);
  const [newCustomAttribute, setNewCustomAttribute] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load current user data
  useEffect(() => {
    api.get('/auth/me').then(res => {
      const data = res.data;
      if (data.genres) setGenres(data.genres.split(',').filter(Boolean));
      if (data.architectural_style) setStyles(data.architectural_style.split(',').filter(Boolean));
    }).catch(console.error);
    
    if (selectedWorld && selectedWorld.attribute_list) {
      const attrs = selectedWorld.attribute_list.split(',').filter(Boolean);
      const defaults = attrs.filter(a => DEFAULT_ATTRIBUTES.some(d => d.id === a));
      const customs = attrs.filter(a => !DEFAULT_ATTRIBUTES.some(d => d.id === a));
      setWorldAttributes(defaults);
      setCustomWorldAttributes(customs);
    }
  }, [selectedWorld]);

  const toggleGenre = (id) => {
    setGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleStyle = (id) => {
    setStyles(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleWorldAttribute = (id) => {
    setWorldAttributes(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const addCustomWorldAttribute = () => {
    if (!newCustomAttribute.trim()) return;
    if (customWorldAttributes.includes(newCustomAttribute.trim())) return;
    setCustomWorldAttributes([...customWorldAttributes, newCustomAttribute.trim()]);
    setNewCustomAttribute('');
  };

  const removeCustomWorldAttribute = (attr) => {
    setCustomWorldAttributes(customWorldAttributes.filter(a => a !== attr));
  };

  const handleSave = async () => {
    if (genres.length === 0 || styles.length === 0) return;
    if (selectedWorld && worldAttributes.length === 0 && customWorldAttributes.length === 0) return;
    
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await api.post('/auth/onboarding', {
        genres,
        architectural_style: styles,
      });
      
      if (selectedWorld) {
        const finalSchema = [...worldAttributes, ...customWorldAttributes];
        const attributeStr = finalSchema.join(',');
        await api.post(`/universes/${selectedUniverse.universe_id}/worlds/${selectedWorld.world_id}/add_attribute_list`, {
          attribute_list: attributeStr
        });
        if (onWorldUpdate) onWorldUpdate(attributeStr);
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-[#161d1a] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20 shrink-0">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.25em] text-primary mb-1">Preferences</p>
            <h2 className="font-headline text-2xl font-bold text-on-surface">Narrative Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all hover:rotate-90"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* User info */}
        <div className="px-8 py-4 bg-surface-container-low/60 border-b border-outline-variant/10 shrink-0 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-lg">person</span>
          </div>
          <div>
            <p className="font-headline font-semibold text-on-surface text-sm">{userName || 'Architect'}</p>
            <p className="text-outline text-xs">{userEmail || ''}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10">

          {/* Genres Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-base">public</span>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Core Realms</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Your preferred genre anchors</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {genresList.map(genre => {
                const isActive = genres.includes(genre.id);
                return (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-label uppercase tracking-widest transition-all border ${
                      isActive
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-surface-container-high border-transparent text-on-surface-variant hover:border-outline-variant/40 hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{genre.icon}</span>
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Writing Styles Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary text-base">edit_note</span>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Writing Style</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Your narrative voice</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {stylesList.map(style => {
                const isActive = styles.includes(style.id);
                return (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border ${
                      isActive
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-surface-container-high border-transparent text-on-surface-variant hover:border-outline-variant/40 hover:text-on-surface'
                    }`}
                  >
                    <span className={`font-headline text-xl font-light select-none ${isActive ? 'text-primary/60' : 'text-on-surface-variant/20'}`}>
                      {style.glyph}
                    </span>
                    <div>
                      <span className="font-label text-xs uppercase tracking-widest block">{style.name}</span>
                    </div>
                    {isActive && (
                      <span className="material-symbols-outlined text-xs ml-auto text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* World Attributes Section - Only shown when inside a world and not viewing a specific character profile */}
          {selectedWorld && !hideWorldSettings && (
            <section className="border-t border-outline-variant/10 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-base">psychology</span>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">World Pillars</h3>
                  <p className="text-on-surface-variant text-xs mt-0.5">Attributes for characters in {selectedWorld.world_name}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-label uppercase tracking-[0.2em] text-outline-variant mb-3">Core Attributes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_ATTRIBUTES.map(attr => (
                      <button
                        key={attr.id}
                        onClick={() => toggleWorldAttribute(attr.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                          worldAttributes.includes(attr.id)
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'bg-surface-container-high border-transparent text-on-surface-variant hover:border-outline-variant/40 hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{attr.icon}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{attr.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-label uppercase tracking-[0.2em] text-outline-variant mb-3">Custom soul-threads</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {customWorldAttributes.map(attr => (
                      <div key={attr} className="flex items-center gap-2 px-3 py-1.5 bg-primary/15 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest group border border-primary/20">
                        {attr}
                        <button onClick={() => removeCustomWorldAttribute(attr)} className="hover:text-red-400">
                          <span className="material-symbols-outlined text-[10px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      value={newCustomAttribute}
                      onChange={(e) => setNewCustomAttribute(e.target.value)}
                      placeholder="Add custom attribute (e.g. Magic Type)"
                      className="flex-1 bg-surface-container-high border-transparent focus:border-primary/40 px-4 py-2.5 rounded-lg text-xs text-on-surface placeholder:text-outline/40 focus:outline-none transition-all border"
                      onKeyDown={(e) => e.key === 'Enter' && addCustomWorldAttribute()}
                    />
                    <button 
                      onClick={addCustomWorldAttribute}
                      className="px-3 py-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Danger Zone */}
          <section className="border border-red-500/20 rounded-xl p-6 bg-red-500/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-red-400 text-base">warning</span>
              <div>
                <h3 className="font-headline font-bold text-red-400">Danger Zone</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Irreversible actions</p>
              </div>
            </div>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-label uppercase tracking-widest hover:bg-red-500/10 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">delete_forever</span>
                Delete Account
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <p className="text-red-300/80 text-xs leading-relaxed">
                  Are you sure? This will <strong>permanently delete</strong> your account and all your universes, worlds, and characters. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await api.delete('/auth/me');
                        localStorage.removeItem('token');
                        onLogout?.();
                      } catch (err) {
                        console.error('Failed to delete account:', err);
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest transition-all ${
                      !isDeleting
                        ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                        : 'bg-surface-container-high text-outline-variant cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{isDeleting ? 'hourglass_empty' : 'delete_forever'}</span>
                    {isDeleting ? 'Deleting…' : 'Yes, Delete Everything'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2.5 rounded-lg text-xs font-label uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-all"
                  >
                    No, Keep My Account
                  </button>
                </div>
              </div>
            )}
          </section>

        </div>

        {/* Footer / Save */}
        <div className="px-8 py-5 border-t border-outline-variant/20 shrink-0 flex items-center justify-between bg-[#0e1512]">
          {saveStatus === 'success' && (
            <span className="text-primary text-xs font-label uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Preferences saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-400 text-xs font-label uppercase tracking-widest">Failed to save</span>
          )}
          {!saveStatus && <span />}

          <button
            onClick={handleSave}
            disabled={isSaving || genres.length === 0 || styles.length === 0 || (selectedWorld && worldAttributes.length === 0 && customWorldAttributes.length === 0)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-label text-xs uppercase tracking-widest transition-all ${
              isSaving || genres.length === 0 || styles.length === 0 || (selectedWorld && worldAttributes.length === 0 && customWorldAttributes.length === 0)
                ? 'bg-surface-container-high text-outline-variant cursor-not-allowed opacity-50'
                : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{isSaving ? 'hourglass_empty' : 'save'}</span>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPanel;
