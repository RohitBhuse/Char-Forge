import React from 'react';

function UniverseToolbar({ worldsCount, sortBy, setSortBy, viewMode, setViewMode, label = "Worlds", showSort = true }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <span className="w-4 h-px bg-primary" />
        <h2 className="font-headline text-2xl font-bold text-on-surface">{label}</h2>
        <span className="text-outline text-xs font-label uppercase tracking-widest">({worldsCount})</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Sort controls */}
        {showSort && (
          <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1">
            <button
              onClick={() => setSortBy('created')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-label uppercase tracking-widest transition-all flex items-center gap-1.5 ${sortBy === 'created' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-xs">schedule</span>Created
            </button>
            <button
              onClick={() => setSortBy('timeline')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-label uppercase tracking-widest transition-all flex items-center gap-1.5 ${sortBy === 'timeline' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-xs">timeline</span>Timeline
            </button>
          </div>
        )}
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-md transition-all ${viewMode === 'card' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="Card view"
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            title="List view"
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniverseToolbar;
