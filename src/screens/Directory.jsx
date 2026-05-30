import React, { useState, useMemo } from 'react';
import { Phone, MessageCircle, ShieldCheck, Settings, Check, X, ChevronRight, Search, Users } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';
const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

const SectionLabel = ({ en, hi, lang }) => (
  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1B5E3B] mb-2 select-none">
    {lang === 'en' ? en : hi}
  </p>
);

export default function Directory({ lang }) {
  const t = translations[lang];
  const [isAdminMode, setIsAdminMode]     = useState(false);
  const [pendingQueue, setPendingQueue]   = useState(db.getPendingProviders());
  const [expandedId, setExpandedId]       = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeFilter, setActiveFilter]   = useState('all');

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const filterChips = [
    { id: 'all',      label: lang === 'en' ? 'All'       : 'सभी' },
    { id: 'panchayat',label: lang === 'en' ? 'Panchayat' : 'पंचायत' },
    { id: 'official', label: lang === 'en' ? 'Officials' : 'अधिकारी' },
  ];

  const leadersList     = db.getLeaders();
  const panchayatMembers = leadersList.filter(l => l.type !== 'official');
  const villageOfficials = leadersList.filter(l => l.type === 'official');

  const filteredPanchayat = useMemo(() => {
    if (!searchQuery.trim()) return panchayatMembers;
    const q = searchQuery.toLowerCase();
    return panchayatMembers.filter(l =>
      l.name[lang].toLowerCase().includes(q) ||
      l.role[lang].toLowerCase().includes(q) ||
      l.ward[lang].toLowerCase().includes(q)
    );
  }, [panchayatMembers, searchQuery, lang]);

  const filteredOfficials = useMemo(() => {
    if (!searchQuery.trim()) return villageOfficials;
    const q = searchQuery.toLowerCase();
    return villageOfficials.filter(l =>
      l.name[lang].toLowerCase().includes(q) ||
      l.role[lang].toLowerCase().includes(q) ||
      l.ward[lang].toLowerCase().includes(q)
    );
  }, [villageOfficials, searchQuery, lang]);

  const showPanchayat = activeFilter === 'all' || activeFilter === 'panchayat';
  const showOfficials = activeFilter === 'all' || activeFilter === 'official';

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

  const MemberPhoto = ({ leader, size = 44 }) => {
    if (leader.image) {
      return (
        <img
          src={leader.image}
          alt={leader.name[lang]}
          className="rounded-xl object-cover shrink-0"
          style={{ width: size, height: size }}
          loading="lazy"
        />
      );
    }
    return (
      <div
        className="rounded-xl bg-[#FFF3E0] flex items-center justify-center text-xl shrink-0"
        style={{ width: size, height: size }}
      >
        {getRoleIcon(leader.role)}
      </div>
    );
  };

  const GroupedCard = ({ items, accentColor = 'coral' }) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {items.map((leader, i) => {
        const isExpanded = expandedId === leader.id;
        return (
          <React.Fragment key={leader.id}>
            <div
              className="active-press cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : leader.id)}
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <MemberPhoto leader={leader} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0F3D27] truncate">{leader.name[lang]}</p>
                  <p className={`text-[10px] font-semibold truncate mt-0.5 ${accentColor === 'sky' ? 'text-sky-blue' : 'text-[#F97316]'}`}>
                    {leader.role[lang]}
                  </p>
                  <p className="text-[10px] text-[#92B4A4] font-medium truncate mt-0.5">📍 {leader.ward[lang]}</p>
                </div>
                <ChevronRight
                  size={16} strokeWidth={1.5}
                  className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-[#F97316]' : 'text-[#92B4A4]'}`}
                />
              </div>

              {isExpanded && (
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCall(leader.name[lang], leader.phone); }}
                    className={`active-press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-white text-xs font-bold transition-colors ${
                      accentColor === 'sky' ? 'bg-sky-blue hover:bg-sky-600' : 'bg-coral hover:bg-coral-dark'
                    }`}
                  >
                    <Phone size={13} strokeWidth={2} />
                    {t.call.toUpperCase()}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleWhatsApp(leader.name[lang], leader.whatsapp); }}
                    className="active-press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold transition-colors"
                  >
                    <MessageCircle size={13} strokeWidth={1.5} />
                    WhatsApp
                  </button>
                </div>
              )}
            </div>

            {i < items.length - 1 && <div className="h-px bg-gray-100 mx-4" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const totalMembers = leadersList.length;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#F2F9F5]">

      {/* ── Green Hero ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ background: G }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(27,94,59,0.45)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-8 left-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'rgba(110,231,183,0.07)', transform: 'translate(-20%,0)' }} />

        <div className="relative z-10" style={{ padding: '20px 20px 8px' }}>
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-green-300 text-xs font-semibold mb-1">
                👥 {lang === 'en' ? 'Village Directory' : 'ग्राम निर्देशिका'}
              </p>
              <h2 className="text-[22px] font-black text-white leading-tight">
                {isAdminMode ? (lang === 'en' ? 'Provider Approvals' : 'स्वीकृतियां') : (lang === 'en' ? 'Your Representatives' : 'आपके प्रतिनिधि')}
              </h2>
              <p className="text-white/50 text-xs font-medium mt-1">
                {isAdminMode
                  ? (lang === 'en' ? 'Approve or reject pending listings' : 'लंबित सूचियों पर कार्रवाई करें')
                  : `${totalMembers} ${lang === 'en' ? 'members in your village' : 'सदस्य आपके गांव में'}`}
              </p>
            </div>
            <button
              onClick={() => { setIsAdminMode(!isAdminMode); setPendingQueue(db.getPendingProviders()); setExpandedId(null); setSearchQuery(''); }}
              className={`active-press shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all mt-1 ${
                isAdminMode
                  ? 'bg-amber-400 border-amber-300 text-white'
                  : 'bg-white/15 border-white/25 text-white'
              }`}
            >
              <Settings size={12} strokeWidth={1.5} className={isAdminMode ? 'animate-spin' : ''} />
              <span>{isAdminMode ? (lang === 'en' ? 'Exit' : 'बंद') : (lang === 'en' ? 'Admin' : 'एडमिन')}</span>
            </button>
          </div>

          {/* Search inside hero (public mode only) */}
          {!isAdminMode && (
            <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-full px-4 py-3 flex items-center gap-3 mt-4 mb-2">
              <Search size={15} className="text-white/50 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search by name or role…' : 'नाम या पद से खोजें…'}
                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-white/50 active-press">
                  <X size={14} strokeWidth={2} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="relative z-10"><Wave /></div>
      </div>

      {/* Filter chips (public mode only) */}
      {!isAdminMode && (
        <div className="px-4 overflow-x-auto no-scrollbar -mt-1">
          <div className="flex gap-2 py-3">
            {filterChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`active-press shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  activeFilter === chip.id
                    ? 'bg-[#0F3D27] text-white border-[#0F3D27] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {chip.id === 'all' ? '🌟' : chip.id === 'panchayat' ? '🏛️' : '📋'} {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Admin Approval Queue */}
      {isAdminMode ? (
        <div className="px-4 space-y-3 flex-1 pb-8">
          {pendingQueue.length > 0 ? (
            <>
              <SectionLabel en="PENDING APPROVALS" hi="लंबित स्वीकृतियां" lang={lang} />
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E8D5C0', boxShadow: '0 1px 4px rgba(45,31,14,0.06)' }}>
                {pendingQueue.map((provider, i) => (
                  <React.Fragment key={provider.id}>
                    <div className="p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shrink-0">
                          {categoryIcons[provider.category] || '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-[#0F3D27] truncate">{provider.name[lang]}</h3>
                            <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full shrink-0">
                              {lang === 'en' ? 'PENDING' : 'लंबित'}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-wide mt-0.5">🛠️ {provider.category}</p>
                          <p className="text-[10px] text-[#52786A] truncate mt-0.5">📞 {provider.phone}</p>
                        </div>
                      </div>
                      {provider.workImage && (
                        <div className="rounded-xl overflow-hidden border border-[#E8D5C0] aspect-video max-h-36">
                          <img src={provider.workImage} alt="Audit" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(provider.id, provider.name[lang])}
                          className="active-press flex-1 py-2.5 bg-emerald-500 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                          <Check size={13} strokeWidth={2} />
                          {lang === 'en' ? 'Approve' : 'स्वीकार'}
                        </button>
                        <button onClick={() => handleReject(provider.id, provider.name[lang])}
                          className="active-press flex-1 py-2.5 bg-red-50 border border-red-200 text-red-500 rounded-full font-bold text-xs flex items-center justify-center gap-1.5">
                          <X size={13} strokeWidth={2} />
                          {lang === 'en' ? 'Reject' : 'अस्वीकार'}
                        </button>
                      </div>
                    </div>
                    {i < pendingQueue.length - 1 && <div className="h-px bg-[#E8D5C0]" />}
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-[#92B4A4] flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white border border-[#E8D5C0] flex items-center justify-center">
                <ShieldCheck size={24} className="text-[#E8D5C0]" />
              </div>
              <p className="text-sm font-semibold">
                {lang === 'en' ? 'All listings processed.' : 'सभी लंबित सूचियों पर कार्रवाई हो चुकी है।'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Public Directory */
        <div className="px-4 space-y-5 pb-8">

          {showPanchayat && filteredPanchayat.length > 0 && (
            <div className="space-y-2">
              <SectionLabel
                en={`ELECTED PANCHAYAT MEMBERS · ${filteredPanchayat.length} MEMBERS`}
                hi={`निर्वाचित पंचायत सदस्य · ${filteredPanchayat.length} सदस्य`}
                lang={lang}
              />
              <GroupedCard items={filteredPanchayat} accentColor="coral" />
            </div>
          )}

          {showOfficials && filteredOfficials.length > 0 && (
            <div className="space-y-2">
              <SectionLabel
                en="VILLAGE REVENUE OFFICIALS"
                hi="ग्राम राजस्व अधिकारी"
                lang={lang}
              />
              <GroupedCard items={filteredOfficials} accentColor="sky" />
            </div>
          )}

          {/* Empty state */}
          {((showPanchayat && filteredPanchayat.length === 0) && (showOfficials && filteredOfficials.length === 0)) && (
            <div className="text-center py-14 text-[#92B4A4] text-sm flex flex-col items-center gap-2">
              <span className="text-3xl">📭</span>
              <span>{lang === 'en' ? 'No results found.' : 'कोई परिणाम नहीं मिला।'}</span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-sm text-[#F97316] font-semibold mt-1 active-press">
                  {lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
