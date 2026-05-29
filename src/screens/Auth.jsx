import React, { useState } from 'react';
import { db } from '../data/db';
import { translations } from '../data/translations';
import { Lock, Phone, Mail, User, Briefcase, KeyRound, Leaf, LogIn, UserPlus, ShieldCheck, AtSign } from 'lucide-react';

const inputCls = "w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all";
const inputClsSm = "w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl pl-9 pr-3 py-3 outline-none transition-all";
const labelCls = "text-[10px] font-bold text-gray-400 uppercase tracking-wider";

export default function Auth({ lang, onLoginSuccess, onAdminLoginSuccess }) {
  const t = translations[lang];
  const [view, setView] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('plumbers');
  const [wardNo, setWardNo] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [addressHi, setAddressHi] = useState('');
  const [landmarkEn, setLandmarkEn] = useState('');
  const [landmarkHi, setLandmarkHi] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); setError('');
    const user = db.loginProvider(phone, password);
    if (user) { onLoginSuccess(user); }
    else { setError(lang === 'en' ? 'Invalid mobile number / email or password.' : 'गलत मोबाइल नंबर / ईमेल या पासवर्ड।'); }
  };

  const handleSuperAdminLogin = (e) => {
    e.preventDefault(); setError('');
    if (db.loginSuperAdmin(adminUser, adminPass)) { onAdminLoginSuccess(); }
    else { setError(lang === 'en' ? 'Invalid admin credentials.' : 'अमान्य एडमिन क्रेडेंशियल।'); }
  };

  const handleRegister = (e) => {
    e.preventDefault(); setError('');
    if (!nameEn || !nameHi || !phone || !password || !email) {
      setError(lang === 'en' ? 'Please fill all required fields.' : 'कृपया सभी आवश्यक फ़ील्ड भरें।'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(lang === 'en' ? 'Please enter a valid email address.' : 'कृपया एक वैध ईमेल पता दर्ज करें।'); return;
    }
    const all = db.getProviders();
    if (all.find(p => p.phone === phone)) {
      setError(lang === 'en' ? 'Phone number already registered.' : 'यह फोन नंबर पहले से पंजीकृत है।'); return;
    }
    if (all.find(p => p.email && p.email.toLowerCase() === email.trim().toLowerCase())) {
      setError(lang === 'en' ? 'Email address already registered.' : 'यह ईमेल पहले से पंजीकृत है।'); return;
    }
    const providerData = {
      name: { en: nameEn, hi: nameHi }, phone, email: email.trim(), category, password,
      experience: { en: "Newly Registered", hi: "नया पंजीकृत" },
      availability: { en: "Available, contact provider", hi: "उपलब्ध, प्रदाता से संपर्क करें" },
      wardNo, address: { en: addressEn, hi: addressHi }, landmark: { en: landmarkEn, hi: landmarkHi }
    };
    const registered = db.registerProvider(providerData);
    setInfo(lang === 'en' ? 'Registration successful! Awaiting admin approval.' : 'पंजीकरण सफल! व्यवस्थापक की मंजूरी का इंतजार है।');
    onLoginSuccess(registered);
  };

  const handleForgot = (e) => {
    e.preventDefault(); setError('');
    if (!db.getProviders().find(p => p.phone === resetPhone)) {
      setError(lang === 'en' ? 'Phone number not found.' : 'यह फोन नंबर उपलब्ध नहीं है।'); return;
    }
    setInfo(lang === 'en' ? 'OTP sent! Use code: 123456' : 'ओटीपी भेजा गया! कोड: 123456');
    setView('reset');
  };

  const handleReset = (e) => {
    e.preventDefault(); setError('');
    if (otp !== '123456') { setError(lang === 'en' ? 'Invalid OTP code.' : 'अमान्य ओटीपी।'); return; }
    if (!newPassword || newPassword.length < 4) { setError(lang === 'en' ? 'Password must be at least 4 characters.' : 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।'); return; }
    const p = db.getProviders().find(p => p.phone === resetPhone);
    if (p) {
      db.updateProvider(p.id, { password: newPassword });
      setInfo(lang === 'en' ? 'Password updated! Please login.' : 'पासवर्ड बदला! कृपया लॉगिन करें।');
      setPhone(resetPhone); setPassword(newPassword); setView('login');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8 bg-[#F4F6F8] overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="flex flex-col items-center mb-6 text-center select-none">
        <div className="w-14 h-14 bg-coral/10 rounded-2xl border border-coral/20 flex items-center justify-center text-coral mb-3 shadow-sm">
          {view === 'superadmin'
            ? <ShieldCheck size={26} className="text-amber-500" />
            : <Leaf size={26} />}
        </div>
        <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">
          {view === 'login'      && (lang === 'en' ? 'Provider Login'    : 'सेवा प्रदाता लॉगिन')}
          {view === 'register'   && (lang === 'en' ? 'Provider Sign Up'  : 'सेवा प्रदाता पंजीकरण')}
          {view === 'forgot'     && (lang === 'en' ? 'Forgot Password'   : 'पासवर्ड भूल गए')}
          {view === 'reset'      && (lang === 'en' ? 'Reset Password'    : 'पासवर्ड रीसेट करें')}
          {view === 'superadmin' && (lang === 'en' ? 'Admin Console'     : 'सुपर एडमिन पोर्टल')}
        </h2>
        <p className="text-xs text-gray-400 font-semibold mt-1">
          {view === 'superadmin'
            ? (lang === 'en' ? 'Administrative credentials required' : 'प्रशासनिक साख आवश्यक है')
            : (lang === 'en' ? 'Access your digital panchayat listing portal' : 'अपने डिजिटल पंचायत लिस्टिंग पोर्टल में प्रवेश करें')}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center">⚠️ {error}</div>
      )}
      {info && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold rounded-xl text-center">💡 {info}</div>
      )}

      {/* A. LOGIN */}
      {view === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Mobile No. or Email' : 'मोबाइल नं. या ईमेल'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><AtSign size={16} /></span>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+91XXXXXXXXXX or email@domain.com" className={inputCls} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className={labelCls}>{lang === 'en' ? 'Password' : 'पासवर्ड'}</label>
              <button type="button" onClick={() => setView('forgot')} className="text-[10px] font-bold text-coral hover:underline">
                {lang === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={16} /></span>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••" className={inputCls} />
            </div>
          </div>

          <button type="submit" className="active-press w-full py-3 bg-coral hover:bg-coral-dark text-white rounded-xl font-bold text-sm tracking-wider shadow-sm shadow-coral/25 transition-all flex items-center justify-center gap-2 mt-4">
            <LogIn size={16} strokeWidth={2} />
            {lang === 'en' ? 'LOGIN' : 'लॉगिन करें'}
          </button>

          <p className="text-center text-xs text-gray-400 font-semibold mt-4">
            {lang === 'en' ? "Don't have a listing?" : "सूची नहीं है?"}{' '}
            <button type="button" onClick={() => setView('register')} className="text-coral font-bold hover:underline">
              {lang === 'en' ? 'Register Now' : 'अभी रजिस्टर करें'}
            </button>
          </p>

          <div className="pt-3.5 border-t border-gray-200 text-center mt-2">
            <button type="button" onClick={() => setView('superadmin')} className="text-[10px] font-black text-gray-400 hover:text-amber-500 uppercase tracking-widest transition-colors">
              ⚙️ {lang === 'en' ? 'Access Super Admin Console' : 'सुपर एडमिन कंसोल'}
            </button>
          </div>
        </form>
      )}

      {/* B. REGISTER */}
      {view === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Name (English)' : 'नाम (अंग्रेजी)'}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={14} /></span>
                <input type="text" required value={nameEn} onChange={e => setNameEn(e.target.value)}
                  placeholder="Ram Kumar" className={inputClsSm} />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Name (Hindi)' : 'नाम (हिंदी)'}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={14} /></span>
                <input type="text" required value={nameHi} onChange={e => setNameHi(e.target.value)}
                  placeholder="राम कुमार" className={inputClsSm} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Phone Number' : 'फोन नंबर'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Phone size={14} /></span>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+9198765..." className={inputClsSm} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Email Address' : 'ईमेल पता'} <span className="text-coral">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Mail size={14} /></span>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com" className={inputClsSm} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Ward Number' : 'वार्ड नंबर'}</label>
            <input type="text" value={wardNo} onChange={e => setWardNo(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Ward 3' : 'जैसे वार्ड 3'}
              className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3 py-3 outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Address (EN)' : 'पता (EN)'}</label>
              <input type="text" value={addressEn} onChange={e => setAddressEn(e.target.value)}
                placeholder="House No, Street"
                className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3 py-3 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Address (HI)' : 'पता (HI)'}</label>
              <input type="text" value={addressHi} onChange={e => setAddressHi(e.target.value)}
                placeholder="मकान नं., गली"
                className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3 py-3 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Landmark (EN)' : 'स्थान (EN)'}</label>
              <input type="text" value={landmarkEn} onChange={e => setLandmarkEn(e.target.value)}
                placeholder="Near Panchayat"
                className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3 py-3 outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Landmark (HI)' : 'स्थान (HI)'}</label>
              <input type="text" value={landmarkHi} onChange={e => setLandmarkHi(e.target.value)}
                placeholder="पंचायत के पास"
                className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 placeholder-gray-400 text-xs rounded-xl px-3 py-3 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Category' : 'श्रेणी'}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Briefcase size={14} /></span>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 text-xs rounded-xl pl-9 pr-3 py-3 outline-none font-bold">
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
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Password' : 'पासवर्ड'}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={14} /></span>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••" className={inputClsSm} />
              </div>
            </div>
          </div>

          <button type="submit" className="active-press w-full py-3 bg-coral hover:bg-coral-dark text-white rounded-xl font-bold text-sm tracking-wider shadow-sm shadow-coral/25 transition-all flex items-center justify-center gap-2 mt-4">
            <UserPlus size={16} strokeWidth={2} />
            {lang === 'en' ? 'SIGN UP' : 'पंजीकरण करें'}
          </button>

          <p className="text-center text-xs text-gray-400 font-semibold mt-4">
            {lang === 'en' ? 'Already registered?' : 'पहले से पंजीकृत?'}{' '}
            <button type="button" onClick={() => setView('login')} className="text-sky-blue font-bold hover:underline">
              {lang === 'en' ? 'Login' : 'लॉगिन करें'}
            </button>
          </p>
        </form>
      )}

      {/* C. FORGOT */}
      {view === 'forgot' && (
        <form onSubmit={handleForgot} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Registered Phone' : 'पंजीकृत फोन नंबर'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Phone size={16} /></span>
              <input type="tel" required value={resetPhone} onChange={e => setResetPhone(e.target.value)}
                placeholder="+9198765..." className={inputCls} />
            </div>
          </div>
          <button type="submit" className="active-press w-full py-3 bg-sky-blue text-white rounded-xl font-bold text-sm tracking-wider shadow-sm flex items-center justify-center gap-2">
            <KeyRound size={16} strokeWidth={2} />
            {lang === 'en' ? 'SEND VERIFICATION OTP' : 'सत्यापन ओटीपी भेजें'}
          </button>
          <button type="button" onClick={() => setView('login')} className="w-full py-2 text-gray-400 font-semibold text-xs hover:text-gray-600">
            {lang === 'en' ? 'Back to Login' : 'लॉगिन पर वापस जाएं'}
          </button>
        </form>
      )}

      {/* D. RESET */}
      {view === 'reset' && (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Enter 6-Digit OTP' : '6-अंकीय ओटीपी'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><KeyRound size={16} /></span>
              <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-gray-50 border border-gray-200 focus:border-coral text-gray-900 text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all font-mono font-bold tracking-widest text-center" />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'New Password' : 'नया पासवर्ड'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={16} /></span>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="••••" className={inputCls} />
            </div>
          </div>
          <button type="submit" className="active-press w-full py-3 bg-coral text-white rounded-xl font-bold text-sm tracking-wider shadow-sm transition-all flex items-center justify-center gap-2">
            {lang === 'en' ? 'SUBMIT NEW PASSWORD' : 'नया पासवर्ड सबमिट करें'}
          </button>
        </form>
      )}

      {/* E. SUPER ADMIN */}
      {view === 'superadmin' && (
        <form onSubmit={handleSuperAdminLogin} className="space-y-4">
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Admin Username' : 'एडमिन यूज़रनेम'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={16} /></span>
              <input type="text" required value={adminUser} onChange={e => setAdminUser(e.target.value)}
                placeholder="admin" className={inputCls} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelCls}>{lang === 'en' ? 'Admin Password' : 'एडमिन पासवर्ड'}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={16} /></span>
              <input type="password" required value={adminPass} onChange={e => setAdminPass(e.target.value)}
                placeholder="••••" className={inputCls} />
            </div>
          </div>
          <button type="submit" className="active-press w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-sm transition-all flex items-center justify-center gap-2 mt-4">
            <ShieldCheck size={16} strokeWidth={2} />
            {lang === 'en' ? 'VERIFY ADMIN SESSION' : 'सत्यापित करें'}
          </button>
          <button type="button" onClick={() => setView('login')} className="w-full py-2 text-gray-400 font-semibold text-xs hover:text-gray-600">
            {lang === 'en' ? 'Back to Provider Login' : 'सेवा प्रदाता लॉगिन पर वापस जाएं'}
          </button>
        </form>
      )}
    </div>
  );
}
