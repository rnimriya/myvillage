import React, { useState, useMemo } from 'react';
import { db } from '../data/db';
import { translations } from '../data/translations';
import {
  LogOut, Save, Trash2, Share2, MessageCircle, AlertTriangle, ShieldAlert,
  Mail, Camera, BadgeCheck, FileText, User, Phone, Briefcase, MapPin,
  Clock, Image, CheckCircle, ChevronDown, ChevronRight
} from 'lucide-react';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';
const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

const CATEGORIES = [
  { id: 'doctors',      en: 'Doctor',          hi: 'चिकित्सक',        icon: '🩺' },
  { id: 'electricians', en: 'Electrician',      hi: 'बिजली मिस्त्री', icon: '⚡' },
  { id: 'plumbers',     en: 'Plumber',          hi: 'प्लंबर',          icon: '🔧' },
  { id: 'mechanics',    en: 'Mechanic',         hi: 'मैकेनिक',        icon: '🚜' },
  { id: 'barbers',      en: 'Hair Salon',       hi: 'नाई/सैलून',      icon: '💈' },
  { id: 'internet',     en: 'Internet Provider',hi: 'इंटरनेट प्रदाता', icon: '🌐' },
  { id: 'parlor',       en: 'Beauty Parlor',    hi: 'ब्यूटी पार्लर',  icon: '💇' },
  { id: 'photographer', en: 'Photographer',     hi: 'फोटोग्राफर',     icon: '📷' },
  { id: 'csc',          en: 'CSC Center',       hi: 'सीएससी केंद्र',  icon: '🖥️' },
  { id: 'tuition',      en: 'Tutor',            hi: 'ट्यूशन',         icon: '📚' },
  { id: 'blacksmith',   en: 'Blacksmith',       hi: 'लोहार',          icon: '⚒️' },
  { id: 'goldsmith',    en: 'Goldsmith',        hi: 'सुनार',          icon: '💍' },
  { id: 'carpenter',    en: 'Carpenter',        hi: 'बढ़ई',           icon: '🪚' },
  { id: 'painter',      en: 'Painter',          hi: 'पेंटर',          icon: '🎨' },
  { id: 'sports',       en: 'Sports Coach',     hi: 'खेल कोच',        icon: '🏆' },
];

const inputCls = "w-full bg-[#F2F9F5] border border-gray-200 rounded-full px-3.5 py-3 text-sm text-[#0D2B1A] placeholder-gray-400 outline-none focus:border-[#1B5E3B] focus:bg-white transition-all";
const labelCls = "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5";

const SectionCard = ({ icon, title, badge, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-bold text-[#0D2B1A] flex-1">{title}</span>
      {badge}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export default function Dashboard({ provider, onLogout, lang }) {
  const t = translations[lang];
  const catInfo = CATEGORIES.find(c => c.id === provider.category) || { icon: '👤', en: provider.category };

  const [nameEn,     setNameEn]     = useState(provider.name?.en || '');
  const [nameHi,     setNameHi]     = useState(provider.name?.hi || '');
  const [phone,      setPhone]      = useState(provider.phone || '');
  const [email,      setEmail]      = useState(provider.email || '');
  const [category,   setCategory]   = useState(provider.category || 'plumbers');
  const [expEn,      setExpEn]      = useState(provider.experience?.en || '');
  const [expHi,      setExpHi]      = useState(provider.experience?.hi || '');
  const [availEn,    setAvailEn]    = useState(provider.availability?.en || '');
  const [availHi,    setAvailHi]    = useState(provider.availability?.hi || '');
  const [wardNo,     setWardNo]     = useState(provider.wardNo || '');
  const [addressEn,  setAddressEn]  = useState(provider.address?.en || '');
  const [addressHi,  setAddressHi]  = useState(provider.address?.hi || '');
  const [landmarkEn, setLandmarkEn] = useState(provider.landmark?.en || '');
  const [landmarkHi, setLandmarkHi] = useState(provider.landmark?.hi || '');
  const [workImages, setWorkImages] = useState(
    provider.workImages?.length > 0 ? provider.workImages : provider.workImage ? [provider.workImage] : []
  );
  const [profilePhoto, setProfilePhoto] = useState(provider.profilePhoto || '');
  const [kycDocType,   setKycDocType]   = useState(provider.kycDocType || '');
  const [kycDocument,  setKycDocument]  = useState(provider.kycDocument || '');
  const [kycStatus,    setKycStatus]    = useState(provider.kycStatus || 'none');
  const [kycNote]                        = useState(provider.kycNote || '');

  const [saveSuccess,     setSaveSuccess]     = useState(false);
  const [photoError,      setPhotoError]      = useState('');
  const [imageError,      setImageError]      = useState('');
  const [kycError,        setKycError]        = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile completion score
  const completion = useMemo(() => {
    const checks = [
      !!nameEn, !!phone, !!email, !!profilePhoto,
      !!expEn, !!availEn, !!wardNo, workImages.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [nameEn, phone, email, profilePhoto, expEn, availEn, wardNo, workImages]);

  const handleProfilePhotoChange = (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) { setPhotoError(lang === 'en' ? 'Photo must be under 512KB.' : 'फोटो 512KB से कम होनी चाहिए।'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKYCDocChange = (e) => {
    setKycError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) { setKycError(lang === 'en' ? 'Document must be under 512KB.' : 'दस्तावेज़ 512KB से कम होना चाहिए।'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setKycDocument(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    setImageError('');
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const remaining = 8 - workImages.length;
    if (remaining <= 0) { setImageError(lang === 'en' ? 'Maximum 8 images uploaded.' : 'अधिकतम 8 तस्वीरें।'); return; }
    const toProcess = files.slice(0, remaining);
    let loaded = 0; const results = [];
    toProcess.forEach(file => {
      if (file.size > 1024 * 1024) { setImageError(lang === 'en' ? 'Each image under 1MB.' : 'प्रत्येक इमेज 1MB से कम।'); loaded++; return; }
      const reader = new FileReader();
      reader.onloadend = () => { results.push(reader.result); loaded++; if (loaded === toProcess.length) setWorkImages(p => [...p, ...results]); };
      reader.readAsDataURL(file);
    });
  };

  const handleKYCSubmit = () => {
    setKycError('');
    if (!kycDocType) { setKycError(lang === 'en' ? 'Select a document type.' : 'दस्तावेज़ प्रकार चुनें।'); return; }
    if (!kycDocument) { setKycError(lang === 'en' ? 'Upload a document image.' : 'दस्तावेज़ अपलोड करें।'); return; }
    db.updateProvider(provider.id, { kycDocType, kycDocument, kycStatus: 'pending', kycNote: '' });
    setKycStatus('pending');
  };

  const handleSave = (e) => {
    e.preventDefault(); setSaveSuccess(false);
    db.updateProvider(provider.id, {
      name: { en: nameEn, hi: nameHi }, phone, email, category,
      experience: { en: expEn, hi: expHi }, availability: { en: availEn, hi: availHi },
      workImages, workImage: workImages[0] || '', profilePhoto,
      wardNo, address: { en: addressEn, hi: addressHi }, landmark: { en: landmarkEn, hi: landmarkHi }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getWhatsAppPromoUrl = () => {
    const text = lang === 'en'
      ? `Hi! I'm ${nameEn}, offering ${category} services in our village. 📞 ${phone}. Availability: ${availEn}`
      : `नमस्कार! मैं ${nameHi} हूँ, ${category} सेवाएं। 📞 ${phone}। उपलब्धता: ${availHi}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const currentCat = CATEGORIES.find(c => c.id === category);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#F2F9F5]">

      {/* ── Green Profile Hero ── */}
      <div className="relative shrink-0 overflow-hidden" style={{ background: G }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(27,94,59,0.45)', transform: 'translate(30%,-30%)' }} />

        <div className="relative z-10" style={{ padding: '20px 20px 8px' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl border-2 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center shrink-0 shadow-lg">
                {profilePhoto
                  ? <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
                  : <span className="text-3xl">{catInfo.icon}</span>}
              </div>
              <div>
                <p className="text-green-300 text-[10px] font-bold uppercase tracking-wider">
                  {lang === 'en' ? 'Provider Dashboard' : 'प्रदाता डैशबोर्ड'}
                </p>
                <h2 className="text-[18px] font-black text-white leading-tight">{nameEn || provider.name?.en}</h2>
                <p className="text-white/60 text-xs mt-0.5">{catInfo.icon} {lang === 'en' ? catInfo.en : catInfo.hi}</p>
              </div>
            </div>
            <button onClick={onLogout}
              className="active-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold shrink-0">
              <LogOut size={12} strokeWidth={1.5} />
              {lang === 'en' ? 'Logout' : 'बाहर'}
            </button>
          </div>

          {/* Status + completion */}
          <div className="flex items-center gap-2 mb-1">
            {provider.status === 'approved' ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                {lang === 'en' ? 'Live & Approved' : 'लाइव और मंजूर'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                {lang === 'en' ? 'Pending Approval' : 'स्वीकृति लंबित'}
              </span>
            )}
            <span className="text-[11px] text-white/50 font-medium">{completion}% {lang === 'en' ? 'complete' : 'पूर्ण'}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/20 rounded-full mb-3 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, background: 'linear-gradient(90deg,#F97316,#fbbf24)' }} />
          </div>
        </div>
        <div className="relative z-10"><Wave /></div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSave} className="px-4 pt-4 pb-4 flex flex-col gap-4">

        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" />
            <p className="text-sm font-bold text-emerald-700">
              {lang === 'en' ? 'Profile saved successfully!' : 'प्रोफ़ाइल सहेजी गई!'}
            </p>
          </div>
        )}

        {/* ── Section 1: Profile & Identity ── */}
        <SectionCard icon="👤" title={lang === 'en' ? 'Profile & Identity' : 'प्रोफ़ाइल और पहचान'}>
          {/* Photo upload */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
              {profilePhoto
                ? <img src={profilePhoto} alt="" className="w-full h-full object-cover" />
                : <span className="text-2xl">{currentCat?.icon || '👤'}</span>}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-[#0D2B1A] mb-0.5">{lang === 'en' ? 'Profile Photo' : 'प्रोफ़ाइल फोटो'}</p>
              <p className="text-[11px] text-gray-400 mb-2">{lang === 'en' ? 'Clear face photo recommended' : 'स्पष्ट फोटो लगाएं'}</p>
              <label className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer active-press"
                style={{ background: 'linear-gradient(135deg,#F97316,#EA6C0A)', color: 'white' }}>
                <Camera size={12} />
                {profilePhoto ? (lang === 'en' ? 'Change' : 'बदलें') : (lang === 'en' ? 'Upload' : 'अपलोड')}
                <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </label>
            </div>
          </div>
          {photoError && <p className="text-[11px] text-red-500 font-semibold mb-3">⚠️ {photoError}</p>}

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Name (English)' : 'नाम (अंग्रेज़ी)'}</label>
              <input type="text" required value={nameEn} onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. Ramesh Kumar" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Name (Hindi)' : 'नाम (हिंदी)'}</label>
              <input type="text" required value={nameHi} onChange={e => setNameHi(e.target.value)}
                placeholder="जैसे रमेश कुमार" className={inputCls} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className={labelCls}>{lang === 'en' ? 'Service Category' : 'सेवा श्रेणी'}</label>
            <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value)}
                className={inputCls + ' appearance-none pr-8'}>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {lang === 'en' ? c.en : c.hi}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </SectionCard>

        {/* ── Section 2: Contact Details ── */}
        <SectionCard icon="📞" title={lang === 'en' ? 'Contact Details' : 'संपर्क विवरण'}
          badge={<span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            {lang === 'en' ? 'Visible to customers' : 'ग्राहकों को दिखेगा'}
          </span>}>
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Mobile Number' : 'मोबाइल नंबर'}</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" className={inputCls + ' pl-9'} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{lang === 'en' ? 'Customers will call you on this number' : 'ग्राहक इस नंबर पर कॉल करेंगे'}</p>
            </div>
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Email Address' : 'ईमेल पता'}</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com" className={inputCls + ' pl-9'} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 3: Service Details ── */}
        <SectionCard icon="🛠️" title={lang === 'en' ? 'Your Service' : 'आपकी सेवा'}>
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Years of Experience' : 'अनुभव (वर्ष)'}</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={expEn} onChange={e => setExpEn(e.target.value)}
                  placeholder="e.g. 5 years exp" className={inputCls} />
                <input type="text" value={expHi} onChange={e => setExpHi(e.target.value)}
                  placeholder="जैसे 5 साल का अनुभव" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Working Hours / Availability' : 'काम के घंटे / उपलब्धता'}</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={availEn} onChange={e => setAvailEn(e.target.value)}
                    placeholder="Mon-Sat, 9AM-6PM" className={inputCls + ' pl-8'} />
                </div>
                <input type="text" value={availHi} onChange={e => setAvailHi(e.target.value)}
                  placeholder="सोम-शनि, 9-6 बजे" className={inputCls} />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">{lang === 'en' ? 'Tell customers when you are available' : 'ग्राहकों को बताएं कब उपलब्ध हैं'}</p>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 4: Location ── */}
        <SectionCard icon="📍" title={lang === 'en' ? 'Your Location' : 'आपका स्थान'}>
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Ward / Area Number' : 'वार्ड / क्षेत्र नंबर'}</label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={wardNo} onChange={e => setWardNo(e.target.value)}
                  placeholder={lang === 'en' ? 'e.g. Ward 3, Near Panchayat' : 'जैसे वार्ड 3, पंचायत के पास'}
                  className={inputCls + ' pl-9'} />
              </div>
            </div>
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Full Address' : 'पूरा पता'}</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={addressEn} onChange={e => setAddressEn(e.target.value)}
                  placeholder="House No., Street" className={inputCls} />
                <input type="text" value={addressHi} onChange={e => setAddressHi(e.target.value)}
                  placeholder="मकान नं., गली" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>{lang === 'en' ? 'Nearby Landmark' : 'नज़दीकी स्थान'}</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={landmarkEn} onChange={e => setLandmarkEn(e.target.value)}
                  placeholder="Near school, temple..." className={inputCls} />
                <input type="text" value={landmarkHi} onChange={e => setLandmarkHi(e.target.value)}
                  placeholder="स्कूल, मंदिर के पास..." className={inputCls} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── Section 5: Portfolio ── */}
        <SectionCard icon="📸" title={lang === 'en' ? 'Work Portfolio' : 'काम के फोटो'}
          badge={<span className="text-[11px] text-gray-400 font-semibold">{workImages.length}/8</span>}>
          <p className="text-[11px] text-gray-400 mb-3">
            {lang === 'en' ? 'Show your best work to attract more customers.' : 'ग्राहकों को अपना काम दिखाएं।'}
          </p>
          {imageError && <p className="text-[11px] text-red-500 font-semibold mb-2">⚠️ {imageError}</p>}
          {workImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {workImages.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                  <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setWorkImages(p => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shadow">×</button>
                </div>
              ))}
            </div>
          )}
          {workImages.length < 8 && (
            <label className="relative flex flex-col items-center justify-center gap-1.5 py-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer active-press">
              <Image size={22} className="text-gray-300" />
              <p className="text-sm font-bold text-gray-500">{lang === 'en' ? 'Tap to add photos' : 'फोटो जोड़ने के लिए टैप करें'}</p>
              <p className="text-[11px] text-gray-400">{8 - workImages.length} {lang === 'en' ? 'slots remaining • Max 1MB each' : 'स्लॉट बचे • अधिकतम 1MB'}</p>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          )}
        </SectionCard>

        {/* ── Save Button ── */}
        <button type="submit"
          className="active-press w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#F97316,#EA6C0A)', boxShadow: '0 8px 24px rgba(249,115,22,0.25)' }}>
          <Save size={16} strokeWidth={2} />
          {lang === 'en' ? 'Save Profile' : 'प्रोफ़ाइल सहेजें'}
        </button>
      </form>

      {/* ── KYC Verification ── */}
      <div className="px-4 pb-4">
        <SectionCard icon="🪪" title={lang === 'en' ? 'Identity Verification (KYC)' : 'पहचान सत्यापन (KYC)'}
          badge={
            kycStatus === 'approved' ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ Verified</span>
            : kycStatus === 'pending' ? <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⏳ Under Review</span>
            : <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Not Submitted</span>
          }>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {lang === 'en'
              ? 'Upload your Aadhaar, Voter ID or Driving Licence. Verified providers get a badge on their listing.'
              : 'आधार, मतदाता पहचान पत्र या ड्राइविंग लाइसेंस अपलोड करें। सत्यापित प्रदाताओं को बैज मिलता है।'}
          </p>

          {kycStatus === 'rejected' && kycNote && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold mb-3">
              ⚠️ {lang === 'en' ? 'Rejection Reason: ' : 'अस्वीकृति: '}{kycNote}
            </div>
          )}

          {kycStatus === 'approved' ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <BadgeCheck size={22} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700">{lang === 'en' ? 'Identity Verified' : 'पहचान सत्यापित'}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{lang === 'en' ? 'KYC approved by Panchayat.' : 'पंचायत द्वारा KYC स्वीकृत।'}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelCls}>{lang === 'en' ? 'Document Type' : 'दस्तावेज़ प्रकार'}</label>
                <select value={kycDocType} onChange={e => setKycDocType(e.target.value)}
                  disabled={kycStatus === 'pending'}
                  className={inputCls + ' disabled:opacity-60'}>
                  <option value="">{lang === 'en' ? '-- Select Document --' : '-- दस्तावेज़ चुनें --'}</option>
                  <option value="aadhaar">{lang === 'en' ? 'Aadhaar Card' : 'आधार कार्ड'}</option>
                  <option value="voter">{lang === 'en' ? "Voter's ID Card" : 'मतदाता पहचान पत्र'}</option>
                  <option value="driving">{lang === 'en' ? 'Driving Licence' : 'ड्राइविंग लाइसेंस'}</option>
                  <option value="passport">{lang === 'en' ? 'Passport' : 'पासपोर्ट'}</option>
                </select>
              </div>
              {kycError && <p className="text-[11px] text-red-500 font-semibold">⚠️ {kycError}</p>}
              {kycDocument ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                  <img src={kycDocument} alt="KYC" className="w-full h-full object-contain" />
                  {kycStatus !== 'pending' && (
                    <button type="button" onClick={() => { setKycDocument(''); setKycError(''); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shadow">×</button>
                  )}
                </div>
              ) : (
                <label className="relative flex flex-col items-center py-5 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 cursor-pointer active-press">
                  <FileText size={20} className="text-gray-300 mb-1.5" />
                  <p className="text-sm font-bold text-gray-500">{lang === 'en' ? 'Tap to upload document' : 'दस्तावेज़ अपलोड करें'}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">PNG / JPG · Max 512KB</p>
                  <input type="file" accept="image/*" onChange={handleKYCDocChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
              )}
              <button type="button" onClick={handleKYCSubmit}
                disabled={kycStatus === 'pending'}
                className={`active-press py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  kycStatus === 'pending' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white'}`}
                style={kycStatus !== 'pending' ? { background: 'linear-gradient(135deg,#F97316,#EA6C0A)' } : {}}>
                <BadgeCheck size={15} />
                {kycStatus === 'pending'
                  ? (lang === 'en' ? 'Submitted — Under Review' : 'जमा किया — समीक्षाधीन')
                  : (lang === 'en' ? 'Submit for KYC Verification' : 'KYC सत्यापन के लिए भेजें')}
              </button>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Promote ── */}
      <div className="px-4 pb-4">
        <SectionCard icon="📣" title={lang === 'en' ? 'Promote Your Listing' : 'अपनी सेवा का प्रचार करें'}>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {lang === 'en'
              ? 'Share your profile link on WhatsApp to reach more customers in the village.'
              : 'गांव में अधिक ग्राहकों तक पहुंचने के लिए व्हाट्सएप पर शेयर करें।'}
          </p>
          <a href={getWhatsAppPromoUrl()} target="_blank" rel="noopener noreferrer"
            className="active-press flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-emerald-700 bg-emerald-50 border border-emerald-200">
            <MessageCircle size={16} className="fill-emerald-500 text-emerald-500" />
            {lang === 'en' ? 'Share on WhatsApp' : 'व्हाट्सएप पर शेयर करें'}
          </a>
        </SectionCard>
      </div>

      {/* ── Danger Zone ── */}
      <div className="px-4 pb-8">
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-red-500 shrink-0" />
            <h4 className="text-sm font-bold text-red-500">{lang === 'en' ? 'Danger Zone' : 'खतरनाक क्षेत्र'}</h4>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {lang === 'en' ? 'Permanently delete your listing account. This cannot be undone.' : 'अपना खाता स्थायी रूप से हटाएं।'}
          </p>
          <button type="button" onClick={() => setShowDeleteModal(true)}
            className="active-press flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm">
            <Trash2 size={14} strokeWidth={2} />
            {lang === 'en' ? 'Delete My Account' : 'खाता हटाएं'}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full flex flex-col gap-4 text-center shadow-xl">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center self-center border border-red-100">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900">{lang === 'en' ? 'Delete Account?' : 'खाता हटाएं?'}</h4>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {lang === 'en' ? 'This will permanently remove your listing. This action cannot be undone.' : 'यह क्रिया पूर्ववत नहीं की जा सकती।'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="active-press flex-1 py-3 bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl">
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button onClick={() => { db.deleteProvider(provider.id); onLogout(); }}
                className="active-press flex-1 py-3 bg-red-500 text-white font-bold text-sm rounded-xl">
                {lang === 'en' ? 'Delete' : 'हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
