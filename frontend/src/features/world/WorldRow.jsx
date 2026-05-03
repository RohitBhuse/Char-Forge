import React, { useState } from 'react';

function WorldRow({ world, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="group border border-outline-variant/10 rounded-lg bg-surface-container-low hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <span className="material-symbols-outlined text-primary text-base shrink-0">language</span>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-semibold text-on-surface text-sm truncate">{world.world_name}</p>
          {world.world_timeline && (
            <p className="text-outline text-[10px] font-label uppercase tracking-widest mt-0.5 truncate">
              ↯ {typeof world.world_timeline === 'string' && world.world_timeline.includes('-') 
                ? world.world_timeline.split('-')[0] 
                : world.world_timeline}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-label uppercase tracking-widest text-outline-variant opacity-60">
            {new Date(world.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(world.world_id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
          <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-4 border-t border-outline-variant/10 pt-3 space-y-2 animate-in fade-in duration-200">
          {world.world_description && <p className="text-on-surface-variant text-xs leading-relaxed break-words">{world.world_description}</p>}
          {world.world_timeline && (
            <div className="flex items-start gap-2 mt-2">
              <span className="w-3 h-px bg-primary/60 mt-1.5 shrink-0" />
              <p className="text-on-surface-variant text-xs italic leading-relaxed">
                {typeof world.world_timeline === 'string' && world.world_timeline.includes('-') 
                  ? world.world_timeline.split('-')[0] 
                  : world.world_timeline}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorldRow;
