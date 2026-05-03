import React, { useState } from 'react';

function CharacterRow({ character, onDelete, onViewProfile }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="group border border-outline-variant/10 rounded-lg bg-surface-container-low hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <span className="material-symbols-outlined text-primary text-base shrink-0">person</span>
        <div className="flex-1 min-w-0">
          <p className="font-headline font-semibold text-on-surface text-sm truncate">{character.character_name}</p>
          {character.tags && (
            <p className="text-outline text-[10px] font-label uppercase tracking-widest mt-0.5 truncate">🏷️ {character.tags}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-label uppercase tracking-widest text-outline-variant opacity-60">
            {new Date(character.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onViewProfile(); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-surface-container-highest text-primary transition-all"
            title="View Profile"
          >
            <span className="material-symbols-outlined text-sm">person_book</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(character.character_id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-surface-container-highest text-on-surface-variant hover:text-red-400 transition-all"
            title="Delete Persona"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
          <span className={`material-symbols-outlined text-sm text-on-surface-variant transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
        </div>
      </div>
      {expanded && (
        <div className="px-5 pb-4 border-t border-outline-variant/10 pt-3 space-y-3 animate-in fade-in duration-200">
          {(character.character_attribute?.appearance || character.appearance) && (
            <div>
              <p className="text-primary text-[10px] font-label uppercase tracking-widest mb-1">Appearance</p>
              <p className="text-on-surface-variant text-xs leading-relaxed break-words">{character.character_attribute?.appearance || character.appearance}</p>
            </div>
          )}
          {(character.character_attribute?.strengths || character.strength_and_interests) && (
            <div>
              <p className="text-primary text-[10px] font-label uppercase tracking-widest mb-1">Strengths & Interests</p>
              <p className="text-on-surface-variant text-xs leading-relaxed break-words">{character.character_attribute?.strengths || character.strength_and_interests}</p>
            </div>
          )}
          {(character.character_attribute?.background_story || character.backstory) && (
            <div>
              <p className="text-primary text-[10px] font-label uppercase tracking-widest mb-1">Backstory</p>
              <p className="text-on-surface-variant text-xs leading-relaxed break-words">{character.character_attribute?.background_story || character.backstory}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CharacterRow;
