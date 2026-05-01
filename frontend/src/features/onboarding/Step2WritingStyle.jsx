import React from 'react';

const stylesList = [
  {
    id: 'mythic',
    name: 'Mythic',
    icon: 'storm',
    glyph: 'Ω',
    desc: 'Grandios imagery, high stakes, and legendary proportions. Perfect for world-shaping epics.',
    tags: ['Epic Scale', 'Legendary', 'High Stakes'],
  },
  {
    id: 'gritty',
    name: 'Gritty',
    icon: 'texture',
    glyph: '∴',
    desc: 'Raw, visceral, and uncompromising. Focuses on the harsh realities and physical weight of existence.',
    tags: ['Raw', 'Visceral', 'Unflinching'],
  },
  {
    id: 'concise',
    name: 'Concise',
    icon: 'short_text',
    glyph: '—',
    desc: 'Minimalist and impactful. Every word carries a sharp edge, stripping away fluff for maximum clarity.',
    tags: ['Minimalist', 'Sharp', 'Precise'],
  },
  {
    id: 'descriptive',
    name: 'Descriptive',
    icon: 'palette',
    glyph: '∞',
    desc: 'Lush, ornate, and sensory. Paints a vivid landscape of colors, smells, and textures.',
    tags: ['Lush', 'Sensory', 'Ornate'],
  },
  {
    id: 'poetic',
    name: 'Poetic',
    icon: 'music_note',
    glyph: '♪',
    desc: 'Lyrical and flowing. Focuses on the beauty of language, metaphor, and emotional resonance.',
    tags: ['Lyrical', 'Metaphorical', 'Resonant'],
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    icon: 'movie',
    glyph: '◈',
    desc: 'Visual and fast-paced. Focuses on framing, action sequences, and dramatic pacing.',
    tags: ['Visual', 'Fast-Paced', 'Dramatic'],
  },
  {
    id: 'journalistic',
    name: 'Journalistic',
    icon: 'article',
    glyph: '§',
    desc: 'Objective, factual, and precise. Treats the narrative like a historical record or report.',
    tags: ['Objective', 'Factual', 'Precise'],
  },
  {
    id: 'satirical',
    name: 'Satirical',
    icon: 'comedy',
    glyph: '⚡',
    desc: 'Witty, cynical, and humorous. Highlights the absurdity of the world and its characters.',
    tags: ['Witty', 'Cynical', 'Absurdist'],
  },
];

const Step2WritingStyle = ({ architecturalStyle, setArchitecturalStyle }) => {
  // architecturalStyle is an array for multi-select
  const toggleStyle = (styleId) => {
    if (architecturalStyle.includes(styleId)) {
      setArchitecturalStyle(architecturalStyle.filter(s => s !== styleId));
    } else {
      setArchitecturalStyle([...architecturalStyle, styleId]);
    }
  };

  const selectedStyles = stylesList.filter(s => architecturalStyle.includes(s.id));

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Style Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stylesList.map((style) => {
              const isActive = architecturalStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`group relative p-6 rounded-xl text-left transition-all duration-200 border ${
                    architecturalStyle.includes(style.id)
                      ? 'bg-surface-container-high border-primary shadow-[0_0_24px_rgba(89,222,155,0.15)]'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high hover:border-outline-variant/40'
                  }`}
                >
                  {/* Glyph accent */}
                  <div className={`absolute top-4 right-5 font-headline text-3xl font-light transition-colors select-none ${
                    isActive ? 'text-primary/30' : 'text-on-surface-variant/10 group-hover:text-on-surface-variant/20'
                  }`}>
                    {style.glyph}
                  </div>

                  {/* Active indicator bar */}
                  {architecturalStyle.includes(style.id) && (
                    <div className="absolute top-4 left-4 w-1.5 h-8 bg-primary rounded-full"></div>
                  )}

                  <div className="flex items-center gap-3 mb-3 pl-4">
                    <span className={`material-symbols-outlined text-xl transition-colors ${
                      architecturalStyle.includes(style.id) ? 'text-primary' : 'text-on-surface-variant group-hover:text-tertiary'
                    }`}>
                      {style.icon}
                    </span>
                    <span className={`font-headline font-bold text-base transition-colors ${
                      architecturalStyle.includes(style.id) ? 'text-primary' : 'text-on-surface'
                    }`}>
                      {style.name}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4 pl-4">
                    {style.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pl-4">
                    {style.tags.map(tag => (
                      <span key={tag} className={`text-[10px] font-label uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${
                        architecturalStyle.includes(style.id)
                          ? 'bg-primary/15 text-primary border border-primary/20'
                          : 'bg-surface-container-highest text-outline'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <aside className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 rounded-xl border-l-2 border-primary sticky top-32">
            <h3 className="font-headline text-lg font-bold text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              THE WEAVER'S INSIGHT
            </h3>
            <p className="text-on-surface-variant italic text-sm leading-relaxed mb-8">
              "The style you choose is the thread. It determines how your universe breathes — whether it roars, whispers, or sings."
            </p>

            {selectedStyles.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-label uppercase tracking-[0.2em] text-outline mb-2">Active Styles</div>
                {selectedStyles.map(s => (
                  <div key={s.id} className="bg-surface-container-high rounded-lg p-3 flex items-center gap-3">
                    <span className="font-headline text-2xl font-light text-primary/40 select-none">{s.glyph}</span>
                    <div>
                      <span className="font-headline font-bold text-primary text-sm block">{s.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {s.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-label uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-outline text-sm italic">No style selected yet…</p>
            )}

            <div className="mt-8 pt-6 border-t border-outline-variant/20 space-y-3">
              <div className="flex items-center gap-3 text-xs font-label tracking-widest uppercase">
                <div className={`w-2 h-2 rounded-full transition-colors ${architecturalStyle.length > 0 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                <span className={architecturalStyle.length > 0 ? 'text-on-surface' : 'text-outline'}>
                  Narrative Density: {architecturalStyle.length > 0 ? 'CALIBRATED' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Step2WritingStyle;
