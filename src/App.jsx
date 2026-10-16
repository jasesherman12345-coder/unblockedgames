import React, { useState, useEffect, useMemo, useRef } from 'react';
import defaultGamesData from './data/games.json';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { CloakManager } from './components/CloakManager.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonViewerModal } from './components/JsonViewerModal.jsx';
import { Search, Flame, ArrowUpDown, History } from 'lucide-react';

const CATEGORIES = ['All', 'Arcade', 'Action', 'Puzzle', 'Retro', 'Casual'];

export default function App() {
  // Load custom games from localStorage and merge with default games
  const [games, setGames] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('nova_custom_games');
      const customList = savedCustom ? JSON.parse(savedCustom) : [];
      const defaultList = defaultGamesData;
      // Filter out any duplicates
      const customIds = new Set(customList.map(g => g.id));
      const filteredDefaults = defaultList.filter(g => !customIds.has(g.id));
      return [...filteredDefaults, ...customList];
    } catch (e) {
      return defaultGamesData;
    }
  });

  const [activeGame, setActiveGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [activeNav, setActiveNav] = useState('home');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Cloak state
  const [cloakPreset, setCloakPreset] = useState(() => {
    return localStorage.getItem('nova_cloak_preset') || 'default';
  });

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nova_favorites') || '[]');
    } catch {
      return [];
    }
  });

  // Recently played IDs
  const [recentIds, setRecentIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('nova_recents') || '[]');
    } catch {
      return [];
    }
  });

  const searchInputRef = useRef(null);

  // Quick keyboard shortcuts: '/' focuses search
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleSelectCloak = (preset) => {
    setCloakPreset(preset);
    localStorage.setItem('nova_cloak_preset', preset);
  };

  const handleToggleFavorite = (gameId) => {
    setFavorites(prev => {
      const next = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('nova_favorites', JSON.stringify(next));
      return next;
    });
  };

  const handlePlayGame = (game) => {
    setActiveGame(game);
    // Track play count locally
    setGames(prev =>
      prev.map(g => (g.id === game.id ? { ...g, playsCount: g.playsCount + 1 } : g))
    );
    // Track recent
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== game.id);
      const next = [game.id, ...filtered].slice(0, 8);
      localStorage.setItem('nova_recents', JSON.stringify(next));
      return next;
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGame = (newGame) => {
    setGames(prev => {
      const next = [newGame, ...prev];
      const customOnly = next.filter(g => g.isCustom);
      localStorage.setItem('nova_custom_games', JSON.stringify(customOnly));
      return next;
    });
  };

  const handleImportGames = (imported) => {
    setGames(imported);
    const customOnly = imported.filter(g => g.isCustom);
    localStorage.setItem('nova_custom_games', JSON.stringify(customOnly));
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('nova_custom_games');
    setGames(defaultGamesData);
  };

  // Filtered & Sorted Games List
  const filteredGames = useMemo(() => {
    let list = [...games];

    // Navigation filter
    if (activeNav === 'favorites') {
      list = list.filter(g => favorites.includes(g.id));
    }

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter(g => g.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.tags && g.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'popular') return b.playsCount - a.playsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [games, activeNav, activeCategory, searchQuery, sortBy, favorites]);

  // Featured game for hero banner
  const featuredGame = useMemo(() => {
    return games.find(g => g.featured) || games[0];
  }, [games]);

  // Recently played game objects
  const recentGames = useMemo(() => {
    return recentIds
      .map(id => games.find(g => g.id === id))
      .filter(Boolean);
  }, [recentIds, games]);

  // Related games when active game is loaded
  const relatedGames = useMemo(() => {
    if (!activeGame) return [];
    return games.filter(
      g => g.id !== activeGame.id && g.category === activeGame.category
    );
  }, [activeGame, games]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar (adheres to 3-zone contract) */}
      <Navbar
        activeView={activeNav}
        onNavigate={(view) => {
          if (view === 'json') {
            setIsJsonModalOpen(true);
          } else {
            setActiveNav(view);
            if (view === 'categories') {
              setActiveCategory('Arcade');
            } else if (view === 'home') {
              setActiveCategory('All');
            }
          }
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Secondary Controls Toolbar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search unblocked games... (Press '/' to focus)"
              className="w-full pl-9 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if (activeNav === 'favorites') setActiveNav('home');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector & Tab Cloak Manager */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            {/* Tab Cloak & Panic Button */}
            <CloakManager
              currentPreset={cloakPreset}
              onSelectPreset={handleSelectCloak}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {/* Active Game Player Stage */}
        {activeGame ? (
          <div className="mb-10 animate-in fade-in duration-200">
            <GamePlayer
              game={activeGame}
              onClose={() => setActiveGame(null)}
              isFavorite={favorites.includes(activeGame.id)}
              onToggleFavorite={handleToggleFavorite}
              onSelectGame={handlePlayGame}
              relatedGames={relatedGames}
            />
          </div>
        ) : (
          <>
            {/* Hero Showcase (only on default view with no search) */}
            {activeNav === 'home' && !searchQuery && activeCategory === 'All' && (
              <HeroBanner
                featuredGame={featuredGame}
                onPlay={handlePlayGame}
              />
            )}

            {/* Recently Played Bar (if exists and on home) */}
            {recentGames.length > 0 && !searchQuery && activeCategory === 'All' && activeNav === 'home' && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Jump Back In
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {recentGames.map(game => (
                    <button
                      key={game.id}
                      onClick={() => handlePlayGame(game)}
                      className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-400/50 text-left transition-all group"
                    >
                      <div className="font-semibold text-xs text-slate-200 group-hover:text-cyan-300 truncate">
                        {game.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {game.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Section Heading & Result Count */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-100">
              {activeNav === 'favorites'
                ? 'Your Favorited Games'
                : searchQuery
                ? `Search Results for "${searchQuery}"`
                : activeCategory === 'All'
                ? 'All Available Games'
                : `${activeCategory} Games`}
            </h2>
            <span className="text-xs font-mono-numbers text-slate-500">
              {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </span>
          </div>

          {activeNav === 'favorites' && favorites.length > 0 && (
            <button
              onClick={() => setActiveNav('home')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Browse all games
            </button>
          )}
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlayGame}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Flame className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-200 text-sm">No games found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {activeNav === 'favorites'
                ? "You haven't added any games to your favorites yet. Click the star on any game card to bookmark it."
                : 'Try adjusting your search keywords or switching category filters.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                  Clear Search
                </button>
              )}
              {activeCategory !== 'All' && (
                <button
                  onClick={() => setActiveCategory('All')}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                  Show All Categories
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Nova Games</span>
            <span aria-hidden="true">·</span>
            <span>Unblocked HTML5 Game Portal</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-numbers">{games.length} Games in JSON Store</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              View games.json
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Add Custom Game
            </button>
            <span>·</span>
            <span>Shortcut: Press [ / ] to search</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
      />

      <JsonViewerModal
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
        games={games}
        onImportGames={handleImportGames}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
