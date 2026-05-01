import React from 'react';

const DashboardHeader = ({ 
  selectedUniverse, 
  selectedWorld, 
  onBackToMultiverse, 
  onBackToUniverse, 
  searchQuery, 
  setSearchQuery, 
  userData, 
  isAvatarMenuOpen, 
  setIsAvatarMenuOpen, 
  onOpenSettings, 
  onLogout,
  avatarMenuRef
}) => {
  return (
    <header className="flex justify-between items-center w-full px-12 py-8 bg-[#0e1512] shrink-0">
      <div className="flex flex-col">
        {selectedUniverse && (
          <div className="flex items-center gap-2 mb-1">
            <button onClick={onBackToMultiverse} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary">Universe</span>
            {selectedWorld && (
              <>
                <span className="text-outline-variant opacity-40 mx-1 text-xs">/</span>
                <button onClick={onBackToUniverse} className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="font-label text-[10px] uppercase tracking-[0.2em]">World</span>
                </button>
              </>
            )}
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline">
          {selectedWorld ? selectedWorld.world_name : (selectedUniverse ? selectedUniverse.universe_name : 'Your Multiverse')}
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 max-w-xl">
          {selectedWorld ? (selectedWorld.world_description || 'Breathing life into the inhabitants of this realm.') : (selectedUniverse ? (selectedUniverse.universe_description || 'Weave new realities from the fabric of the void.') : 'Weave new realities from the fabric of the void.')}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-primary">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedWorld ? "Search Personas..." : (selectedUniverse ? "Scan Sectors..." : "Scan Realities...")}
              className="bg-transparent border-none focus:ring-0 text-on-surface text-sm placeholder:text-on-surface-variant/30"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={avatarMenuRef}>
            <button
              onClick={() => setIsAvatarMenuOpen(prev => !prev)}
              className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden hover:border-primary transition-all active:scale-95 flex items-center justify-center bg-primary/10"
            >
              <span className="material-symbols-outlined text-primary">person</span>
            </button>
            {isAvatarMenuOpen && (
              <div className="absolute right-0 top-12 w-52 bg-[#1a211e] border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-outline-variant/10">
                  <p className="text-on-surface text-xs font-semibold font-headline">{userData.user_name || 'Architect'}</p>
                  <p className="text-outline text-[10px] mt-0.5 truncate">{userData.user_email}</p>
                </div>
                <button
                  onClick={() => { onOpenSettings(); setIsAvatarMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all text-xs font-label uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  Narrative Settings
                </button>
                <button
                  onClick={() => { onLogout(); setIsAvatarMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high hover:text-red-400 transition-all text-xs font-label uppercase tracking-widest"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
