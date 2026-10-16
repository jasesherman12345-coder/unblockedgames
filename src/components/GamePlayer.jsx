import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  RotateCw,
  X,
  Star,
  ExternalLink,
  Sliders,
  Keyboard,
  Info
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  relatedGames = []
}) => {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reload iframe
  const reloadGame = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  // Native fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Sync fullscreen change event
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard shortcut to close (ESC when not fullscreen)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Open in Stealth about:blank tab (classic unblocked games cloaking feature)
  const openInAboutBlank = () => {
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Pop-up was blocked. Please allow popups for this site.');
      return;
    }
    const doc = win.document;
    doc.title = 'Google Docs';

    // set favicon
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
    doc.head.appendChild(link);

    const style = doc.createElement('style');
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body, html { width: 100%; height: 100%; overflow: hidden; background: #000; }
      iframe { width: 100%; height: 100%; border: none; }
    `;
    doc.head.appendChild(style);

    const iframe = doc.createElement('iframe');
    iframe.src = window.location.origin + game.iframeSrc;
    iframe.allow = 'fullscreen; autoplay';
    doc.body.appendChild(iframe);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-slate-950 text-slate-100 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 p-0' : 'w-full'
      }`}
    >
      {/* Top Player Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close game player (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-100 text-sm md:text-base leading-tight">
              {game.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers text-amber-400">★ {Number(game.rating).toFixed(1)}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers text-slate-500">
                {game.playsCount?.toLocaleString()} plays
              </span>
            </div>
          </div>
        </div>

        {/* Player action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition-colors ${
              isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={reloadGame}
            className="p-2 rounded-lg border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reload game iframe"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`hidden sm:flex p-2 rounded-lg border border-slate-700/60 hover:bg-slate-800 transition-colors ${
              isTheater ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-white'
            }`}
            title={isTheater ? 'Exit theater mode' : 'Theater mode'}
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={openInAboutBlank}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/60 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open in stealth about:blank window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cloaked Tab</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Iframe Canvas Stage */}
      <div
        className={`relative w-full flex items-center justify-center bg-black ${
          isFullscreen
            ? 'h-[calc(100vh-53px)]'
            : isTheater
            ? 'h-[80vh]'
            : 'h-[550px] max-h-[75vh]'
        }`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 gap-3">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-xs text-slate-400 font-mono">Loading game iframe...</div>
          </div>
        )}

        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={game.iframeSrc}
          title={game.title}
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 select-none"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
          allow="fullscreen; autoplay; gamepad"
        />
      </div>

      {/* Under-Game Info & Related Games (when not fullscreen) */}
      {!isFullscreen && (
        <div className="p-6 bg-slate-900 border-t border-slate-800 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Controls Guide */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-2">
                <Keyboard className="w-4 h-4 text-cyan-400" />
                <span>Game Controls</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {game.controls || 'Use arrow keys and spacebar.'}
              </p>
            </div>

            {/* About / Description */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200 mb-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span>About {game.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {game.description}
              </p>
              {game.tags && game.tags.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-medium">Tags:</span>
                  <span>{game.tags.join(' · ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Related Games Row */}
          {relatedGames.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-4">
                More in {game.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {relatedGames.slice(0, 6).map(rel => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectGame(rel)}
                    className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition-all"
                  >
                    <div className="font-semibold text-xs text-slate-200 truncate">
                      {rel.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="text-amber-400 font-mono-numbers">★ {rel.rating}</span>
                      <span>·</span>
                      <span className="text-slate-500">{rel.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
