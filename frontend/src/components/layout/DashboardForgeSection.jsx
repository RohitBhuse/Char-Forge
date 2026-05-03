import React, { useState } from 'react';
import { CelestialEngine, UniverseForm } from '../../features/universe';
import { WorldForgeForm, WorldWeaverChat } from '../../features/world';
import { CharacterForgeForm, CharacterWeaverChat } from '../../features/character';

const DashboardForgeSection = ({
  selectedUniverse,
  selectedWorld,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isChatting,
  handleForge,
  isForgingUniverse,
  name,
  setName,
  description,
  setDescription,
  fetchWorlds,
  fetchCharacters,
  activeTab
}) => {
  return (
    <section className="flex flex-col transition-all duration-500 h-full min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'chat' ? (
          /* Tool/Chat Section */
          <div className="relative flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {selectedWorld ? (
              <CharacterWeaverChat
                universeId={selectedUniverse.universe_id}
                worldId={selectedWorld.world_id}
                worldName={selectedWorld.world_name}
              />
            ) : selectedUniverse ? (
              <WorldWeaverChat
                universeId={selectedUniverse.universe_id}
                universeName={selectedUniverse.universe_name}
              />
            ) : (
              <CelestialEngine
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
                isForging={isChatting}
              />
            )}
          </div>
        ) : (
          /* Form Section */
          <div className="w-full h-full overflow-y-auto custom-scrollbar pr-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {selectedWorld ? (
              <CharacterForgeForm
                universeId={selectedUniverse.universe_id}
                worldId={selectedWorld.world_id}
                characterSchema={selectedWorld.attribute_list ? selectedWorld.attribute_list.split(',').map(s => s.trim()).filter(Boolean) : []}
                onCharacterForged={() => fetchCharacters(selectedUniverse.universe_id, selectedWorld.world_id)}
              />
            ) : selectedUniverse ? (
              <WorldForgeForm 
                universeId={selectedUniverse.universe_id} 
                onWorldForged={() => fetchWorlds(selectedUniverse.universe_id)} 
              />
            ) : (
              <UniverseForm
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                handleForge={handleForge}
                isForging={isForgingUniverse}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardForgeSection;
