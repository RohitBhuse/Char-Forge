import React from 'react';
import EntityCard from '../../shared/EntityCard';

const UniverseList = ({ universes, filteredUniverses, handleDelete, onSelect }) => {
  return (
    <section className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-bold font-headline tracking-tight">Existing Realities</h3>
        <div className="h-px flex-1 bg-outline-variant/10 mx-8"></div>
        <span className="font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
          {universes.length} Active Domains
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUniverses.length > 0 ? (
          filteredUniverses.map((univ) => (
            <EntityCard
              key={univ.universe_id}
              type="universe"
              item={univ}
              onClick={() => onSelect(univ)}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full py-20 border-2 border-dashed border-outline-variant/10 rounded-2xl bg-surface-container-low/30 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl text-primary animate-pulse">auto_awesome</span>
            </div>
            <h4 className="text-xl font-bold font-headline text-on-surface mb-2">The Void Awaits</h4>
            <p className="text-on-surface-variant text-center max-w-sm text-sm leading-relaxed px-6">
              No realities have been woven in this sector yet. Use the Celestial Engine above to manifest your first universe.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UniverseList;
