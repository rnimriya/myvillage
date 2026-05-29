import React, { useState, useMemo } from 'react';
import { Phone, Star, Wrench, UserPlus, ChevronDown, ChevronLeft, Lock, MessageCircle, ArrowRight, Search, X, MapPin, Hash, Landmark, BadgeCheck } from 'lucide-react';
import { db } from '../data/db';
import { translations } from '../data/translations';

export default function Services({ lang, onNavigateToPortal, session }) {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revError, setRevError] = useState('');
  const [revSuccess, setRevSuccess] = useState(false);

  const categories = useMemo(() => [
    { id: 'doctors',      label: lang === 'en' ? 'Doctors'      : 'डॉक्टर',          icon: '🩺' },
    { id: 'electricians', label: lang === 'en' ? 'Electrician'  : 'इलेक्ट्रीशियन',  icon: '⚡' },
    { id: 'plumbers',     label: lang === 'en' ? 'Plumber'      : 'प्लंबर',          icon: '🔧' },
    { id: 'mechanics',    label: lang === 'en' ? 'Mechanic'     : 'मैकेनिक',         icon: '🚜' },
    { id: 'barbers',      label: lang === 'en' ? 'Hair Salon'   : 'नाई/सैलून',       icon: '💈' },
    { id: 'internet',     label: lang === 'en' ? 'Internet'     : 'इंटरनेट',         icon: '🌐' },
    { id: 'parlor',       label: lang === 'en' ? 'Beauty Parlor': 'ब्यूटी पार्लर',   icon: '💇‍♀️' },
    { id: 'photographer', label: lang === 'en' ? 'Photographer' : 'फोटोग्राफर',      icon: '📷' },
    { id: 'csc',          label: lang === 'en' ? 'CSC Center'   : 'सीएससी केंद्र',   icon: '🖥️' },
    { id: 'tuition',      label: lang === 'en' ? 'Tuition'      : 'ट्यूशन',          icon: '📚' },
    { id: 'blacksmith',   label: lang === 'en' ? 'Blacksmith'   : 'लोहार',           icon: '⚒️' },
    { id: 'goldsmith',    label: lang === 'en' ? 'Goldsmith'    : 'सुनार',           icon: '💍' },
    { id: 'sports',       label: lang === 'en' ? 'Sports Coach' : 'खेल कोच',         icon: '🏆' },
    { id: 'carpenter',    label: lang === 'en' ? 'Carpenter'    : 'बढ़ई',            icon: '🪚' },
    { id: 'painter',      label: lang === 'en' ? 'Painter'      : 'पेंटर',           icon: '🎨' },
  ], [lang]);

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const approvedList = useMemo(() => db.getApprovedProviders(), [refreshTrigger]);
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

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative bg-[#F4F6F8]">

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8 flex flex-col pt-4">

        {/* Header */}
        <div className="px-4 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
            <Wrench size={13} strokeWidth={2} className="text-coral" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t.servicesSectionTitle}</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">{t.servicesSubtitle}</p>
        </div>

        {/* Provider Sign Up Banner */}
        <div className="px-4 mb-4">
          <div
            onClick={onNavigateToPortal}
            className="active-press cursor-pointer bg-white border border-coral/20 rounded-2xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition-all shadow-sm"
          >
            <div className="flex-1">
              <h4 className="text-xs font-bold text-coral uppercase tracking-wider">
                {lang === 'en' ? 'Are you a local provider?' : 'क्या आप स्थानीय सेवा प्रदाता हैं?'}
              </h4>
              <p className="text-[11px] text-gray-500 font-medium mt-1 leading-normal">
                {lang === 'en'
                  ? 'Register your service to list your profile for the entire village.'
                  : 'पूरे गांव में अपनी सेवाएं दिखाने के लिए यहां रजिस्टर करें।'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-coral/10 border border-coral/20 text-coral flex items-center justify-center shrink-0">
              <UserPlus size={17} strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="px-4 mb-3">
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => { setActiveCategory(e.target.value); setSearchQuery(''); }}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold outline-none focus:border-coral pr-12 transition-all cursor-pointer shadow-sm"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon}  {cat.label}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronDown size={16} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={15} strokeWidth={1.5} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search by name or location...' : 'नाम या स्थान से खोजें...'}
              className="w-full bg-white border border-gray-200 focus:border-coral rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700">
                <X size={14} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Provider Cards */}
        <div className="px-4 flex-1 space-y-3">
          {filteredServices.length > 0 ? (
            filteredServices.map((provider) => {
              const images = getWorkImages(provider);
              return (
                <div key={provider.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  {/* Portfolio strip */}
                  {images.length > 0 && (
                    <div className="relative h-28 bg-gray-100 overflow-hidden">
                      <img src={images[0]} alt="Work" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      {images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                          <span className="text-[10px] text-white font-semibold">+{images.length - 1} more</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-coral/10 border border-coral/20 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                        {provider.profilePhoto
                          ? <img src={provider.profilePhoto} alt="" className="w-full h-full object-cover" />
                          : categoryIcons[provider.category] || '👤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-gray-900 truncate">{provider.name[lang]}</h3>
                          {provider.kycStatus === 'approved' && (
                            <BadgeCheck size={13} strokeWidth={2} className="text-emerald-500 shrink-0" title="KYC Verified" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            <Star size={9} strokeWidth={0} className="fill-amber-500" />
                            <span>{provider.rating.toFixed(1)}</span>
                            <span className="text-amber-400">({(provider.reviews || []).length})</span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium">{provider.experience[lang]}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium mt-1">📍 {provider.availability[lang]}</p>
                      </div>
                    </div>

                    {session ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCall(provider.name[lang], provider.phone)}
                          className="active-press flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-coral hover:bg-coral-dark text-white font-semibold text-xs transition-colors shadow-sm shadow-coral/20"
                        >
                          <Phone size={12} strokeWidth={2} />
                          {lang === 'en' ? 'Call' : 'कॉल'}
                        </button>
                        <button
                          onClick={() => handleWhatsApp(provider.phone)}
                          className="active-press flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 font-semibold text-xs transition-colors"
                        >
                          <MessageCircle size={12} strokeWidth={1.5} />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleOpenProfile(provider)}
                          className="active-press w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 text-gray-500 hover:text-coral hover:border-coral/30 transition-colors shrink-0"
                        >
                          <ArrowRight size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={onNavigateToPortal}
                        className="flex items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-coral/30 transition-all active-press"
                      >
                        <div className="flex items-center gap-2">
                          <Lock size={11} className="text-gray-400 shrink-0" />
                          <span className="text-[10px] text-gray-500 font-medium">
                            {lang === 'en' ? 'Login to view contact & reviews' : 'संपर्क और समीक्षा देखने के लिए लॉगिन करें'}
                          </span>
                        </div>
                        <span className="text-[10px] text-coral font-bold shrink-0">
                          {lang === 'en' ? 'Login →' : 'लॉगिन →'}
                        </span>
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
                <button onClick={() => setSearchQuery('')} className="text-xs text-coral font-semibold mt-1 active-press">
                  {lang === 'en' ? 'Clear search' : 'खोज साफ करें'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Profile Overlay */}
      {selectedProvider && session && (
        <div className="absolute inset-0 z-50 bg-[#F4F6F8] flex flex-col overflow-hidden">

          {/* Overlay Header */}
          <div
            className="px-4 py-3 flex items-center gap-3 shrink-0"
            style={{ background: 'linear-gradient(135deg, #E8534A 0%, #C43B34 100%)' }}
          >
            <button
              onClick={() => setSelectedProvider(null)}
              className="active-press w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-white/40 bg-white/20 overflow-hidden flex items-center justify-center text-lg shrink-0">
              {selectedProvider.profilePhoto
                ? <img src={selectedProvider.profilePhoto} alt="" className="w-full h-full object-cover" />
                : categoryIcons[selectedProvider.category] || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white truncate">{selectedProvider.name[lang]}</h3>
                {selectedProvider.kycStatus === 'approved' && (
                  <BadgeCheck size={13} strokeWidth={2} className="text-white shrink-0" title="KYC Verified" />
                )}
              </div>
              <p className="text-[9px] text-white/70 uppercase tracking-wider font-semibold">
                {categories.find(c => c.id === selectedProvider.category)?.label || selectedProvider.category}
              </p>
            </div>
            <div className="flex items-center gap-1 text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg border border-white/30 shrink-0">
              <Star size={10} strokeWidth={0} className="fill-white" />
              {selectedProvider.rating.toFixed(1)}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">

            {/* Portfolio Images */}
            {getWorkImages(selectedProvider).length > 0 && (
              <div className="p-4 bg-white border-b border-gray-100">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-2.5">
                  📸 {lang === 'en' ? 'Portfolio' : 'कार्य प्रदर्शन'} ({getWorkImages(selectedProvider).length})
                </p>
                <div className={`grid gap-2 ${getWorkImages(selectedProvider).length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {getWorkImages(selectedProvider).map((img, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm ${getWorkImages(selectedProvider).length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                      <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider Info */}
            <div className="p-4 bg-white border-b border-gray-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-1">{lang === 'en' ? 'Experience' : 'अनुभव'}</p>
                  <p className="text-xs text-gray-900 font-semibold">{selectedProvider.experience[lang]}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-1">{lang === 'en' ? 'Availability' : 'उपलब्धता'}</p>
                  <p className="text-xs text-gray-900 font-semibold">{selectedProvider.availability[lang]}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCall(selectedProvider.name[lang], selectedProvider.phone)}
                  className="active-press flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-coral hover:bg-coral-dark text-white font-bold text-sm transition-colors shadow-sm shadow-coral/25"
                >
                  <Phone size={15} strokeWidth={2} />
                  {lang === 'en' ? 'Call Now' : 'अभी कॉल करें'}
                </button>
                <button
                  onClick={() => handleWhatsApp(selectedProvider.phone)}
                  className="active-press flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-600 font-bold text-sm transition-colors"
                >
                  <MessageCircle size={15} strokeWidth={1.5} />
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Address Section */}
            {(selectedProvider.wardNo || selectedProvider.address?.[lang] || selectedProvider.landmark?.[lang]) && (
              <div className="p-4 bg-white border-b border-gray-100 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {lang === 'en' ? 'Location & Address' : 'स्थान और पता'}
                  </span>
                </div>

                {selectedProvider.wardNo && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                      <Hash size={13} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{lang === 'en' ? 'Ward Number' : 'वार्ड नंबर'}</p>
                      <p className="text-xs text-gray-900 font-semibold">{selectedProvider.wardNo}</p>
                    </div>
                  </div>
                )}

                {selectedProvider.address?.[lang] && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <MapPin size={13} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{lang === 'en' ? 'Full Address' : 'पूरा पता'}</p>
                      <p className="text-xs text-gray-900 font-semibold leading-relaxed">{selectedProvider.address[lang]}</p>
                    </div>
                  </div>
                )}

                {selectedProvider.landmark?.[lang] && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Landmark size={13} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">{lang === 'en' ? 'Near Landmark' : 'पास का स्थान'}</p>
                      <p className="text-xs text-gray-900 font-semibold">{selectedProvider.landmark[lang]}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="p-4 space-y-3 pb-8">
              <div className="flex items-center gap-2">
                <span className="w-1 h-3.5 rounded-full bg-sky-blue shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {lang === 'en' ? 'Reviews' : 'समीक्षाएं'} ({(selectedProvider.reviews || []).length})
                </span>
              </div>

              <div className="space-y-2">
                {(selectedProvider.reviews || []).length > 0 ? (
                  (selectedProvider.reviews || []).map((rev) => (
                    <div key={rev.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center text-[9px] text-coral font-bold shrink-0">
                            {rev.author ? rev.author.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span className="text-[11px] text-gray-900 font-semibold">{rev.author}</span>
                        </div>
                        <span className="text-[9px] text-gray-400">{rev.date?.[lang] || rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={9} strokeWidth={0} className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{rev.comment?.[lang] || rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-gray-400 text-center py-3 font-medium italic">
                    {lang === 'en' ? 'No reviews yet. Be the first!' : 'अभी तक कोई समीक्षा नहीं। पहले बनें!'}
                  </p>
                )}
              </div>

              {/* Add Review */}
              <div className="bg-white border border-gray-100 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-coral uppercase tracking-wider">
                    {lang === 'en' ? 'Write a Review' : 'समीक्षा लिखें'}
                  </h4>
                  <span className="text-[9px] text-gray-400 font-medium">
                    {lang === 'en' ? `as ${session.name?.[lang] || session.name?.en || 'User'}` : `${session.name?.[lang] || session.name?.en || 'उपयोगकर्ता'} के रूप में`}
                  </span>
                </div>

                {revError && (
                  <div className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">⚠️ {revError}</div>
                )}
                {revSuccess && (
                  <div className="text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg">✓ {lang === 'en' ? 'Review posted!' : 'समीक्षा भेजी गई!'}</div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-medium">{lang === 'en' ? 'Rating:' : 'रेटिंग:'}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button key={i} type="button" onClick={() => setRevRating(i + 1)} className="cursor-pointer active-press">
                        <Star size={20} strokeWidth={0} className={`${i + 1 <= revRating ? 'fill-amber-500' : 'fill-gray-200'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder={lang === 'en' ? 'Your feedback...' : 'आपकी प्रतिक्रिया...'}
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-coral resize-none"
                />

                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  className="bg-coral hover:bg-coral-dark text-white font-bold py-2.5 rounded-xl text-xs active-press transition-all text-center w-full uppercase tracking-wider shadow-sm shadow-coral/25"
                >
                  {lang === 'en' ? 'Submit Review' : 'समीक्षा भेजें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
