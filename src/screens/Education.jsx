import React from 'react';
import { GraduationCap, Phone, Clock, Bell, MapPin, User } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

export default function Education({ lang }) {
  const t = translations[lang];

  const typeLabels = {
    anganwadi: lang === 'en' ? 'Anganwadi' : 'आंगनवाड़ी',
    primary:   lang === 'en' ? 'Primary'   : 'प्राथमिक',
    high:      lang === 'en' ? 'High School': 'हाई स्कूल',
    library:   lang === 'en' ? 'Library'   : 'पुस्तकालय'
  };

  const typeBadgeColors = {
    anganwadi: 'text-pink-600 bg-pink-50 border-pink-200',
    primary:   'text-blue-600 bg-blue-50 border-blue-200',
    high:      'text-purple-600 bg-purple-50 border-purple-200',
    library:   'text-amber-600 bg-amber-50 border-amber-200',
  };

  const schoolsList = db.getSchools();

  const handleCall = (name, phoneNum) => {
    alert(`${t.callSuccess} ${name} (${phoneNum})`);
    window.location.href = `tel:${phoneNum}`;
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-[#F4F6F8] flex flex-col pt-4">

      {/* Header */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
          <GraduationCap size={13} strokeWidth={2} className="text-coral" />
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.educationSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">{t.educationSubtitle}</p>
      </div>

      {/* Schools List */}
      <div className="px-4 space-y-4">
        {schoolsList.length > 0 ? (
          schoolsList.map((school) => (
            <div key={school.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-all">

              {/* Institution Header */}
              <div>
                <span className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg border mb-2 inline-block ${typeBadgeColors[school.type] || 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                  🏫 {typeLabels[school.type] || school.type}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 leading-snug">{school.name[lang]}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5 font-medium">
                  <MapPin size={11} strokeWidth={1.5} />
                  <span>{school.location[lang]}</span>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <Clock size={15} strokeWidth={1.5} className="text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">{t.operatingHours}</p>
                  <p className="text-gray-800 font-semibold">{school.hours[lang]}</p>
                </div>
              </div>

              {/* Headmaster */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                    <User size={15} strokeWidth={1.5} />
                  </div>
                  <div className="text-xs min-w-0">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                      {school.type === 'library' ? (lang === 'en' ? 'Librarian' : 'पुस्तकालयाध्यक्ष') : t.headmaster}
                    </p>
                    <p className="text-gray-900 font-semibold truncate">{school.principal[lang]}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCall(school.principal[lang], school.phone)}
                  className="active-press flex items-center gap-1 px-3 py-2 rounded-xl bg-coral hover:bg-coral-dark text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Phone size={11} strokeWidth={2} />
                  {t.call.toUpperCase()}
                </button>
              </div>

              {/* Announcement */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shrink-0 self-start">
                  <Bell size={13} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">{t.announcements}</p>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{school.announcement[lang]}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            📭 {lang === 'en' ? 'No schools listed yet.' : 'कोई स्कूल अभी सूचीबद्ध नहीं है।'}
          </div>
        )}
      </div>
    </div>
  );
}
