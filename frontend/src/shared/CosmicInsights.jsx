import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const CosmicInsights = ({ onNavigate }) => {
  const [universeTree, setUniverseTree] = useState([]);
  const [stats, setStats] = useState({ universes: 0, worlds: 0, characters: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [treeRes, statsRes] = await Promise.all([
          api.get('/universes/tree'),
          api.get('/universes/stats')
        ]);
        setUniverseTree(treeRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
      </div>
    );
  }

  // Always show the welcome/intro if no universes exist
  if (universeTree.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-background p-12 animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-surface-container-high flex items-center justify-center border border-primary/30 shadow-[0_0_50px_rgba(89,222,155,0.2)]">
            <span className="material-symbols-outlined text-6xl text-primary animate-pulse">auto_awesome</span>
          </div>
        </div>
        
        <div className="max-w-2xl text-center space-y-6">
          <div className="space-y-2">
            <p className="text-primary font-label uppercase tracking-[0.4em] text-[10px] font-bold">The Great Architecture Awaits</p>
            <h1 className="text-6xl font-bold font-headline text-on-surface tracking-tight leading-tight">Your Multiverse is <span className="text-primary italic">Latent</span></h1>
          </div>
          
          <p className="text-on-surface-variant text-lg leading-relaxed opacity-70 font-body">
            Create your first universe to begin.
          </p>
          
          <div className="pt-8">
            <button
              onClick={() => onNavigate?.('universe_create')}
              className="group relative px-10 py-5 bg-primary text-on-primary font-bold font-label uppercase tracking-[0.2em] rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(89,222,155,0.3)] hover:shadow-[0_0_50px_rgba(89,222,155,0.5)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-4">
                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-700">public</span>
                <span>Initiate First Reality</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl opacity-50">
           {[
             { icon: 'temp_preferences_custom', label: 'Define Constants', desc: 'Set the laws of your reality.' },
             { icon: 'hub', label: 'Create Worlds', desc: 'Create worlds within your domain.' },
             { icon: 'person_add', label: 'Create Personas', desc: 'Manifest unique personas.' }
           ].map((step, i) => (
             <div key={i} className="text-center space-y-3 p-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low/30">
               <span className="material-symbols-outlined text-primary/60">{step.icon}</span>
               <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface">{step.label}</p>
               <p className="text-[10px] text-outline leading-tight">{step.desc}</p>
             </div>
           ))}
        </div>
      </div>
    );
  }

  // If universes exist, show a detailed table overview
  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar bg-background p-12 space-y-12 animate-in fade-in duration-700 pb-32">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-8 h-px bg-primary opacity-50" />
          <p className="text-primary font-label uppercase tracking-[0.3em] text-[10px] font-bold">Multiverse Core</p>
        </div>
        <h1 className="text-5xl font-bold font-headline text-on-surface tracking-tight">Cosmic Archive</h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed opacity-70">
          A comprehensive high-level view of your created realities and their contained worlds.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 shadow-lg hover:border-primary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">public</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-outline">Universes</p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">{stats.universes}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 shadow-lg hover:border-tertiary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">language</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-outline">Worlds</p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">{stats.worlds}</h3>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 shadow-lg hover:border-secondary/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">person</span>
            </div>
            <div>
              <p className="text-[10px] font-label uppercase tracking-widest text-outline">Personas</p>
              <h3 className="text-2xl font-bold font-headline text-on-surface">{stats.characters}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Universe & World Detailed Table */}
      <section className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-1000">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-primary w-1/3">Universe Entity</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-tertiary">Nested Worlds</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-outline text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {universeTree.map((univ) => (
                <tr key={univ.universe_id} className="group hover:bg-surface-container-highest/30 transition-colors">
                  <td className="px-8 py-8 align-top">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                           <span className="material-symbols-outlined text-primary text-lg">public</span>
                        </div>
                        <h3 className="text-xl font-bold font-headline text-on-surface group-hover:text-primary transition-colors">
                          {univ.universe_name}
                        </h3>
                      </div>
                      <p className="text-sm text-on-surface-variant line-clamp-3 max-w-xs leading-relaxed opacity-70 italic">
                        {univ.universe_description || 'No description recorded in the cosmic archives.'}
                      </p>
                      <div className="pt-4">
                         <span className="text-[9px] font-label uppercase tracking-widest text-outline opacity-40">
                           Created: {new Date(univ.created_at).toLocaleDateString()}
                         </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8" colSpan={2}>
                    {univ.worlds && univ.worlds.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {univ.worlds.map((world) => (
                          <div key={world.world_id} className="p-5 rounded-2xl bg-surface-container-high/40 border border-outline-variant/5 hover:border-tertiary/30 transition-all group/world">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col">
                                <h4 className="text-base font-bold text-on-surface group-hover/world:text-tertiary transition-colors">{world.world_name}</h4>
                                <p className="text-[10px] font-label uppercase tracking-[0.2em] text-tertiary/70 mt-0.5">Timeline: {world.world_timeline || 'Present Era'}</p>
                              </div>
                              <span className="material-symbols-outlined text-tertiary/40 group-hover/world:rotate-12 transition-transform">language</span>
                            </div>
                            <p className="text-xs text-on-surface-variant mb-4 opacity-70 leading-relaxed">
                              {world.world_description || 'No world lore provided for this sector.'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {world.attribute_list ? world.attribute_list.split(',').map((attr, idx) => (
                                <span key={idx} className="text-[9px] font-label uppercase tracking-tighter px-3 py-1 rounded-md bg-surface-container-highest text-outline border border-outline-variant/10 shadow-sm">
                                  {attr.trim()}
                                </span>
                              )) : (
                                <span className="text-[9px] font-label uppercase tracking-tighter text-outline/40 italic">No constants defined</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-outline/30 border border-dashed border-outline-variant/10 rounded-2xl">
                        <span className="material-symbols-outlined text-3xl mb-2">info</span>
                        <span className="text-xs font-label uppercase tracking-widest">No worlds manifest in this reality</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CosmicInsights;
