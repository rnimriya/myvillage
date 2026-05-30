import React from 'react';
import { Phone, Clock, Bell, MapPin, User } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';
const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

const TYPE_META = {
  anganwadi: { color: '#db2777', light: '#fdf2f8', border: '#fbcfe8', emoji: '🏫', label: { en: 'Anganwadi', hi: 'आंगनवाड़ी' } },
  primary:   { color: '#2563eb', light: '#eff6ff', border: '#bfdbfe', emoji: '📚', label: { en: 'Primary',   hi: 'प्राथमिक'  } },
  high:      { color: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe', emoji: '🎓', label: { en: 'High School',hi: 'हाई स्कूल' } },
  library:   { color: '#d97706', light: '#fffbeb', border: '#fde68a', emoji: '📖', label: { en: 'Library',   hi: 'पुस्तकालय' } },
};

export default function Education({ lang }) {
  const t = translations[lang];
  const schoolsList = db.getSchools();

  const handleCall = (name, phoneNum) => {
    alert(`${t.callSuccess} ${name} (${phoneNum})`);
    window.location.href = `tel:${phoneNum}`;
  };

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
            🎓 {lang === 'en' ? 'Schools & Education' : 'स्कूल और शिक्षा'}
          </p>
          <h2 className="text-[22px] font-black text-white leading-tight">
            {lang === 'en' ? 'Local Institutions' : 'स्थानीय संस्थाएं'}
          </h2>
          <p className="text-white/50 text-xs font-medium mt-1 mb-4">
            {schoolsList.length} {lang === 'en' ? 'institutions in your village' : 'संस्थाएं आपके गांव में'}
          </p>
        </div>
        <div className="relative z-10"><Wave /></div>
      </div>

      {/* ── School Cards ── */}
      <div className="px-4 pt-3 pb-8 flex flex-col gap-4">
        {schoolsList.length > 0 ? schoolsList.map((school) => {
          const meta = TYPE_META[school.type] || { color: '#6b7280', light: '#f9fafb', border: '#e5e7eb', emoji: '🏫', label: { en: school.type, hi: school.type } };
          return (
            <div key={school.id} className="bg-white rounded-2xl shadow-sm overflow-hidden"
              style={{ borderLeft: `4px solid ${meta.color}` }}>
              <div className="p-4 flex flex-col gap-3">

                {/* Header: emoji icon + name + badge */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: meta.light, border: `1px solid ${meta.border}` }}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1.5"
                      style={{ color: meta.color, backgroundColor: meta.light, border: `1px solid ${meta.border}` }}>
                      {meta.label[lang]}
                    </span>
                    <h3 className="text-[14px] font-bold text-[#0D2B1A] leading-snug">{school.name[lang]}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={10} strokeWidth={1.5} className="text-[#92B4A4] shrink-0" />
                      <span className="text-[11px] text-[#52786A] font-medium">{school.location[lang]}</span>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <Clock size={14} strokeWidth={1.5} className="text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">{t.operatingHours}</p>
                    <p className="text-xs text-gray-800 font-semibold">{school.hours[lang]}</p>
                  </div>
                </div>

                {/* Principal row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                      <User size={14} strokeWidth={1.5} className="text-sky-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                        {school.type === 'library' ? (lang === 'en' ? 'Librarian' : 'पुस्तकालयाध्यक्ष') : t.headmaster}
                      </p>
                      <p className="text-xs text-gray-900 font-semibold truncate">{school.principal[lang]}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCall(school.principal[lang], school.phone)}
                    className="active-press flex items-center gap-1.5 px-3 py-2 rounded-xl text-white font-bold text-xs shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA6C0A)' }}
                  >
                    <Phone size={11} strokeWidth={2} />
                    {t.call.toUpperCase()}
                  </button>
                </div>

                {/* Announcement */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-100 shrink-0 self-start">
                    <Bell size={12} strokeWidth={1.5} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">{t.announcements}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{school.announcement[lang]}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">📭</div>
            <p className="text-sm font-semibold text-gray-500">
              {lang === 'en' ? 'No schools listed yet.' : 'कोई स्कूल अभी सूचीबद्ध नहीं है।'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
