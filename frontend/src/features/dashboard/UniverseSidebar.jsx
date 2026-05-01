import React, { useState } from 'react';

const UniverseSidebar = ({ universes, selectedUniverse, onSelectUniverse, selectedWorld, viewingCharacter, isInsightsView, onOpenInsights, onBackToUniverses, onLogout, onOpenSettings }) => {
  // Determine dynamic label and icon
  let dynamicLabel = 'Universes';
  let dynamicIcon = 'public';

  if (viewingCharacter) {
    dynamicLabel = viewingCharacter.character_name;
    dynamicIcon = 'person';
  } else if (selectedWorld) {
    dynamicLabel = selectedWorld.world_name;
    dynamicIcon = 'language';
  } else if (selectedUniverse) {
    dynamicLabel = selectedUniverse.universe_name;
    dynamicIcon = 'auto_awesome_motion';
  }

  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col p-6 space-y-8 bg-[#161d1a] w-64 z-50">
      <div className="flex flex-col space-y-1">
        <span className="text-xl font-black text-[#59de9b] tracking-tighter font-headline">The Loom</span>
        <span className="font-label uppercase tracking-[0.1em] text-[0.6875rem] text-[#3cddc7] opacity-60">Celestial Architect</span>
      </div>
      
      <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto custom-scrollbar pr-2">
        {/* Dashboard Button - Always at the top */}
        <button 
          onClick={onOpenInsights}
          className={`w-full rounded-md px-4 py-3 flex items-center gap-3 transition-all duration-300 ease-in-out ${isInsightsView ? 'bg-[#2f3633] text-[#59de9b]' : 'text-[#3cddc7] opacity-60 hover:opacity-100 hover:bg-[#242c28]'}`}
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label uppercase tracking-[0.1em] text-[0.6875rem]">Dashboard</span>
        </button>

        {/* Dynamic Context Button */}
        <button 
          onClick={() => {
            if (isInsightsView) {
              onBackToUniverses();
            }
          }}
          className={`w-full rounded-md px-4 py-3 flex items-center gap-3 transition-all duration-300 ease-in-out ${!isInsightsView ? 'bg-[#2f3633] text-[#59de9b]' : 'text-[#3cddc7] opacity-60 hover:opacity-100 hover:bg-[#242c28]'}`}
        >
          <span className="material-symbols-outlined">{dynamicIcon}</span>
          <span className="font-label uppercase tracking-[0.1em] text-[0.6875rem] truncate">
            {dynamicLabel}
          </span>
        </button>
      </nav>

      <div className="pt-6 border-t border-outline-variant/20 flex flex-col space-y-2 shrink-0">
        <button
          onClick={onOpenSettings}
          className="text-[#3cddc7] opacity-70 px-4 py-3 flex items-center gap-3 hover:bg-[#242c28] hover:opacity-100 transition-all duration-300 ease-in-out rounded-md w-full text-left"
        >
          <span className="material-symbols-outlined">tune</span>
          <span className="font-label uppercase tracking-[0.1em] text-[0.6875rem]">Settings</span>
        </button>
        <button 
          onClick={onLogout} 
          className="text-[#3cddc7] opacity-60 px-4 py-3 flex items-center gap-3 hover:bg-[#242c28] hover:opacity-100 transition-all duration-300 ease-in-out rounded-md w-full text-left"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label uppercase tracking-[0.1em] text-[0.6875rem]">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UniverseSidebar;
