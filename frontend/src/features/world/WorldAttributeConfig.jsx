import React, { useState } from 'react';
import { api } from '../../services/api';
const DEFAULT_ATTRIBUTES = [
  { id: 'age', label: 'Age', icon: 'calendar_month' },
  { id: 'gender', label: 'Gender', icon: 'wc' },
  { id: 'appearance', label: 'Appearance', icon: 'face' },
  { id: 'habits', label: 'Habits', icon: 'psychology' },
  { id: 'background_story', label: 'Background Story', icon: 'history_edu' },
  { id: 'strengths', label: 'Strengths', icon: 'fitness_center' },
  { id: 'race', label: 'Race', icon: 'groups' },
];

function WorldAttributeConfig({ world, universeId, onComplete }) {
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);
  const [newCustom, setNewCustom] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAttribute = (id) => {
    setSelectedAttributes(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const addCustom = () => {
    if (!newCustom.trim()) return;
    if (customAttributes.includes(newCustom.trim())) return;
    setCustomAttributes([...customAttributes, newCustom.trim()]);
    setNewCustom('');
  };

  const removeCustom = (attr) => {
    setCustomAttributes(customAttributes.filter(a => a !== attr));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const finalSchema = [...selectedAttributes.map(a => a.toLowerCase()), ...customAttributes];
      await api.post(`/universes/${universeId}/worlds/${world.world_id}/add_attribute_list`, {
        attribute_list: finalSchema.join(',')
      });
      onComplete(finalSchema);
    } catch (err) {
      console.error('Failed to save world schema:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-6">
      <div className="w-full max-w-2xl bg-surface-container-high rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-outline-variant/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-px bg-primary"></span>
            <span className="font-label uppercase tracking-widest text-[10px] text-primary">Initial Configuration</span>
          </div>
          <h2 className="text-3xl font-bold font-headline text-on-surface">World Constants</h2>
          <p className="text-on-surface-variant text-sm mt-2">
            Define the soul-threads that make up a persona in <span className="text-primary font-bold italic">{world.world_name}</span>. 
            Character name is always required.
          </p>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          <div>
            <h3 className="text-[10px] font-label uppercase tracking-[0.2em] text-outline-variant mb-4">Core Attributes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEFAULT_ATTRIBUTES.map(attr => (
                <button
                  key={attr.id}
                  onClick={() => toggleAttribute(attr.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${
                    selectedAttributes.includes(attr.id)
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-surface-container-low border-outline-variant/10 text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{attr.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{attr.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-label uppercase tracking-[0.2em] text-outline-variant mb-4">Custom soul-threads</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {customAttributes.map(attr => (
                <div key={attr} className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest group">
                  {attr}
                  <button onClick={() => removeCustom(attr)} className="hover:text-red-400">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                value={newCustom}
                onChange={(e) => setNewCustom(e.target.value)}
                placeholder="Add custom attribute (e.g. Magic Type, Hometown)"
                className="flex-1 bg-surface-container-low border border-outline-variant/10 px-4 py-3 rounded-lg text-xs text-on-surface placeholder:text-outline/40 focus:outline-none focus:border-primary/60 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              />
              <button 
                onClick={addCustom}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-on-primary transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-end gap-4">
          <button
            onClick={() => onComplete()}
            className="px-6 py-4 text-on-surface-variant font-bold font-label uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-10 py-4 bg-primary text-on-primary font-bold font-label uppercase tracking-widest rounded-xl hover:bg-primary-container transition-all active:scale-95 shadow-[0_0_30px_rgba(89,222,155,0.2)]"
          >
            {isSubmitting ? 'Weaving...' : 'Initialize Constants'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorldAttributeConfig;
