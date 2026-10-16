import React, { useState } from 'react';
import { Star, Play, Gamepad2 } from 'lucide-react';

export const GameCard = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-cyan-950/40"
    >
      {/* Thumbnail or Fallback Graphic */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        {game.thumbnail && !imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-4 text-center">
            <Gamepad2 className="w-10 h-10 text-cyan-400 mb-2 opacity-80 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-300">{game.title}</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-slate-400 hover:text-amber-400 border border-slate-700/60 transition-colors"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : ''
            }`}
          />
        </button>

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-3 bg-cyan-400 text-slate-950 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-5 h-5 fill-slate-950" />
          </div>
        </div>
      </div>

      {/* Card Info - ZERO PILL DISCIPLINE: Unboxed text with typographic separators */}
      <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors text-base line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Metadata: Unboxed text with · separators */}
        <div className="pt-2 mt-1 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-300">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono-numbers text-amber-400/90">★ {Number(game.rating).toFixed(1)}</span>
          </div>
          <span className="font-mono-numbers text-slate-500">
            {game.playsCount > 1000 ? `${(game.playsCount / 1000).toFixed(1)}k plays` : `${game.playsCount} plays`}
          </span>
        </div>
      </div>
    </div>
  );
};
