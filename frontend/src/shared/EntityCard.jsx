import React from 'react';

const EntityCard = ({ type, item, onClick, onDelete }) => {
  const isUniverse = type === 'universe';
  const isCharacter = type === 'character';
  const id = isUniverse ? item.universe_id : (isCharacter ? item.character_id : item.world_id);
  const name = isUniverse ? item.universe_name : (isCharacter ? item.character_name : item.world_name);
  const description = isUniverse ? item.universe_description : (isCharacter ? (item.backstory || item.appearance) : item.world_description);
  const metaIcon = isUniverse ? 'schema' : (isCharacter ? 'person' : 'language');
  const metaLabel = isUniverse ? 'Active Reality' : (isCharacter ? (item.tags || 'Persona') : (item.world_timeline || 'Present Era'));

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300 shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="h-48 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent z-10"></div>
        <img
          alt={`${type} Thumbnail`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={`https://picsum.photos/seed/${type}-${id}/800/600`}
        />
        {onDelete && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              className="p-2 bg-surface-dim/80 backdrop-blur-md rounded-full text-error opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-container hover:text-on-error-container"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-6 space-y-2 flex-grow flex flex-col">
        <h4 className="text-lg font-bold text-on-surface font-headline group-hover:text-primary transition-colors">
          {name}
        </h4>
        <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed flex-grow">
          {description || 'No description provided.'}
        </p>
        <div className="flex items-center gap-4 pt-4 mt-auto">
          <div className="flex items-center gap-1.5 text-[0.65rem] font-label uppercase tracking-tighter text-tertiary">
            <span className="material-symbols-outlined text-sm">{metaIcon}</span>
            {metaLabel}
          </div>
          <div className="flex items-center gap-1.5 text-[0.65rem] font-label uppercase tracking-tighter text-outline-variant opacity-60 ml-auto">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityCard;
