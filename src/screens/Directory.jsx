import React, { useState } from 'react';
import { Phone, MessageCircle, ShieldCheck, MapPin, Settings, Check, X } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

function LeaderCard({ leader, lang, t, icon, accentColor = 'coral', onCall, onWhatsApp }) {
  const callBg   = accentColor === 'sky' ? 'bg-sky-blue hover:bg-sky-600 shadow-sky-blue/20' : 'bg-coral hover:bg-coral-dark shadow-coral/25';
  const roleCls  = accentColor === 'sky' ? 'text-sky-blue' : 'text-coral';
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-4 hover:shadow-md transition-all">
      <div className="flex gap-4 items-center">
        <div className="w-14 h-14 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center text-3xl shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{leader.name[lang]}</h3>
          <p className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${roleCls}`}>{leader.role[lang]}</p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1 font-medium">
            <MapPin size={10} strokeWidth={1.5} />
            <span className="truncate">{leader.ward[lang]}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onCall(leader.name[lang], leader.phone)}
          className={`active-press flex-1 py-2.5 px-4 ${callBg} text-white rounded-xl font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors`}
        >
          <Phone size={13} strokeWidth={2} />
          {t.call.toUpperCase()}
        </button>
        <button
          onClick={() => onWhatsApp(leader.name[lang], leader.whatsapp)}
          className="active-press flex-1 py-2.5 px-4 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle size={13} strokeWidth={2} />
          {t.whatsapp.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

export default function Directory({ lang }) {
  const t = translations[lang];
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [pendingQueue, setPendingQueue] = useState(db.getPendingProviders());

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const leadersList = db.getLeaders();
  const panchayatMembers = leadersList.filter(l => l.type !== 'official');
  const villageOfficials = leadersList.filter(l => l.type === 'official');

  const getRoleIcon = (role) => {
    const r = role?.en?.toLowerCase() || '';
    if (r.includes('sarpanch'))   return '🏛️';
    if (r.includes('chowkidar')) return '🔔';
    if (r.includes('patwari'))   return '📋';
    if (r.includes('numberdar')) return '🏠';
    return '👤';
  };

  const handleCall = (name, phoneNum) => {
    alert(`${t.callSuccess} ${name} (${phoneNum})`);
    window.location.href = `tel:${phoneNum}`;
  };

  const handleWhatsApp = (name, num) => {
    alert(`${t.whatsappSuccess} ${name} (${num})`);
    window.location.href = `https://wa.me/${num}?text=Hello%20${encodeURIComponent(name)},%20I%20have%20a%20query%20regarding...`;
  };

  const handleApprove = (id, name) => {
    db.approveProvider(id);
    alert(lang === 'en' ? `Listing approved: ${name}` : `सूची स्वीकृत: ${name}`);
    setPendingQueue(db.getPendingProviders());
  };

  const handleReject = (id, name) => {
    if (confirm(lang === 'en' ? `Reject listing for ${name}?` : `${name} के लिए लिस्टिंग अस्वीकार करें?`)) {
      db.rejectProvider(id);
      setPendingQueue(db.getPendingProviders());
    }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-[#F4F6F8] flex flex-col pt-4">

      {/* Section Header */}
      <div className="px-4 pb-3 flex flex-col gap-3">
        <div className="flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
            <ShieldCheck size={13} strokeWidth={2} className="text-coral" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              {isAdminMode ? (lang === 'en' ? 'Panchayat Approvals' : 'पंचायत स्वीकृतियां') : t.directorySectionTitle}
            </span>
          </div>

          <button
            onClick={() => { setIsAdminMode(!isAdminMode); setPendingQueue(db.getPendingProviders()); }}
            className={`active-press flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold tracking-wider transition-all uppercase ${
              isAdminMode
                ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:border-coral/40 shadow-sm'
            }`}
          >
            <Settings size={12} strokeWidth={1.5} className={isAdminMode ? 'animate-spin' : ''} />
            <span>{isAdminMode ? (lang === 'en' ? 'Exit Admin' : 'एडमिन बंद') : (lang === 'en' ? 'Admin' : 'एडमिन')}</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 leading-normal font-medium">
          {isAdminMode
            ? (lang === 'en'
              ? 'Panchayat Leader Terminal: Approve or reject new service provider registrations below.'
              : 'पंचायत लीडर टर्मिनल: नीचे नए सेवा प्रदाताओं के पंजीकरण को स्वीकृत या अस्वीकृत करें।')
            : t.leadersSubtitle}
        </p>
      </div>

      {/* Admin Approval Queue */}
      {isAdminMode ? (
        <div className="px-4 space-y-4 flex-1">
          {pendingQueue.length > 0 ? (
            pendingQueue.map((provider) => (
              <div key={provider.id} className="bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full border border-amber-200 bg-amber-50 flex items-center justify-center text-2xl shrink-0">
                    {categoryIcons[provider.category] || '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[8px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block mb-1">
                      Awaiting Approval
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{provider.name[lang]}</h3>
                    <p className="text-[10px] font-bold text-sky-blue uppercase tracking-wide">🛠️ {provider.category}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">📍 {provider.availability[lang]} • {provider.phone}</p>
                  </div>
                </div>

                {provider.workImage && (
                  <div className="border-t border-gray-100 pt-2.5">
                    <p className="text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-1.5">
                      ⚠️ {lang === 'en' ? 'Audit Work Photo:' : 'कार्य फोटो ऑडिट:'}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video max-h-40">
                      <img src={provider.workImage} alt="Audit" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(provider.id, provider.name[lang])}
                    className="active-press flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check size={14} strokeWidth={2} />
                    {lang === 'en' ? 'Approve' : 'स्वीकार'}
                  </button>
                  <button
                    onClick={() => handleReject(provider.id, provider.name[lang])}
                    className="active-press flex-1 py-2.5 bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <X size={14} strokeWidth={2} />
                    {lang === 'en' ? 'Reject' : 'अस्वीकार'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center">
                <ShieldCheck size={24} className="text-gray-300" />
              </div>
              <p className="text-sm">{lang === 'en' ? 'All pending listings processed.' : 'सभी लंबित सूचियों पर कार्रवाई हो चुकी है।'}</p>
            </div>
          )}
        </div>
      ) : (
        /* Public Directory */
        <div className="px-4 space-y-5">

          {/* Panchayat Members */}
          {panchayatMembers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 select-none">
                <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {lang === 'en' ? 'Elected Panchayat Members' : 'निर्वाचित पंचायत सदस्य'}
                </span>
              </div>
              {panchayatMembers.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} lang={lang} t={t}
                  icon={getRoleIcon(leader.role)}
                  onCall={handleCall} onWhatsApp={handleWhatsApp} />
              ))}
            </div>
          )}

          {/* Village Officials */}
          {villageOfficials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 select-none">
                <span className="w-1 h-4 rounded-full bg-sky-blue shrink-0" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {lang === 'en' ? 'Village Revenue Officials' : 'ग्राम राजस्व अधिकारी'}
                </span>
              </div>
              {villageOfficials.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} lang={lang} t={t}
                  icon={getRoleIcon(leader.role)}
                  accentColor="sky"
                  onCall={handleCall} onWhatsApp={handleWhatsApp} />
              ))}
            </div>
          )}

          {leadersList.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              📭 {lang === 'en' ? 'No representatives listed.' : 'कोई प्रतिनिधि सूचीबद्ध नहीं हैं।'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
