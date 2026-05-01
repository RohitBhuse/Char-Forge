import React from 'react';
import { CelestialEngine, UniverseForm } from '../../features/universe';
import { WorldForgeForm, WorldWeaverChat } from '../../features/world';
import { CharacterForgeForm, CharacterWeaverChat } from '../../features/character';

const DashboardForgeSection = ({
  selectedUniverse,
  selectedWorld,
  isChatActive,
  setIsChatActive,
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
  fetchCharacters
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch transition-all duration-500">
      {/* Tool Column (Left) */}
      <div className="lg:col-span-4 lg:sticky lg:top-8 h-full relative">
        <div className="absolute inset-0">
          {selectedWorld ? (
            isChatActive ? (
              <CharacterWeaverChat
                universeId={selectedUniverse.universe_id}
                worldId={selectedWorld.world_id}
                worldName={selectedWorld.world_name}
                onClose={() => setIsChatActive(false)}
              />
            ) : (
              <div className="p-7 rounded-xl bg-surface-container-low border border-outline-variant/10 shadow-[0px_24px_48px_rgba(0,57,33,0.1)] flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-primary mb-4 font-headline">Character Weaver</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    Breathe life into the inhabitants of {selectedWorld.world_name}. Define their past, their quirks, and their destiny.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">face</span>
                      Describe physical traits and style.
                    </li>
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">psychology</span>
                      Specify habits and personality quirks.
                    </li>
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">auto_stories</span>
                      Create a deep and compelling backstory.
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setIsChatActive(true)}
                  className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Create Persona
                </button>
              </div>
            )
          ) : selectedUniverse ? (
            isChatActive ? (
              <WorldWeaverChat
                universeId={selectedUniverse.universe_id}
                universeName={selectedUniverse.universe_name}
                onClose={() => setIsChatActive(false)}
              />
            ) : (
              <div className="p-7 rounded-xl bg-surface-container-low border border-outline-variant/10 shadow-[0px_24px_48px_rgba(0,57,33,0.1)] flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-primary mb-4 font-headline">Celestial Engine</h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    Define the physical constants and the narrative soul of your next world within {selectedUniverse.universe_name}.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">history</span>
                      Specify the timeline and era of the world.
                    </li>
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">map</span>
                      Detail local geography and civilizations.
                    </li>
                    <li className="flex items-start gap-3 text-[0.6875rem] text-on-surface-variant/70 font-label uppercase tracking-wider leading-relaxed">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">auto_stories</span>
                      Create unique narrative hooks for your world.
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => setIsChatActive(true)}
                  className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  Create World
                </button>
              </div>
            )
          ) : (
            <CelestialEngine
              isChatActive={isChatActive}
              setIsChatActive={setIsChatActive}
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              isForging={isChatting}
            />
          )}
        </div>
      </div>

      {/* Form Column (Right) */}
      <div className="lg:col-span-8 h-full">
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
    </section>
  );
};

export default DashboardForgeSection;
