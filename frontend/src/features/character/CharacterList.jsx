import React from 'react';
import { UniverseToolbar } from '../universe';
import EntityCard from '../../shared/EntityCard';
import CharacterRow from './CharacterRow';

const CharacterList = ({ 
  characters, 
  isLoading, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  onViewCharacter, 
  onDeleteCharacter 
}) => {
  const sortedCharacters = [...characters].sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return (
    <>
      <UniverseToolbar 
        worldsCount={characters.length}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        label="Personas"
        showSort={false}
      />
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="material-symbols-outlined text-primary animate-spin text-3xl">autorenew</span>
        </div>
      ) : characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-outline-variant/10 rounded-2xl bg-surface-container-low/30">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-3xl text-primary animate-pulse">person</span>
          </div>
          <h4 className="text-xl font-bold font-headline text-on-surface mb-2">No Personas Found</h4>
          <p className="text-on-surface-variant text-center max-w-sm text-sm leading-relaxed px-6">
            No personas have been created in this world yet. Use the Character Weaver above to create your first persona.
          </p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {sortedCharacters.map(c => (
            <EntityCard 
              key={c.character_id} 
              type="character" 
              item={c} 
              onClick={() => onViewCharacter(c)}
              onDelete={onDeleteCharacter} 
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-300">
          {sortedCharacters.map(c => (
            <CharacterRow 
              key={c.character_id} 
              character={c} 
              onViewProfile={() => onViewCharacter(c)}
              onDelete={() => onDeleteCharacter(c.character_id)} 
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CharacterList;
