import React from 'react';
import { Plus } from 'lucide-react';

export const Navbar = ({
  activeView,
  onNavigate,
  onOpenAddModal,
  favoritesCount
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('home');
        }}
        className="text-xl font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
      >
        Nova Games
      </a>

      {/* Zone 2: 4 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onNavigate('home')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'home' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          All Games
        </button>
        <button
          onClick={() => onNavigate('favorites')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeView === 'favorites' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          <span>Favorites</span>
          {favoritesCount > 0 && (
            <span className="text-xs font-mono-numbers text-amber-400">({favoritesCount})</span>
          )}
        </button>
        <button
          onClick={() => onNavigate('categories')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'categories' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => onNavigate('json')}
          className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 ${
            activeView === 'json' ? 'text-cyan-400 font-semibold' : ''
          }`}
        >
          JSON Store
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm hover:shadow-cyan-400/20 transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Game</span>
        </button>
      </div>
    </header>
  );
};
