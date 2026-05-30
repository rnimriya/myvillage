import React, { useState } from 'react';
import { db } from '../data/db';
import { translations } from '../data/translations';
import { LogOut, Save, Trash2, Share2, MessageCircle, AlertTriangle, Eye, ShieldAlert, Sparkles, Mail, Camera, BadgeCheck, FileText } from 'lucide-react';

const inputCls = "form-input w-full text-sm px-3 py-2.5";
const labelCls = "form-label block text-base text-gray-600 uppercase tracking-wider";

export default function Dashboard({ provider, onLogout, lang }) {
  const t = translations[lang];

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const [nameEn,    setNameEn]    = useState(provider.name.en || '');
  const [nameHi,    setNameHi]    = useState(provider.name.hi || '');
  const [phone,     setPhone]     = useState(provider.phone || '');
  const [email,     setEmail]     = useState(provider.email || '');
  const [category,  setCategory]  = useState(provider.category || 'plumbers');
  const [expEn,     setExpEn]     = useState(provider.experience?.en || '');
  const [expHi,     setExpHi]     = useState(provider.experience?.hi || '');
  const [availEn,   setAvailEn]   = useState(provider.availability?.en || '');
  const [availHi,   setAvailHi]   = useState(provider.availability?.hi || '');
  const [wardNo,    setWardNo]    = useState(provider.wardNo || '');
  const [addressEn, setAddressEn] = useState(provider.address?.en || '');
  const [addressHi, setAddressHi] = useState(provider.address?.hi || '');
  const [landmarkEn, setLandmarkEn] = useState(provider.landmark?.en || '');
  const [landmarkHi, setLandmarkHi] = useState(provider.landmark?.hi || '');
  const [workImages, setWorkImages] = useState(
    provider.workImages?.length > 0 ? provider.workImages
    : provider.workImage ? [provider.workImage] : []
  );
  const [imageError,      setImageError]      = useState('');
  const [saveSuccess,     setSaveSuccess]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePhoto,    setProfilePhoto]    = useState(provider.profilePhoto || '');
  const [photoError,      setPhotoError]      = useState('');
  const [kycDocType,      setKycDocType]      = useState(provider.kycDocType || '');
  const [kycDocument,     setKycDocument]     = useState(provider.kycDocument || '');
  const [kycStatus,       setKycStatus]       = useState(provider.kycStatus || 'none');
  const [kycNote]                              = useState(provider.kycNote || '');
  const [kycError,        setKycError]        = useState('');

  const handleProfilePhotoChange = (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      setPhotoError(lang === 'en' ? 'Photo must be under 512KB.' : 'फोटो 512KB से कम होनी चाहिए।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKYCDocChange = (e) => {
    setKycError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      setKycError(lang === 'en' ? 'Document must be under 512KB.' : 'दस्तावेज़ 512KB से कम होना चाहिए।');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setKycDocument(reader.result);
    reader.readAsDataURL(file);
  };

  const handleKYCSubmit = () => {
    setKycError('');
    if (!kycDocType) { setKycError(lang === 'en' ? 'Select a document type.' : 'दस्तावेज़ प्रकार चुनें।'); return; }
    if (!kycDocument) { setKycError(lang === 'en' ? 'Upload a document image.' : 'दस्तावेज़ अपलोड करें।'); return; }
    db.updateProvider(provider.id, { kycDocType, kycDocument, kycStatus: 'pending', kycNote: '' });
    setKycStatus('pending');
  };

  const handleFileChange = (e) => {
    setImageError('');
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const remaining = 8 - workImages.length;
    if (remaining <= 0) { setImageError(lang === 'en' ? 'Maximum 8 images already uploaded.' : 'अधिकतम 8 तस्वीरें पहले ही अपलोड हैं।'); return; }
    const toProcess = files.slice(0, remaining);
    let loaded = 0; const results = [];
    toProcess.forEach((file) => {
      if (file.size > 1024 * 1024) { setImageError(lang === 'en' ? 'Each image must be under 1MB.' : 'प्रत्येक इमेज 1MB से कम होनी चाहिए।'); loaded++; return; }
      const reader = new FileReader();
      reader.onloadend = () => { results.push(reader.result); loaded++; if (loaded === toProcess.length) setWorkImages(prev => [...prev, ...results]); };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = (e) => {
    e.preventDefault(); setSaveSuccess(false);
    const updated = {
      name: { en: nameEn, hi: nameHi }, phone, email, category,
      experience: { en: expEn, hi: expHi }, availability: { en: availEn, hi: availHi },
      workImages, workImage: workImages[0] || '', profilePhoto,
      wardNo, address: { en: addressEn, hi: addressHi }, landmark: { en: landmarkEn, hi: landmarkHi }
    };
    db.updateProvider(provider.id, updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getWhatsAppPromoUrl = () => {
    const activeName = lang === 'en' ? nameEn : nameHi;
    const text = lang === 'en'
      ? `Greetings! I am ${activeName}, offering professional ${category.toUpperCase()} services in our village. 📞 Call me at ${phone}! Availability: ${availEn}`
      : `नमस्कार! मैं ${activeName} हूँ, गाँव में पेशेवर ${category.toUpperCase()} सेवाएँ। 📞 ${phone} पर संपर्क करें। उपलब्धता: ${availHi}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-[#FAF7F2] flex flex-col pt-4">

      {/* Header */}
      <div className="px-5 pb-4 flex justify-between items-center select-none">
        <div className="flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
          <Sparkles size={13} strokeWidth={2} className="text-coral" />
          <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
            {lang === 'en' ? 'Dashboard' : 'डैशबोर्ड'}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="active-press flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-red-50 hover:text-red-500 border border-gray-200 text-sm font-medium text-gray-500 transition-colors shadow-sm"
        >
          <LogOut size={13} strokeWidth={1.5} />
          {lang === 'en' ? 'Logout' : 'लॉगआउट'}
        </button>
      </div>

      <div className="px-5 space-y-5">

        {/* Status Badge */}
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-400">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-0.5">
              {lang === 'en' ? 'Listing Visibility Status' : 'सूची दृश्यता स्थिति'}
            </p>
            {provider.status === 'approved' ? (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ● {lang === 'en' ? 'APPROVED & LIVE' : 'मंजूर और लाइव'}
              </span>
            ) : (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                ● {lang === 'en' ? 'PENDING APPROVAL' : 'स्वीकृति लंबित'}
              </span>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 font-bold text-sm rounded-xl text-center">
            💾 {lang === 'en' ? 'Changes saved successfully!' : 'बदलाव सफलतापूर्वक सहेजे गए!'}
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">
            {lang === 'en' ? 'Edit Details' : 'विवरण संपादित करें'}
          </h3>

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className={labelCls}>
              {lang === 'en' ? `Profile Photo (Optional • Max 512KB)` : `प्रोफाइल फोटो (वैकल्पिक • 512KB)`}
            </label>
            {photoError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-xl">⚠️ {photoError}</div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                {profilePhoto
                  ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="text-2xl">{categoryIcons[category] || '👤'}</span>}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="relative flex items-center justify-center gap-2 w-full py-2.5 bg-coral/10 border border-coral/20 text-coral text-sm font-bold rounded-xl cursor-pointer">
                  <Camera size={13} />
                  {profilePhoto
                    ? (lang === 'en' ? 'Change Photo' : 'फोटो बदलें')
                    : (lang === 'en' ? 'Upload Photo' : 'फोटो अपलोड करें')}
                  <input type="file" accept="image/*" onChange={handleProfilePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </label>
                {profilePhoto && (
                  <button type="button" onClick={() => { setProfilePhoto(''); setPhotoError(''); }}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-red-50 border border-red-200 text-red-500 text-sm font-bold rounded-xl">
                    <Trash2 size={12} />
                    {lang === 'en' ? 'Remove Photo' : 'फोटो हटाएं'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Icon */}
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Your Listing Icon (Automatic)' : 'लिस्टिंग का आइकन (स्वचालित)'}</label>
            <div className="flex gap-4 items-center p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
                {categoryIcons[category] || '👤'}
              </div>
              <div className="text-sm">
                <p className="text-gray-900 font-bold">{lang === 'en' ? 'Category Icon Selected' : 'श्रेणी आइकन चुना गया'}</p>
                  <p className="text-sm text-gray-400 font-medium mt-0.5 leading-normal">
                  {lang === 'en' ? 'Based on your category. No photo upload required.' : 'आपकी श्रेणी के आधार पर।'}
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Photos */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <label className={labelCls}>
              {lang === 'en' ? `Portfolio Photos (${workImages.length}/8 • Max 1MB each)` : `पोर्टफोलियो (${workImages.length}/8)`}
            </label>

            {imageError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-xl text-center">⚠️ {imageError}</div>
            )}

            {workImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {workImages.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                    <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setWorkImages(p => p.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shadow">×</button>
                  </div>
                ))}
              </div>
            )}

            {workImages.length < 8 && (
              <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center relative flex flex-col items-center justify-center cursor-pointer transition-all">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-xl mb-1">📸</span>
                <p className="text-sm font-bold text-gray-700">{lang === 'en' ? 'Tap to add work photos' : 'कार्य फोटो जोड़ें'}</p>
                <p className="text-sm text-gray-400 font-semibold mt-0.5">PNG/JPG • Under 1MB • {8 - workImages.length} {lang === 'en' ? 'slots left' : 'स्लॉट बचे'}</p>
              </div>
            )}

            <p className="text-sm text-gray-400/70 leading-normal italic font-semibold">
              🔒 {lang === 'en' ? 'Do not upload sensitive photos. Content is audited by Panchayat.' : 'संवेदनशील फोटो न अपलोड करें।'}
            </p>
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Name (EN)' : 'नाम (EN)'}</label>
              <input type="text" required value={nameEn} onChange={e => setNameEn(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Name (HI)' : 'नाम (HI)'}</label>
              <input type="text" required value={nameHi} onChange={e => setNameHi(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Phone + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Phone Number' : 'फोन नंबर'}</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Category' : 'श्रेणी'}</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="form-input w-full text-sm pl-3 py-2.5 font-bold">
                <option value="doctors">{lang === 'en' ? 'Doctor' : 'चिकित्सक'}</option>
                <option value="electricians">{lang === 'en' ? 'Electrician' : 'बिजली मिस्त्री'}</option>
                <option value="plumbers">{lang === 'en' ? 'Plumber' : 'प्लंबर'}</option>
                <option value="mechanics">{lang === 'en' ? 'Mechanic' : 'मैकेनिक'}</option>
                <option value="barbers">{lang === 'en' ? 'Barber' : 'नाई'}</option>
                <option value="internet">{lang === 'en' ? 'Internet Provider' : 'इंटरनेट प्रदाता'}</option>
                <option value="parlor">{lang === 'en' ? 'Beauty Parlor' : 'ब्यूटी पार्लर'}</option>
                <option value="photographer">{lang === 'en' ? 'Photographer' : 'फोटोग्राफर'}</option>
                <option value="csc">{lang === 'en' ? 'CSC Center' : 'सीएससी केंद्र'}</option>
                <option value="tuition">{lang === 'en' ? 'Tutor' : 'ट्यूशन'}</option>
                <option value="blacksmith">{lang === 'en' ? 'Blacksmith' : 'लोहार'}</option>
                <option value="goldsmith">{lang === 'en' ? 'Goldsmith' : 'सुनार'}</option>
                <option value="sports">{lang === 'en' ? 'Sports Coach' : 'खेल कोच'}</option>
                <option value="carpenter">{lang === 'en' ? 'Carpenter' : 'बढ़ई'}</option>
                <option value="painter">{lang === 'en' ? 'Painter' : 'पेंटर'}</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Email Address' : 'ईमेल पता'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none"><Mail size={13} /></span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"
                className="form-input w-full text-sm pl-9 pr-3 py-2.5" />
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Experience (EN)' : 'अनुभव (EN)'}</label>
              <input type="text" required value={expEn} onChange={e => setExpEn(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Experience (HI)' : 'अनुभव (HI)'}</label>
              <input type="text" required value={expHi} onChange={e => setExpHi(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Availability */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Availability (EN)' : 'उपलब्धता (EN)'}</label>
              <input type="text" required value={availEn} onChange={e => setAvailEn(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Availability (HI)' : 'उपलब्धता (HI)'}</label>
              <input type="text" required value={availHi} onChange={e => setAvailHi(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Address */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">📍 {lang === 'en' ? 'Location & Address' : 'स्थान और पता'}</p>

            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Ward Number' : 'वार्ड नंबर'}</label>
              <input type="text" value={wardNo} onChange={e => setWardNo(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Ward 3' : 'जैसे वार्ड 3'} className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Address (EN)' : 'पता (EN)'}</label>
                <input type="text" value={addressEn} onChange={e => setAddressEn(e.target.value)}
                  placeholder="House No, Street" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Address (HI)' : 'पता (HI)'}</label>
                <input type="text" value={addressHi} onChange={e => setAddressHi(e.target.value)}
                  placeholder="मकान नं., गली" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Landmark (EN)' : 'स्थान (EN)'}</label>
                <input type="text" value={landmarkEn} onChange={e => setLandmarkEn(e.target.value)}
                  placeholder="Near Panchayat" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Landmark (HI)' : 'स्थान (HI)'}</label>
                <input type="text" value={landmarkHi} onChange={e => setLandmarkHi(e.target.value)}
                  placeholder="पंचायत के पास" className={inputCls} />
              </div>
            </div>
          </div>

          <button type="submit" className="form-button primary w-full mt-4 flex items-center justify-center gap-2">
            <Save size={16} strokeWidth={2} />
            {lang === 'en' ? 'SAVE PROFILE DETAILS' : 'प्रोफ़ाइल सहेजें'}
          </button>
        </form>

        {/* KYC Verification */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <BadgeCheck size={16} className="text-coral" />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex-1">
              {lang === 'en' ? 'KYC Verification' : 'केवाईसी सत्यापन'}
            </h3>
            {kycStatus === 'approved' && (
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">✓ VERIFIED</span>
            )}
            {kycStatus === 'pending' && (
              <span className="text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">⏳ UNDER REVIEW</span>
            )}
            {(kycStatus === 'rejected' || kycStatus === 'none') && kycStatus !== 'pending' && kycStatus !== 'approved' && (
              <span className="text-sm font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{kycStatus === 'rejected' ? '✗ REJECTED' : 'NOT SUBMITTED'}</span>
            )}
          </div>

          {kycStatus === 'rejected' && kycNote && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-semibold leading-relaxed">
              ⚠️ {lang === 'en' ? 'Rejection Reason: ' : 'अस्वीकृति कारण: '}{kycNote}
            </div>
          )}

          {kycStatus === 'approved' ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <BadgeCheck size={22} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700">{lang === 'en' ? 'Identity Verified' : 'पहचान सत्यापित'}</p>
                <p className="text-sm text-emerald-600 mt-0.5 leading-relaxed">
                  {lang === 'en' ? 'Your KYC has been approved by Panchayat.' : 'पंचायत द्वारा आपकी KYC स्वीकृत है।'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Document Type' : 'दस्तावेज़ प्रकार'}</label>
                <select value={kycDocType} onChange={e => setKycDocType(e.target.value)}
                  disabled={kycStatus === 'pending'}
                  className="form-input w-full text-sm px-3 py-2.5 font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                  <option value="">{lang === 'en' ? '-- Select Document --' : '-- दस्तावेज़ चुनें --'}</option>
                  <option value="aadhaar">{lang === 'en' ? 'Aadhaar Card' : 'आधार कार्ड'}</option>
                  <option value="passport">{lang === 'en' ? 'Valid Indian Passport' : 'भारतीय पासपोर्ट'}</option>
                  <option value="voter">{lang === 'en' ? "Voter's ID Card" : 'मतदाता पहचान पत्र'}</option>
                  <option value="driving">{lang === 'en' ? 'Driving Licence' : 'ड्राइविंग लाइसेंस'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={labelCls}>{lang === 'en' ? 'Upload Document (Max 512KB)' : 'दस्तावेज़ अपलोड करें (512KB)'}</label>
                {kycError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl">⚠️ {kycError}</div>
                )}
                {kycDocument ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                    <img src={kycDocument} alt="KYC Document" className="w-full h-full object-contain" />
                    {kycStatus !== 'pending' && (
                      <button type="button" onClick={() => { setKycDocument(''); setKycError(''); }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shadow">×</button>
                    )}
                  </div>
                ) : (
                  <label className="relative border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-center flex flex-col items-center justify-center cursor-pointer transition-all">
                    <FileText size={20} className="text-gray-400 mb-1" />
                    <p className="text-sm font-bold text-gray-700">{lang === 'en' ? 'Tap to upload document' : 'दस्तावेज़ अपलोड करें'}</p>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">PNG / JPG • Max 512KB</p>
                    <input type="file" accept="image/*" onChange={handleKYCDocChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                )}
              </div>

              <button type="button" onClick={handleKYCSubmit}
                disabled={kycStatus === 'pending'}
                className={`form-button w-full ${kycStatus === 'pending' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'primary'}`}>
                <BadgeCheck size={14} />
                {kycStatus === 'pending'
                  ? (lang === 'en' ? 'SUBMITTED — UNDER REVIEW' : 'जमा किया — समीक्षाधीन')
                  : (lang === 'en' ? 'SUBMIT FOR KYC VERIFICATION' : 'केवाईसी सत्यापन के लिए भेजें')}
              </button>
            </>
          )}
        </div>

        {/* WhatsApp Promo */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3 shadow-sm">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Share2 size={16} className="text-emerald-500" />
            {lang === 'en' ? 'Marketing & Promotion' : 'विपणन और प्रचार'}
          </h3>
          <p className="text-sm text-gray-500 leading-normal">
            {lang === 'en'
              ? 'Promote your listing on WhatsApp! Share a prefilled text with village residents.'
              : 'व्हाट्सएप पर अपनी सूची का प्रचार करें!'}
          </p>
          <a
            href={getWhatsAppPromoUrl()}
            target="_blank" rel="noopener noreferrer"
            className="form-button secondary w-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} className="fill-emerald-500 text-emerald-500" />
            {lang === 'en' ? 'SHARE ON WHATSAPP' : 'व्हाट्सएप पर साझा करें'}
          </a>
        </div>

        {/* Danger Zone */}
        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3">
          <h3 className="text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert size={16} className="text-red-500" />
            {lang === 'en' ? 'Danger Zone' : 'खतरनाक क्षेत्र'}
          </h3>
          <p className="text-sm text-gray-500 leading-normal">
            {lang === 'en'
              ? 'Permanently delete your listing account. This action is irreversible.'
              : 'अपनी लिस्टिंग को स्थायी रूप से हटाएं।'}
          </p>
          <button type="button" onClick={() => setShowDeleteModal(true)}
            className="form-button w-full bg-red-500 text-white flex items-center justify-center gap-2">
            <Trash2 size={16} strokeWidth={2} />
            {lang === 'en' ? 'DELETE LISTING ACCOUNT' : 'खाता हटा दें'}
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center shadow-xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center self-center border border-red-100">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900 uppercase tracking-wider">
                {lang === 'en' ? 'Confirm Deletion' : 'हटाने की पुष्टि करें'}
              </h4>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed font-semibold">
                {lang === 'en'
                  ? 'Are you absolutely sure? Your listing will be permanently removed immediately.'
                  : 'क्या आप सुनिश्चित हैं? आपकी सूची तुरंत हटा दी जाएगी।'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="active-press flex-1 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl">
                {lang === 'en' ? 'CANCEL' : 'रद्द करें'}
              </button>
              <button onClick={() => { db.deleteProvider(provider.id); onLogout(); }}
                className="active-press flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors">
                {lang === 'en' ? 'DELETE' : 'हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
