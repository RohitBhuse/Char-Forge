import React, { useState, useEffect, useRef } from 'react';
import { UniverseList } from '../features/universe';
import { ProfileSettingsPanel, UniverseSidebar } from '../features/dashboard';
import { WorldAttributeConfig, WorldList } from '../features/world';
import { CharacterProfile, CharacterList } from '../features/character';
import CosmicInsights from '../shared/CosmicInsights';
import DeleteConfirmation from '../shared/DeleteConfirmation';
import DashboardHeader from '../components/layout/DashboardHeader';
import DashboardForgeSection from '../components/layout/DashboardForgeSection';
import { api } from '../services/api';
import { useUniverse } from '../hooks/useUniverse';
import { useWorld } from '../hooks/useWorld';
import { useCharacter } from '../hooks/useCharacter';

export default function DashboardPage({ onLogout }) {
  const { universes, isLoading: isUnivLoading, fetchUniverses, deleteUniverse } = useUniverse();
  const { worlds, setWorlds, isLoading: isWorldsLoading, fetchWorlds, deleteWorld } = useWorld();
  const { characters, setCharacters, isLoading: isCharsLoading, fetchCharacters, deleteCharacter } = useCharacter();

  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isForgingUniverse, setIsForgingUniverse] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [selectedUniverse, setSelectedUniverse] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [userData, setUserData] = useState({ user_name: '', user_email: '' });
  
  const [viewMode, setViewMode] = useState('card');
  const [sortBy, setSortBy] = useState('created');
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [viewingCharacter, setViewingCharacter] = useState(null);
  const [isInsightsView, setIsInsightsView] = useState(true);
  const [deleteContext, setDeleteContext] = useState(null);

  const avatarMenuRef = useRef(null);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'What kind of universe you want to cook today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    fetchUniverses();
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUserData(JSON.parse(storedUser));
    
    const handleClickOutside = (e) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [fetchUniverses]);

  useEffect(() => {
    if (selectedUniverse) {
      fetchWorlds(selectedUniverse.universe_id);
    }
  }, [selectedUniverse, fetchWorlds]);

  useEffect(() => {
    if (selectedUniverse && selectedWorld) {
      fetchCharacters(selectedUniverse.universe_id, selectedWorld.world_id);
    }
  }, [selectedUniverse, selectedWorld, fetchCharacters]);

  const handleForge = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsForgingUniverse(true);
    try {
      await api.post('/universes/', { universe_name: name, universe_description: description });
      setName('');
      setDescription('');
      fetchUniverses();
    } catch (err) {
      console.error('Failed to forge universe:', err);
    } finally {
      setIsForgingUniverse(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsChatting(true);
    try {
      const { data } = await api.post('/universes/chat', { messages: [...chatMessages, newMsg] });
      setChatMessages(prev => [...prev, data]);
    } catch (err) {
      console.error('Chat failed:', err);
    } finally {
      setIsChatting(false);
    }
  };

  const handleDeleteUniverse = (id) => {
    const univ = universes.find(u => u.universe_id === id);
    setDeleteContext({
      type: 'universe',
      message: `Delete universe "${univ ? univ.universe_name : 'Unknown'}"? All nested worlds and personas will be deleted.`,
      action: async () => {
        try {
          await deleteUniverse(id);
          if (selectedUniverse?.universe_id === id) setSelectedUniverse(null);
        } catch (err) {
          console.error('Failed to delete universe:', err);
        }
      }
    });
  };

  const handleDeleteWorld = (worldId) => {
    const world = worlds.find(w => w.world_id === worldId);
    setDeleteContext({
      type: 'world',
      message: `Delete world "${world ? world.world_name : 'Unknown'}"? All personas will be deleted.`,
      action: async () => {
        try {
          await deleteWorld(selectedUniverse.universe_id, worldId);
          if (selectedWorld?.world_id === worldId) setSelectedWorld(null);
        } catch (err) {
          console.error('Failed to delete world:', err);
        }
      }
    });
  };

  const handleDeleteCharacter = (charId) => {
    const char = characters.find(c => c.character_id === charId);
    setDeleteContext({
      type: 'persona',
      message: `Delete persona "${char ? char.character_name : 'Unknown'}"? This action cannot be undone.`,
      action: async () => {
        try {
          await deleteCharacter(selectedUniverse.universe_id, selectedWorld.world_id, charId);
        } catch (err) {
          console.error('Failed to delete character:', err);
        }
      }
    });
  };

  const filteredUniverses = universes.filter(univ =>
    univ.universe_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWorlds = worlds.filter(w =>
    w.world_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharacters = characters.filter(c =>
    c.character_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-hidden flex">
      <UniverseSidebar 
        universes={universes}
        selectedUniverse={selectedUniverse}
        onSelectUniverse={setSelectedUniverse}
        selectedWorld={selectedWorld}
        viewingCharacter={viewingCharacter}
        isInsightsView={isInsightsView}
        onOpenInsights={() => setIsInsightsView(true)}
        onBackToUniverses={() => setIsInsightsView(false)}
        onLogout={onLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="ml-64 flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar scrollbar-stable">
        {isInsightsView ? (
          <CosmicInsights 
            onNavigate={(type, item, parentUniv, parentWorld) => {
              if (type === 'universe') {
                setSelectedUniverse({ universe_id: item.id, universe_name: item.name, universe_description: item.description });
                setSelectedWorld(null);
                setViewingCharacter(null);
                setIsInsightsView(false);
              } else if (type === 'world') {
                const univ = universes.find(u => u.universe_id === item.universe_id) || parentUniv;
                setSelectedUniverse(univ ? { universe_id: univ.id || univ.universe_id, universe_name: univ.name || univ.universe_name } : { universe_id: item.universe_id });
                setSelectedWorld({ 
                  world_id: item.id, 
                  world_name: item.name, 
                  world_timeline: item.timeline,
                  attribute_list: item.attribute_list,
                  character_schema: item.character_schema || [] 
                });
                setViewingCharacter(null);
                setIsInsightsView(false);
              } else if (type === 'character') {
                const univ = universes.find(u => u.universe_id === parentUniv?.id) || parentUniv;
                setSelectedUniverse(univ ? { universe_id: univ.id || univ.universe_id, universe_name: univ.name || univ.universe_name } : { universe_id: parentUniv?.id });
                setSelectedWorld(parentWorld ? { world_id: parentWorld.id || parentWorld.world_id, world_name: parentWorld.name || parentWorld.world_name, attribute_list: parentWorld.attribute_list } : { world_id: item.world_id });
                setViewingCharacter({ character_id: item.id, character_name: item.name, character_race: item.race, status: item.status, tags: item.tags, character_attribute: item.character_attribute, universe_id: item.universe_id || (univ?.id || univ?.universe_id), world_id: item.world_id || (parentWorld?.id || parentWorld?.world_id) });
                setIsInsightsView(false);
              } else if (type === 'universe_create') {
                setSelectedUniverse(null);
                setSelectedWorld(null);
                setViewingCharacter(null);
                setIsInsightsView(false);
              }
            }}
          />
        ) : viewingCharacter ? (
          <CharacterProfile 
            character={viewingCharacter} 
            onBack={() => setViewingCharacter(null)} 
            userData={userData}
            onLogout={onLogout}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onCharacterUpdated={() => fetchCharacters(selectedUniverse.universe_id, selectedWorld.world_id)}
          />
        ) : (
          <>
            <DashboardHeader 
              selectedUniverse={selectedUniverse}
              selectedWorld={selectedWorld}
              onBackToMultiverse={() => { setSelectedUniverse(null); setSelectedWorld(null); setIsInsightsView(false); }}
              onBackToUniverse={() => setSelectedWorld(null)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              userData={userData}
              isAvatarMenuOpen={isAvatarMenuOpen}
              setIsAvatarMenuOpen={setIsAvatarMenuOpen}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onLogout={onLogout}
              avatarMenuRef={avatarMenuRef}
            />

            <div className="px-12 pb-24 flex flex-col space-y-12">
              <DashboardForgeSection 
                selectedUniverse={selectedUniverse}
                selectedWorld={selectedWorld}
                isChatActive={isChatActive}
                setIsChatActive={setIsChatActive}
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
                isChatting={isChatting}
                handleForge={handleForge}
                isForgingUniverse={isForgingUniverse}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                fetchWorlds={fetchWorlds}
                fetchCharacters={fetchCharacters}
              />

              <section className="space-y-8">
                {selectedWorld ? (
                  <CharacterList 
                    characters={filteredCharacters}
                    isLoading={isCharsLoading}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onViewCharacter={setViewingCharacter}
                    onDeleteCharacter={handleDeleteCharacter}
                  />
                ) : selectedUniverse ? (
                  <WorldList 
                    worlds={filteredWorlds}
                    isLoading={isWorldsLoading}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    onSelectWorld={setSelectedWorld}
                    onDeleteWorld={handleDeleteWorld}
                  />
                ) : (
                  <UniverseList
                    universes={universes}
                    filteredUniverses={filteredUniverses}
                    handleDelete={handleDeleteUniverse}
                    onSelect={(univ) => setSelectedUniverse(univ)}
                  />
                )}
              </section>
            </div>

            {selectedWorld && (!selectedWorld.attribute_list || selectedWorld.attribute_list.trim() === '') && (
              <WorldAttributeConfig 
                world={selectedWorld} 
                universeId={selectedUniverse.universe_id}
                onComplete={(schema) => {
                  if (schema) {
                    setSelectedWorld(prev => ({ ...prev, attribute_list: schema.join(', ') }));
                    fetchWorlds(selectedUniverse.universe_id);
                  } else {
                    setSelectedWorld(null);
                  }
                }} 
              />
            )}
          </>
        )}

        <footer className="mt-auto p-6 bg-surface-container-lowest flex justify-center border-t border-outline-variant/5">
          <p className="text-[0.6875rem] font-label text-on-surface-variant/40 tracking-widest uppercase">
            System Status: <span className="text-primary">Stable</span>
          </p>
        </footer>
      </main>

      {isSettingsOpen && (
        <ProfileSettingsPanel
          onClose={() => setIsSettingsOpen(false)}
          userName={userData.user_name}
          userEmail={userData.user_email}
          onLogout={onLogout}
          selectedUniverse={selectedUniverse}
          selectedWorld={selectedWorld}
          hideWorldSettings={!!viewingCharacter}
          onWorldUpdate={(newSchema) => {
            setSelectedWorld(prev => ({ ...prev, attribute_list: newSchema }));
            if (selectedUniverse) fetchWorlds(selectedUniverse.universe_id);
          }}
        />
      )}

      <DeleteConfirmation 
        deleteContext={deleteContext}
        onCancel={() => setDeleteContext(null)}
        onConfirm={() => {
          deleteContext.action();
          setDeleteContext(null);
        }}
      />
    </div>
  );
}
