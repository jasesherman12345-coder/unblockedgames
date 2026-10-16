import React, { useEffect, useState } from 'react';
import { Shield, EyeOff, AlertTriangle } from 'lucide-react';

const PRESETS = {
  default: {
    title: 'Nova Games - Unblocked Games Hub',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="%23090d16"/><path d="M18 24h28a10 10 0 0 1 10 10v6a10 10 0 0 1-10 10h-2l-4-4h-8l-4 4h-2a10 10 0 0 1-10-10v-6a10 10 0 0 1 10-10z" fill="%230f172a" stroke="%2322d3ee" stroke-width="2.5"/><circle cx="41" cy="35" r="2.5" fill="%23f43f5e"/><circle cx="46" cy="40" r="2.5" fill="%23facc15"/></svg>',
    label: 'Normal (Nova Games)'
  },
  classroom: {
    title: 'Classes',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="42" height="32" x="3" y="8" rx="4" fill="%23137333"/><rect width="36" height="26" x="6" y="11" rx="2" fill="%231e8e3e"/><circle cx="24" cy="20" r="4" fill="%23fbbc04"/><path d="M16 28c0-3 4-4 8-4s8 1 8 4" fill="%23fbbc04"/></svg>',
    label: 'Google Classroom'
  },
  drive: {
    title: 'My Drive - Google Drive',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78"><path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="%230066da"/><path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="%2300ac47"/><path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="%23ea4335"/><path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="%2300832d"/><path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="%23ffba00"/><path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="%232684fc"/></svg>',
    label: 'Google Drive'
  },
  docs: {
    title: 'Untitled document - Google Docs',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M30 4H14c-2.2 0-4 1.8-4 4v32c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4V14L30 4z" fill="%234285f4"/><path d="M30 4v10h10" fill="%23a1c2fa"/><path d="M16 22h16M16 28h16M16 34h10" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round"/></svg>',
    label: 'Google Docs'
  },
  canvas: {
    title: 'Dashboard | Canvas',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="%23e13f2b"/><circle cx="24" cy="24" r="14" fill="%23ffffff"/><circle cx="24" cy="24" r="9" fill="%23e13f2b"/></svg>',
    label: 'Canvas LMS'
  }
};

export const CloakManager = ({ currentPreset, onSelectPreset }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Apply title and favicon when preset changes
  useEffect(() => {
    const config = PRESETS[currentPreset] || PRESETS.default;
    document.title = config.title;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = config.favicon;
  }, [currentPreset]);

  // Global Panic Button listener (instant redirect to safe site)
  const triggerPanic = () => {
    window.location.replace('https://classroom.google.com');
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Disguise this tab's title and icon"
        >
          <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cloak: {PRESETS[currentPreset]?.label || 'Default'}</span>
        </button>

        <button
          onClick={triggerPanic}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/70 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          title="Panic Button: Instantly closes games and opens Google Classroom"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Panic</span>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-xl z-50 py-1 divide-y divide-slate-800">
            <div className="px-3 py-2 text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              Tab Title & Icon Disguise
            </div>
            <div className="py-1">
              {Object.keys(PRESETS).map(key => (
                <button
                  key={key}
                  onClick={() => {
                    onSelectPreset(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    currentPreset === key
                      ? 'bg-cyan-950/50 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{PRESETS[key].label}</span>
                  {currentPreset === key && <span className="text-cyan-400 text-xs">Active</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
