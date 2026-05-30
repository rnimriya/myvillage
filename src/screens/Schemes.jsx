import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, FileText, CheckCircle, Gift, Sparkles, X } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

export default function Schemes({ lang }) {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedScheme, setExpandedScheme] = useState(null);

  const categories = useMemo(() => [
    { id: 'all',        label: lang === 'en' ? 'All'       : 'सभी',     icon: '🌟' },
    { id: 'agriculture', label: lang === 'en' ? 'Farming'  : 'कृषि',    icon: '🌾' },
    { id: 'housing',    label: lang === 'en' ? 'Housing'   : 'आवास',    icon: '🏠' },
    { id: 'healthcare', label: lang === 'en' ? 'Health'    : 'स्वास्थ्य', icon: '🏥' },
    { id: 'education',  label: lang === 'en' ? 'Education' : 'शिक्षा',  icon: '🎓' },
  ], [lang]);

  const categoryColors = {
    agriculture: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    housing:     'text-amber-600  bg-amber-50  border-amber-200',
    healthcare:  'text-rose-600   bg-rose-50   border-rose-200',
    education:   'text-sky-600    bg-sky-50    border-sky-200',
  };

  const schemesList = db.getSchemes();

  const filteredSchemes = useMemo(() => {
    return schemesList.filter((scheme) => {
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        scheme.name[lang].toLowerCase().includes(q) ||
        scheme.benefits[lang].toLowerCase().includes(q) ||
        scheme.eligibility[lang].toLowerCase().includes(q) ||
        scheme.department[lang].toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, lang, schemesList]);

  const toggleExpand = (id) => setExpandedScheme(expandedScheme === id ? null : id);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-[#FAF7F2] flex flex-col pt-4">

      {/* Header */}
      <div className="px-4 pb-3 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
          <Sparkles size={13} strokeWidth={2} className="text-coral" />
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.schemeSectionTitle}</span>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search size={15} strokeWidth={1.5} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchSchemes}
            className="w-full bg-white border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-sm rounded-2xl pl-10 pr-10 py-3 outline-none transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Category selector */}
      <div className="px-4 mb-4">
        <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
          {lang === 'en' ? 'Category' : 'वर्ग'}
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-input w-full text-sm"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Count indicator */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="px-4 mb-3">
          <p className="text-sm text-gray-400 font-medium">
            {filteredSchemes.length} {lang === 'en' ? 'scheme(s) found' : 'योजनाएं मिलीं'}
          </p>
        </div>
      )}

      {/* Schemes List */}
      <div className="px-4 flex-1 space-y-3">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => {
            const isExpanded = expandedScheme === scheme.id;
            const catColor = categoryColors[scheme.category] || 'text-gray-500 bg-gray-50 border-gray-200';

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Card header */}
                <div
                  onClick={() => toggleExpand(scheme.id)}
                  className="p-4 flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-sm font-bold text-sky-600 tracking-wider uppercase bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                        🏢 {scheme.department[lang]}
                      </span>
                      <span className={`text-sm font-bold uppercase tracking-wider px-2 py-1 rounded-lg border ${catColor}`}>
                        {categories.find(c => c.id === scheme.category)?.icon} {scheme.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {scheme.name[lang]}
                    </h3>
                    {!isExpanded && (
                      <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {scheme.benefits[lang]}
                      </p>
                    )}
                  </div>
                  <div className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5 transition-colors ${isExpanded ? 'bg-coral/10 text-coral' : 'bg-gray-100 text-gray-400'}`}>
                    {isExpanded ? <ChevronUp size={14} strokeWidth={2} /> : <ChevronDown size={14} strokeWidth={2} />}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">

                    <div className="flex gap-3 items-start p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Gift size={14} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-emerald-700 tracking-wider uppercase mb-1">
                          {t.benefits}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{scheme.benefits[lang]}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <CheckCircle size={14} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-amber-700 tracking-wider uppercase mb-1">
                          {t.eligibility}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{scheme.eligibility[lang]}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); alert(`${t.applyNow}: ${scheme.name[lang]}`); }}
                      className="form-button primary w-full flex items-center justify-center gap-2 text-sm"
                    >
                      <FileText size={13} strokeWidth={2} />
                      {t.applyNow}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-14 text-gray-400 text-sm flex flex-col items-center gap-2">
            <span className="text-3xl">📭</span>
            <span>{t.noResults}</span>
            {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-coral font-semibold mt-1 active-press"
              >
                {lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
