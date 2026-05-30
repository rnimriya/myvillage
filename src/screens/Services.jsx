import React, { useState, useMemo } from 'react';
import { Phone, Star, Wrench, UserPlus, ChevronDown, ChevronLeft, MessageCircle, Search, X, MapPin, Clock, BadgeCheck } from 'lucide-react';
import { db } from '../data/db';
import { translations } from '../data/translations';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';
const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

export default function Services({ lang, onNavigateToPortal, session }) {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState('doctors');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [revRating, setRevRating]           = useState(5);
  const [revComment, setRevComment]         = useState('');
  const [revError, setRevError]             = useState('');
  const [revSuccess, setRevSuccess]         = useState(false);

  const categories = useMemo(() => [
    { id: 'doctors',      label: lang === 'en' ? 'Doctors'       : 'डॉक्टर',         icon: '🩺' },
    { id: 'electricians', label: lang === 'en' ? 'Electrician'   : 'इलेक्ट्रीशियन', icon: '⚡' },
    { id: 'plumbers',     label: lang === 'en' ? 'Plumber'       : 'प्लंबर',         icon: '🔧' },
    { id: 'mechanics',    label: lang === 'en' ? 'Mechanic'      : 'मैकेनिक',        icon: '🚜' },
    { id: 'barbers',      label: lang === 'en' ? 'Hair Salon'    : 'नाई/सैलून',      icon: '💈' },
    { id: 'internet',     label: lang === 'en' ? 'Internet'      : 'इंटरनेट',        icon: '🌐' },
    { id: 'parlor',       label: lang === 'en' ? 'Beauty Parlor' : 'ब्यूटी पार्लर',  icon: '💇‍♀️' },
    { id: 'photographer', label: lang === 'en' ? 'Photographer'  : 'फोटोग्राफर',     icon: '📷' },
    { id: 'csc',          label: lang === 'en' ? 'CSC Center'    : 'सीएससी केंद्र',  icon: '🖥️' },
    { id: 'tuition',      label: lang === 'en' ? 'Tuition'       : 'ट्यूशन',         icon: '📚' },
    { id: 'blacksmith',   label: lang === 'en' ? 'Blacksmith'    : 'लोहार',          icon: '⚒️' },
    { id: 'goldsmith',    label: lang === 'en' ? 'Goldsmith'     : 'सुनार',          icon: '💍' },
    { id: 'sports',       label: lang === 'en' ? 'Sports Coach'  : 'खेल कोच',        icon: '🏆' },
    { id: 'carpenter',    label: lang === 'en' ? 'Carpenter'     : 'बढ़ई',           icon: '🪚' },
    { id: 'painter',      label: lang === 'en' ? 'Painter'       : 'पेंटर',          icon: '🎨' },
  ], [lang]);

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const approvedList     = useMemo(() => db.getApprovedProviders(), [refreshTrigger]);
  const filteredServices = useMemo(() => {
    const byCat = approvedList.filter(s => s.category === activeCategory);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return byCat;
    return byCat.filter(s =>
      s.name[lang].toLowerCase().includes(q) ||
      s.availability[lang].toLowerCase().includes(q) ||
      s.experience[lang].toLowerCase().includes(q)
    );
  }, [activeCategory, approvedList, searchQuery, lang]);

  const getWorkImages = (p) => {
    if (p.workImages?.length > 0) return p.workImages;
    if (p.workImage) return [p.workImage];
    return [];
  };

  const handleCall = (name, phone) => {
    alert(`${t.callSuccess} ${name} (${phone})`);
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleOpenProfile = (provider) => {
    setSelectedProvider(provider);
    setRevError(''); setRevSuccess(false); setRevComment(''); setRevRating(5);
  };

  const handleReviewSubmit = () => {
    if (!session) return;
    setRevError(''); setRevSuccess(false);
    if (!revComment.trim()) {
      setRevError(lang === 'en' ? 'Please write a review comment.' : 'कृपया समीक्षा टिप्पणी लिखें।');
      return;
    }
    const sensitiveWords = ['abuse','fraud','scam','fake','hate','vulgar','गाली','धोखा','फर्जी','बकवास','चोर','कमीना','kamina','chor'];
    if (sensitiveWords.some(w => revComment.toLowerCase().includes(w))) {
      setRevError(lang === 'en' ? 'Review contains inappropriate words.' : 'समीक्षा में अनुचित शब्द हैं।');
      return;
    }
    const authorName = session.name?.[lang] || session.name?.en || 'User';
    const updated = db.addProviderReview(selectedProvider.id, { author: authorName, rating: revRating, comment: revComment.trim() });
    if (updated) {
      setRevSuccess(true); setRevComment(''); setRevRating(5);
      setSelectedProvider(updated); setRefreshTrigger(p => p + 1);
      setTimeout(() => setRevSuccess(false), 3000);
    } else {
      setRevError(lang === 'en' ? 'Failed to submit review.' : 'समीक्षा भेजने में असमर्थ।');
    }
  };

  const approvedCount = db.getApprovedProviders().length;

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative bg-[#F2F9F5]">

      {/* ── Scrollable List ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 flex flex-col">

        {/* ── Green Hero ── */}
        <div className="relative shrink-0" style={{ background: G }}>
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'rgba(27,94,59,0.45)', transform: 'translate(35%,-35%)' }} />
          <div className="absolute bottom-8 left-0 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'rgba(110,231,183,0.07)', transform: 'translate(-25%,0)' }} />

          <div className="relative z-10 px-5 pt-5 pb-2">
            <p className="text-green-300 text-xs font-semibold mb-1">
              🔧 {lang === 'en' ? 'Local Services' : 'स्थानीय सेवाएं'}
            </p>
            <h2 className="text-[22px] font-black text-white leading-tight">
              {lang === 'en' ? 'Neighbourhood Services' : 'पड़ोस की सेवाएं'}
            </h2>
            <p className="text-white/50 text-xs font-medium mt-1 mb-4">
              {approvedCount} {lang === 'en' ? 'verified providers in your village' : 'सत्यापित सेवा प्रदाता'}
            </p>

            {/* Search inside hero */}
            <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 mb-2">
              <Search size={15} className="text-white/50 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search by name or location...' : 'नाम या स्थान से खोजें...'}
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

        {/* Register banner */}
        <div className="px-4 mt-3 mb-4">
          <div
            onClick={onNavigateToPortal}
            className="active-press cursor-pointer bg-[#0F3D27] rounded-2xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex-1">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                {lang === 'en' ? 'Are you a local provider?' : 'क्या आप स्थानीय सेवा प्रदाता हैं?'}
              </h4>
              <p className="text-[11px] text-white/60 font-medium mt-1 leading-normal">
                {lang === 'en' ? 'Register to list your profile for the village.' : 'पूरे गांव में अपनी सेवाएं दिखाने के लिए रजिस्टर करें।'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0">
              <UserPlus size={17} strokeWidth={1.5} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Category icons horizontal scroll */}
        <div className="px-4 mb-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                className="active-press flex flex-col items-center gap-1.5 shrink-0"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 transition-all ${
                  activeCategory === cat.id
                    ? 'border-[#F97316] bg-orange-50 shadow-orange-200'
                    : 'border-gray-200 bg-white'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-bold truncate max-w-[56px] ${activeCategory === cat.id ? 'text-[#F97316]' : 'text-gray-500'}`}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={15} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search by name or location...' : 'नाम या स्थान से खोजें...'}
              className="w-full bg-white border-2 border-gray-200 focus:border-orange-400 rounded-2xl pl-10 pr-10 py-3 text-sm text-[#0F3D27] placeholder-gray-400 outline-none transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3.5 flex items-center text-gray-400">
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Provider Cards */}
        <div className="px-4 flex-1 space-y-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((provider) => {
              const images = getWorkImages(provider);
              return (
                <div key={provider.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Work image strip */}
                  {images.length > 0 && (
                    <div className="relative h-32 bg-gray-100 overflow-hidden">
                      <img src={images[0]} alt="Work" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Provider info row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden shrink-0 bg-orange-100 flex items-center justify-center">
                        {provider.profilePhoto
                          ? <img src={provider.profilePhoto} alt="" className="w-full h-full object-cover" />
                          : <span className="text-xl">{categoryIcons[provider.category] || '👤'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#0F3D27] truncate">{provider.name[lang]}</h3>
                          {provider.kycStatus === 'approved' && (
                            <BadgeCheck size={14} strokeWidth={2} className="text-[#F97316] shrink-0" />
                          )}
                        </div>
                        {/* Stars */}
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} strokeWidth={0}
                              className={i < Math.round(provider.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} />
                          ))}
                          <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                            {provider.rating.toFixed(1)} ({(provider.reviews || []).length})
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">
                          {provider.experience[lang]}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                      📍 {provider.availability[lang]}
                    </p>

                    {session ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWhatsApp(provider.phone)}
                          className="active-press flex-1 py-3 rounded-2xl border-2 border-[#0F3D27] text-[#0F3D27] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <MessageCircle size={13} strokeWidth={1.5} />
                          {lang === 'en' ? 'Message' : 'संदेश'}
                        </button>
                        <button
                          onClick={() => handleOpenProfile(provider)}
                          className="active-press flex-1 py-3 rounded-2xl bg-[#F97316] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#EA6C0A] transition-colors shadow-sm"
                        >
                          <Phone size={13} strokeWidth={2} />
                          {lang === 'en' ? 'Book Now' : 'अभी बुक करें'}
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={onNavigateToPortal}
                        className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-200 cursor-pointer active-press"
                      >
                        <span className="text-[11px] text-orange-600 font-medium">
                          {lang === 'en' ? 'Login to view contact & reviews' : 'संपर्क देखने के लिए लॉगिन करें'}
                        </span>
                        <span className="text-[11px] text-[#F97316] font-bold shrink-0">Login →</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-14 text-gray-400 text-sm flex flex-col items-center gap-2">
              <span className="text-3xl">📭</span>
              <span>{searchQuery ? (lang === 'en' ? 'No providers match your search.' : 'कोई सेवा प्रदाता नहीं मिला।') : t.noResults}</span>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-[#F97316] font-semibold mt-1 active-press">
                  {lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Listing Profile Overlay ── */}
      {selectedProvider && session && (
        <div className="absolute inset-0 z-50 bg-[#F2F9F5] flex flex-col overflow-hidden">

          {/* Cover Photo */}
          <div className="relative shrink-0" style={{ height: 220 }}>
            {getWorkImages(selectedProvider).length > 0 ? (
              <img
                src={getWorkImages(selectedProvider)[0]}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                <span className="text-7xl">{categoryIcons[selectedProvider.category] || '🛠️'}</span>
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(255,248,240,0.4) 100%)' }} />
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm active-press"
            >
              <ChevronLeft size={18} strokeWidth={2} className="text-[#0F3D27]" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto no-scrollbar">

            {/* Header card — profile photo overlapping cover */}
            <div className="bg-white px-4 pb-4 relative shadow-sm">
              {/* Circular profile photo */}
              <div className="absolute -top-8 left-4 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-orange-100 flex items-center justify-center">
                {selectedProvider.profilePhoto
                  ? <img src={selectedProvider.profilePhoto} alt="" className="w-full h-full object-cover" />
                  : <span className="text-2xl">{categoryIcons[selectedProvider.category] || '👤'}</span>}
              </div>

              {/* Name + badge */}
              <div className="pl-20 pt-2 pb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-base font-black text-[#0F3D27]">{selectedProvider.name[lang]}</h2>
                  {selectedProvider.kycStatus === 'approved' && (
                    <BadgeCheck size={14} className="text-[#F97316] shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <BadgeCheck size={12} className="text-[#F97316]" />
                  <span className="text-xs text-[#F97316] font-semibold">
                    {lang === 'en' ? 'Verified Provider' : 'सत्यापित प्रदाता'}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-around py-3 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Star size={14} strokeWidth={0} className="fill-amber-400 text-amber-400" />
                    <span className="text-base font-black text-[#0F3D27]">{selectedProvider.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Rating</span>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <span className="text-base font-black text-[#0F3D27] block">{(selectedProvider.reviews || []).length}</span>
                  <span className="text-[10px] text-gray-400 font-medium">Reviews</span>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <span className="text-base font-black text-[#0F3D27] block">
                    {selectedProvider.wardNo || (lang === 'en' ? 'Local' : 'स्थानीय')}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{lang === 'en' ? 'Resident' : 'निवासी'}</span>
                </div>
              </div>
            </div>

            {/* About section */}
            <div className="px-4 py-4 bg-white mt-2">
              <h3 className="text-base font-black text-[#0F3D27] mb-2">
                {lang === 'en' ? 'About' : 'परिचय'}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedProvider.experience[lang]}
              </p>

              <div className="mt-4 space-y-3">
                {selectedProvider.address?.[lang] && (
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="text-[#F97316] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] text-gray-400 font-bold uppercase block">
                        {lang === 'en' ? 'Location' : 'स्थान'}
                      </span>
                      <p className="text-sm text-[#0F3D27] font-semibold">{selectedProvider.address[lang]}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Clock size={15} className="text-[#F97316] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-gray-400 font-bold uppercase block">
                      {lang === 'en' ? 'Hours' : 'समय'}
                    </span>
                    <p className="text-sm text-[#0F3D27] font-semibold">{selectedProvider.availability[lang]}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {getWorkImages(selectedProvider).length > 0 && (
              <div className="px-4 py-4 bg-white mt-2">
                <h3 className="text-base font-black text-[#0F3D27] mb-3">
                  {lang === 'en' ? 'Work Gallery' : 'कार्य गैलरी'}
                </h3>
                <div className={`grid gap-2 ${getWorkImages(selectedProvider).length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {getWorkImages(selectedProvider).map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden bg-gray-100 ${getWorkImages(selectedProvider).length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                      <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="px-4 py-4 bg-white mt-2">
              <h3 className="text-base font-black text-[#0F3D27] mb-3">
                {lang === 'en' ? 'Reviews' : 'समीक्षाएं'} ({(selectedProvider.reviews || []).length})
              </h3>

              <div className="space-y-3">
                {(selectedProvider.reviews || []).length > 0 ? (
                  (selectedProvider.reviews || []).map((rev) => (
                    <div key={rev.id} className="bg-[#F2F9F5] border border-gray-200 rounded-2xl p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[10px] text-[#F97316] font-bold shrink-0">
                            {rev.author ? rev.author.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="text-[12px] text-[#0F3D27] font-bold">{rev.author}</span>
                        </div>
                        <span className="text-[9px] text-gray-400">{rev.date?.[lang] || rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} strokeWidth={0} className={i < rev.rating ? 'fill-amber-400' : 'fill-gray-200'} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment?.[lang] || rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-3 font-medium">
                    {lang === 'en' ? 'No reviews yet. Be the first!' : 'अभी तक कोई समीक्षा नहीं!'}
                  </p>
                )}
              </div>

              {/* Write review */}
              <div className="mt-4 bg-[#F2F9F5] border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#0F3D27]">
                    {lang === 'en' ? 'Write a Review' : 'समीक्षा लिखें'}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {lang === 'en' ? `as ${session.name?.[lang] || session.name?.en || 'User'}` : `${session.name?.[lang] || session.name?.en || 'उपयोगकर्ता'} के रूप में`}
                  </span>
                </div>

                {revError && <div className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">⚠️ {revError}</div>}
                {revSuccess && <div className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-xl">✓ {lang === 'en' ? 'Review posted!' : 'समीक्षा भेजी गई!'}</div>}

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">{lang === 'en' ? 'Rating:' : 'रेटिंग:'}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => setRevRating(i + 1)} className="cursor-pointer active-press">
                        <Star size={22} strokeWidth={0} className={`${i + 1 <= revRating ? 'fill-amber-400' : 'fill-gray-200'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder={lang === 'en' ? 'Your feedback...' : 'आपकी प्रतिक्रिया...'}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-3 text-sm text-[#0F3D27] placeholder-gray-400 focus:outline-none focus:border-orange-400 resize-none"
                />

                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  className="bg-[#F97316] text-white font-bold py-3 rounded-xl text-sm active-press w-full uppercase tracking-wider hover:bg-[#EA6C0A] transition-colors"
                >
                  {lang === 'en' ? 'Submit Review' : 'समीक्षा भेजें'}
                </button>
              </div>
            </div>

            {/* Bottom spacer for sticky bar */}
            <div className="h-24" />
          </div>

          {/* Sticky bottom CTA */}
          <div className="px-4 py-4 bg-white border-t border-gray-200 flex gap-3 shrink-0">
            <button
              onClick={() => handleWhatsApp(selectedProvider.phone)}
              className="active-press flex-1 py-3.5 rounded-2xl border-2 border-[#0F3D27] text-[#0F3D27] font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle size={16} strokeWidth={1.5} />
              {lang === 'en' ? 'Message' : 'संदेश'}
            </button>
            <button
              onClick={() => handleCall(selectedProvider.name[lang], selectedProvider.phone)}
              className="active-press flex-1 py-3.5 rounded-2xl bg-[#F97316] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#EA6C0A] transition-colors shadow-md shadow-orange-200"
            >
              <Phone size={16} strokeWidth={2} />
              {lang === 'en' ? 'Book Now' : 'अभी बुक करें'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
