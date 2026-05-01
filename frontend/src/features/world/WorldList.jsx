import React from 'react';
import { UniverseToolbar } from '../universe';
import EntityCard from '../../shared/EntityCard';
import WorldRow from './WorldRow';

const WorldList = ({ 
  worlds, 
  isLoading, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  onSelectWorld, 
  onDeleteWorld 
}) => {
  const sortedWorlds = [...worlds].sort((a, b) => {
    if (sortBy === 'timeline') return (a.world_timeline || '').localeCompare(b.world_timeline || '');
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <>
      <UniverseToolbar 
        worldsCount={worlds.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-primary animate-spin text-3xl">autorenew</span>
        </div>
      ) : worlds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-outline-variant/10 rounded-2xl bg-surface-container-low/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_awesome</span>
          </div>
          <h4 className="text-xl font-bold font-headline text-on-surface mb-2">No Worlds Found</h4>
          <p className="text-on-surface-variant text-center max-w-sm text-sm leading-relaxed px-6">
            No worlds have been created in this universe yet. Use the Celestial Engine above to create your first world.
          </p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {sortedWorlds.map(w => (
            <EntityCard 
              key={w.world_id} 
              type="world" 
              item={w} 
              onClick={() => onSelectWorld(w)}
              onDelete={onDeleteWorld} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-300">
          {sortedWorlds.map(w => (
            <div key={w.world_id} className="relative group">
              <WorldRow 
                world={w} 
                onDelete={() => onDeleteWorld(w.world_id)} 
              />
              <button 
                onClick={() => onSelectWorld(w)}
                className="absolute right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 px-3 py-1 bg-primary/10 text-primary text-[10px] font-label uppercase tracking-widest rounded hover:bg-primary hover:text-on-primary transition-all"
              >
                Enter World
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WorldList;
