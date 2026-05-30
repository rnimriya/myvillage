import React, { useState, useMemo } from 'react';
import { Search, FileText, CheckCircle, Gift, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';

const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

const CAT_META = {
  agriculture: { color: '#16a34a', light: '#f0fdf4', border: '#bbf7d0', emoji: '🌾', label: { en: 'Farming',   hi: 'कृषि'       } },
  housing:     { color: '#d97706', light: '#fffbeb', border: '#fde68a', emoji: '🏠', label: { en: 'Housing',   hi: 'आवास'      } },
  healthcare:  { color: '#dc2626', light: '#fef2f2', border: '#fecaca', emoji: '🏥', label: { en: 'Health',    hi: 'स्वास्थ्य' } },
  education:   { color: '#2563eb', light: '#eff6ff', border: '#bfdbfe', emoji: '🎓', label: { en: 'Education', hi: 'शिक्षा'    } },
};

export default function Schemes({ lang }) {
  const t = translations[lang];
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedScheme, setExpandedScheme] = useState(null);

  const categories = useMemo(() => [
    { id: 'all',         emoji: '🌟', label: { en: 'All',       hi: 'सभी'       } },
    { id: 'agriculture', emoji: '🌾', label: { en: 'Farming',   hi: 'कृषि'      } },
    { id: 'housing',     emoji: '🏠', label: { en: 'Housing',   hi: 'आवास'      } },
    { id: 'healthcare',  emoji: '🏥', label: { en: 'Health',    hi: 'स्वास्थ्य' } },
    { id: 'education',   emoji: '🎓', label: { en: 'Education', hi: 'शिक्षा'    } },
  ], []);

  const schemesList = db.getSchemes();

  const filteredSchemes = useMemo(() => {
    return schemesList.filter((s) => {
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        s.name[lang].toLowerCase().includes(q) ||
        s.benefits[lang].toLowerCase().includes(q) ||
        s.eligibility[lang].toLowerCase().includes(q) ||
        s.department[lang].toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory, lang, schemesList]);

  const toggleExpand = (id) => setExpandedScheme(prev => prev === id ? null : id);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#F2F9F5]">

      {/* ── Green Hero ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ background: G }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(27,94,59,0.45)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-8 left-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'rgba(110,231,183,0.07)', transform: 'translate(-20%,0)' }} />

        <div className="relative z-10" style={{ padding: '20px 20px 8px' }}>
          <p className="text-green-300 text-xs font-semibold mb-1">
            📋 {lang === 'en' ? 'Government Schemes' : 'सरकारी योजनाएं'}
          </p>
          <h2 className="text-[22px] font-black text-white leading-tight">
            {lang === 'en' ? 'Find Your Scheme' : 'अपनी योजना खोजें'}
          </h2>
          <p className="text-white/50 text-xs font-medium mt-1 mb-4">
            {schemesList.length} {lang === 'en' ? 'schemes available for your village' : 'योजनाएं आपके गांव के लिए उपलब्ध'}
          </p>

          {/* Search inside hero */}
          <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-full px-4 py-3 flex items-center gap-3 mb-2">
            <Search size={15} className="text-white/50 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search schemes...' : 'योजनाएं खोजें...'}
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-white/50 active-press">
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
        <div className="relative z-10"><Wave /></div>
      </div>

      {/* ── Category Pills ── */}
      <div className="px-4 overflow-x-auto no-scrollbar -mt-1 mb-1">
        <div className="flex gap-2 py-3">
          {categories.map(cat => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`active-press shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  active
                    ? 'bg-[#0F3D27] text-white border-[#0F3D27] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label[lang]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Result count ── */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-[#52786A] uppercase tracking-[0.08em]">
          {filteredSchemes.length} {lang === 'en' ? 'schemes found' : 'योजनाएं मिलीं'}
        </p>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-[11px] font-bold text-coral active-press"
          >
            {lang === 'en' ? 'Clear filter' : 'फ़िल्टर हटाएं'}
          </button>
        )}
      </div>

      {/* ── Scheme Cards ── */}
      <div className="px-4 pb-8 flex flex-col gap-3">
        {filteredSchemes.length > 0 ? filteredSchemes.map((scheme) => {
          const meta    = CAT_META[scheme.category] || { color: '#6b7280', light: '#f9fafb', border: '#e5e7eb', emoji: '📋', label: { en: scheme.category, hi: scheme.category } };
          const isOpen  = expandedScheme === scheme.id;

          return (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-sm overflow-hidden"
              style={{ borderLeft: `4px solid ${meta.color}` }}>

              {/* Card body */}
              <div className="p-4">
                {/* Top row: icon + name + dept */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: meta.light, border: `1px solid ${meta.border}` }}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full inline-block mb-1.5">
                      🏛️ {scheme.department[lang]}
                    </span>
                    <h3 className="text-[14px] font-bold text-[#0D2B1A] leading-snug">
                      {scheme.name[lang]}
                    </h3>
                  </div>
                  {/* Category badge */}
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                    style={{ color: meta.color, backgroundColor: meta.light, border: `1px solid ${meta.border}` }}>
                    {meta.label[lang]}
                  </span>
                </div>

                {/* Benefits preview — always visible */}
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                  💰 {scheme.benefits[lang]}
                </p>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mb-3 space-y-2.5 border-t border-gray-100 pt-3">
                    {/* Full benefits */}
                    <div className="rounded-xl p-3 flex gap-2.5" style={{ backgroundColor: meta.light, border: `1px solid ${meta.border}` }}>
                      <Gift size={15} strokeWidth={1.5} style={{ color: meta.color }} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: meta.color }}>
                          {t.benefits}
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">{scheme.benefits[lang]}</p>
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="rounded-xl p-3 flex gap-2.5 bg-amber-50 border border-amber-100">
                      <CheckCircle size={15} strokeWidth={1.5} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                          {t.eligibility}
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">{scheme.eligibility[lang]}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action row */}
                <div className="flex items-center gap-2">
                  {/* Toggle eligibility */}
                  <button
                    onClick={() => toggleExpand(scheme.id)}
                    className="active-press flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      color: isOpen ? '#0F3D27' : '#52786A',
                      borderColor: isOpen ? '#0F3D27' : '#D4EBD9',
                      backgroundColor: isOpen ? '#F2F9F5' : 'white',
                    }}
                  >
                    {isOpen ? <ChevronUp size={12} strokeWidth={2.5} /> : <ChevronDown size={12} strokeWidth={2.5} />}
                    {isOpen
                      ? (lang === 'en' ? 'Hide Details' : 'छुपाएं')
                      : (lang === 'en' ? 'Eligibility' : 'पात्रता')}
                  </button>

                  {/* Apply CTA */}
                  <button
                    onClick={() => alert(`${t.applyNow}: ${scheme.name[lang]}`)}
                    className="active-press flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA6C0A)', boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}
                  >
                    <ExternalLink size={12} strokeWidth={2.5} />
                    {t.applyNow}
                  </button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">📭</div>
            <p className="text-sm font-semibold text-gray-500">{t.noResults}</p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-sm text-coral font-bold active-press">
                {lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
