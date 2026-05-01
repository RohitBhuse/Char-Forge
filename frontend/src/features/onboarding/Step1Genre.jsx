import React from 'react';

const genresList = [
  { id: 'fantasy',         name: 'Fantasy',         icon: 'auto_awesome',    desc: 'Magic, mythical creatures, and ancient prophecies.' },
  { id: 'scifi',           name: 'Sci-Fi',           icon: 'rocket_launch',   desc: 'Interstellar exploration, technology, and the future.' },
  { id: 'cyberpunk',       name: 'Cyberpunk',        icon: 'terminal',        desc: 'Neon-lit dystopias, megacorps, and street hackers.' },
  { id: 'gothic',          name: 'Gothic',           icon: 'castle',          desc: 'Dark romance, crumbling manors, and brooding shadows.' },
  { id: 'grimdark',        name: 'Grimdark',         icon: 'skull',           desc: 'Brutal, morally ambiguous, and unflinchingly bleak.' },
  { id: 'historical',      name: 'Historical',       icon: 'history_edu',     desc: 'Grounded in real eras with meticulous period detail.' },
  { id: 'noir',            name: 'Noir',             icon: 'mystery',         desc: 'Crime, corruption, and morally grey detectives.' },
  { id: 'steampunk',       name: 'Steampunk',        icon: 'settings',        desc: 'Victorian-era technology powered by steam and brass.' },
  { id: 'lovecraftian',    name: 'Lovecraftian',     icon: 'visibility',      desc: 'Cosmic horror, forbidden knowledge, and ancient gods.' },
  { id: 'postapocalyptic', name: 'Post-Apocalyptic', icon: 'landscape',       desc: 'Survival in the ruins of civilization.' },
  { id: 'urbanfantasy',    name: 'Urban Fantasy',    icon: 'location_city',   desc: 'Magic hidden beneath the surface of modern cities.' },
  { id: 'spaceopera',      name: 'Space Opera',      icon: 'stars',           desc: 'Epic adventures across galaxies, empires, and stars.' },
];

const Step1Genre = ({ genres, setGenres }) => {
  const toggleGenre = (genreId) => {
    if (genres.includes(genreId)) {
      setGenres(genres.filter(g => g !== genreId));
    } else {
      setGenres([...genres, genreId]);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Panel */}
        <aside className="lg:col-span-4">
          <div className="bg-surface-container-low p-8 rounded-xl border-l-2 border-primary sticky top-32">
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Choose one or more genres that will anchor your creative universe. These define the tone, rules, and atmosphere of your storytelling world.
            </p>
            <div className="space-y-3">
              <div className="text-xs font-label uppercase tracking-[0.2em] text-outline mb-2">Selected Realms</div>
              {genres.length === 0 ? (
                <p className="text-outline text-sm italic">None selected yet…</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => {
                    const genre = genresList.find(gl => gl.id === g);
                    return (
                      <span key={g} className="bg-primary/10 text-primary text-xs font-label uppercase tracking-widest px-3 py-1 rounded-full border border-primary/30">
                        {genre?.name}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/20 space-y-3">
              <div className="flex items-center gap-3 text-xs font-label tracking-widest uppercase">
                <div className={`w-2 h-2 rounded-full transition-colors ${genres.length > 0 ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                <span className={genres.length > 0 ? 'text-on-surface' : 'text-outline'}>
                  World Intensity: {genres.length > 2 ? 'HIGH' : genres.length > 0 ? 'MEDIUM' : 'CALIBRATING…'}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Genre Grid */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {genresList.map((genre) => {
              const isActive = genres.includes(genre.id);
              return (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`group relative p-5 rounded-xl text-left transition-all duration-200 border ${
                    isActive
                      ? 'bg-surface-container-high border-primary shadow-[0_0_20px_rgba(89,222,155,0.12)]'
                      : 'bg-surface-container-low border-transparent hover:bg-surface-container-high hover:border-outline-variant/40'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-3 right-3 bg-primary text-on-primary rounded-full p-0.5">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                  )}
                  <span className={`material-symbols-outlined text-2xl mb-3 block transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-tertiary'
                  }`}>
                    {genre.icon}
                  </span>
                  <span className={`font-headline font-semibold text-sm block mb-1 transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}>
                    {genre.name}
                  </span>
                  <span className="text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                    {genre.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Genre;
