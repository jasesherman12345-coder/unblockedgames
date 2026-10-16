import React, { useEffect, useState } from 'react';
import { Shield, EyeOff, AlertTriangle } from 'lucide-react';

const PRESETS = {
  default: {
    title: 'Nova Games - Unblocked Games Hub',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎮</text></svg>',
    label: 'Normal (Nova Games)'
  },
  classroom: {
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    label: 'Google Classroom'
  },
  drive: {
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    label: 'Google Drive'
  },
  docs: {
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    label: 'Google Docs'
  },
  canvas: {
    title: 'Dashboard | Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
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
