import React from 'react';
import { Languages, User, Key, TreePine } from 'lucide-react';
import { translations } from '../data/translations';

export default function Header({ lang, onLangChange, session, onPortalClick }) {
  const t = translations[lang];

  return (
    <header
      className="w-full shrink-0 select-none"
      style={{ background: 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)' }}
    >
      <div
        className="px-4 flex items-center justify-between gap-3"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))', paddingBottom: '14px' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <TreePine size={17} strokeWidth={2} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] font-bold text-white leading-tight truncate">
              {t.appTitle}
            </h1>
            <p className="text-[10px] text-white/65 font-semibold uppercase tracking-[0.12em] mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onPortalClick}
            className={`active-press flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              session
                ? 'bg-white border-white/40 text-coral'
                : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
            }`}
          >
            {session ? <User size={13} strokeWidth={2} /> : <Key size={13} strokeWidth={2} />}
            <span>
              {session
                ? (lang === 'en' ? 'Profile' : 'प्रोफ़ाइल')
                : (lang === 'en' ? 'Portal' : 'पोर्टल')}
            </span>
          </button>

          <button
            onClick={onLangChange}
            className="active-press flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 border border-white/25 text-white text-xs font-semibold hover:bg-white/25 transition-all"
          >
            <Languages size={13} strokeWidth={2} />
            <span>{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
