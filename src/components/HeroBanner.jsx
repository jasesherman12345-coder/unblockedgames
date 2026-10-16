import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import heroImage from '../assets/images/hero_arcade_vault_1792108786479.jpg';

export const HeroBanner = ({ featuredGame, onPlay }) => {
  if (!featuredGame) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 mb-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
        {/* Left Content */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10">
          <div>
            {/* Subtle editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED UNBLOCKED GAME</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
              {featuredGame.title}
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-lg">
              {featuredGame.description}
            </p>

            {/* Zero-pill metadata */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-200">{featuredGame.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono-numbers text-amber-400">★ {Number(featuredGame.rating).toFixed(1)}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono-numbers text-slate-400">
                {featuredGame.playsCount?.toLocaleString()} plays
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(featuredGame)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-cyan-400/25 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Play Now</span>
            </button>

            <div className="text-xs text-slate-400">
              Controls: <span className="text-slate-300 font-mono">{featuredGame.controls}</span>
            </div>
          </div>
        </div>

        {/* Right Media / Image */}
        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden bg-slate-950">
          <img
            src={heroImage || "/images/hero_arcade_vault.jpg"}
            alt="Arcade Gaming Vault"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};
