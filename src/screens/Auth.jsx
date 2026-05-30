import React, { useState } from 'react';
import { db } from '../data/db';
import { translations } from '../data/translations';
import { Lock, Phone, Mail, User, Briefcase, KeyRound, LogIn, UserPlus, ShieldCheck, AtSign, ChevronLeft } from 'lucide-react';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';

const VillageSVG = () => (
  <svg viewBox="0 0 220 110" xmlns="http://www.w3.org/2000/svg" className="w-52 h-28 mx-auto drop-shadow-lg">
    <circle cx="185" cy="20" r="16" fill="#FEF08A" opacity="0.9"/>
    {[0,45,90,135,180,225,270,315].map((d,i)=>(
      <line key={i} x1="185" y1="20"
        x2={185+25*Math.cos(d*Math.PI/180)} y2={20+25*Math.sin(d*Math.PI/180)}
        stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    ))}
    {/* house left */}
    <rect x="10" y="58" width="48" height="48" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <polygon points="10,58 34,30 58,58" fill="rgba(255,255,255,0.35)"/>
    <rect x="25" y="76" width="18" height="30" rx="3" fill="rgba(255,255,255,0.2)"/>
    {/* house center (tall) */}
    <rect x="66" y="48" width="52" height="58" rx="4" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <polygon points="66,48 92,18 118,48" fill="rgba(255,255,255,0.4)"/>
    <rect x="82" y="68" width="20" height="38" rx="3" fill="rgba(255,255,255,0.2)"/>
    {/* house right */}
    <rect x="126" y="62" width="44" height="44" rx="4" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <polygon points="126,62 148,36 170,62" fill="rgba(255,255,255,0.35)"/>
    <rect x="139" y="78" width="18" height="28" rx="3" fill="rgba(255,255,255,0.2)"/>
    {/* trees */}
    <circle cx="6" cy="82" r="9" fill="rgba(110,231,183,0.5)"/>
    <rect x="4" y="87" width="4" height="16" rx="2" fill="rgba(255,255,255,0.2)"/>
    <circle cx="180" cy="78" r="8" fill="rgba(110,231,183,0.5)"/>
    <rect x="178" y="82" width="4" height="14" rx="2" fill="rgba(255,255,255,0.2)"/>
  </svg>
);

const Wave = ({ color = '#F2F9F5' }) => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill={color}/>
  </svg>
);

const inputCls = "w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3.5 text-sm text-[#0D2B1A] placeholder-gray-400 outline-none focus:border-[#1B5E3B] focus:ring-2 focus:ring-green-100 transition-all";
const inputPlain = "w-full bg-white border border-gray-200 rounded-full px-4 py-3.5 text-sm text-[#0D2B1A] placeholder-gray-400 outline-none focus:border-[#1B5E3B] focus:ring-2 focus:ring-green-100 transition-all";

const Field = ({ icon: Icon, children }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
      <Icon size={15} strokeWidth={1.5} />
    </span>
    {children}
  </div>
);

const OBtn = ({ children, type = 'submit', onClick }) => (
  <button type={type} onClick={onClick}
    className="active-press w-full py-4 rounded-full font-bold text-sm text-white transition-colors"
    style={{ background: 'linear-gradient(135deg, #F97316, #EA6C0A)', boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
    {children}
  </button>
);

export default function Auth({ lang, onLoginSuccess, onAdminLoginSuccess }) {
  const t = translations[lang];
  const [view, setView]             = useState('login');
  const [phone, setPhone]           = useState('');
  const [password, setPassword]     = useState('');
  const [nameEn, setNameEn]         = useState('');
  const [nameHi, setNameHi]         = useState('');
  const [email, setEmail]           = useState('');
  const [category, setCategory]     = useState('plumbers');
  const [wardNo, setWardNo]         = useState('');
  const [addressEn, setAddressEn]   = useState('');
  const [addressHi, setAddressHi]   = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp]               = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminUser, setAdminUser]   = useState('');
  const [adminPass, setAdminPass]   = useState('');
  const [error, setError]           = useState('');
  const [info, setInfo]             = useState('');

  const go = (v) => { setView(v); setError(''); setInfo(''); };

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
    const registered = db.registerProvider({
      name: { en: nameEn, hi: nameHi }, phone, email: email.trim(), category, password,
      experience: { en: "Newly Registered", hi: "नया पंजीकृत" },
      availability: { en: "Available, contact provider", hi: "उपलब्ध, प्रदाता से संपर्क करें" },
      wardNo, address: { en: addressEn, hi: addressHi }
    });
    setInfo(lang === 'en' ? 'Registration successful! Awaiting approval.' : 'पंजीकरण सफल! स्वीकृति का इंतजार है।');
    onLoginSuccess(registered);
  };

  const handleForgot = (e) => {
    e.preventDefault(); setError('');
    if (!db.getProviders().find(p => p.email && p.email.toLowerCase() === resetEmail.trim().toLowerCase())) {
      setError(lang === 'en' ? 'Email address not found.' : 'यह ईमेल उपलब्ध नहीं है।'); return;
    }
    setInfo(lang === 'en' ? 'OTP sent! Use code: 123456' : 'ओटीपी भेजा गया! कोड: 123456');
    setView('reset');
  };

  const handleReset = (e) => {
    e.preventDefault(); setError('');
    if (otp !== '123456') { setError(lang === 'en' ? 'Invalid OTP code.' : 'अमान्य ओटीपी।'); return; }
    if (!newPassword || newPassword.length < 4) { setError(lang === 'en' ? 'Min 4 characters.' : 'कम से कम 4 अक्षर।'); return; }
    const p = db.getProviders().find(p => p.email && p.email.toLowerCase() === resetEmail.trim().toLowerCase());
    if (p) {
      db.updateProvider(p.id, { password: newPassword });
      setInfo(lang === 'en' ? 'Password updated! Please login.' : 'पासवर्ड बदला गया!');
      setPassword(newPassword); setView('login');
    }
  };

  const Banners = () => (<>
    {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl p-3 text-center">⚠️ {error}</div>}
    {info  && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-2xl p-3 text-center">✓ {info}</div>}
  </>);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-[#F2F9F5]">

      {/* ── Green Hero ── */}
      <div className="relative shrink-0" style={{ background: G }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(27,94,59,0.5)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute top-10 right-4 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'rgba(110,231,183,0.07)' }} />

        {/* Back button */}
        {view !== 'login' && (
          <button onClick={() => go('login')}
            className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center active-press">
            <ChevronLeft size={18} strokeWidth={2} className="text-white" />
          </button>
        )}

        {/* Illustration (login only) */}
        <div className="relative z-10 pt-8 pb-4 flex flex-col items-center">
          <VillageSVG />
          {view === 'login' && (
            <p className="text-white/50 text-xs font-medium tracking-widest uppercase mt-2">
              {lang === 'en' ? 'Digital Panchayat Portal' : 'डिजिटल पंचायत पोर्टल'}
            </p>
          )}
          {view !== 'login' && (
            <p className="text-white font-bold text-lg mt-1">
              {view === 'register'   ? (lang === 'en' ? 'Lohari Jatu Portal' : 'लोहारी जाटू पोर्टल')   : ''}
              {view === 'forgot'     ? (lang === 'en' ? 'Forgot Password'     : 'पासवर्ड भूल गए')    : ''}
              {view === 'reset'      ? (lang === 'en' ? 'Reset Password'      : 'पासवर्ड रीसेट')      : ''}
              {view === 'superadmin' ? (lang === 'en' ? 'Admin Console'       : 'एडमिन कंसोल')       : ''}
            </p>
          )}
        </div>

        {/* Wave */}
        <div className="relative z-10">
          <Wave color="#F2F9F5" />
        </div>
      </div>

      {/* ── Form Area ── */}
      <div className="relative z-10 px-6 pb-10 flex-1">

        {view === 'login' && (<>
          <h2 className="text-2xl font-black text-[#0D2B1A] mb-1">
            {lang === 'en' ? 'Welcome Back' : 'वापसी पर स्वागत है'}
          </h2>
          <p className="text-sm text-gray-500 font-medium mb-6">
            {lang === 'en' ? 'Sign in to your village portal' : 'अपने ग्राम पोर्टल में साइन इन करें'}
          </p>
          <Banners />
          <form onSubmit={handleLogin} className="space-y-4">
            <Field icon={AtSign}>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={lang === 'en' ? 'Mobile Number or Email' : 'मोबाइल नंबर या ईमेल'} className={inputCls} />
            </Field>
            <Field icon={Lock}>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder={lang === 'en' ? 'Password' : 'पासवर्ड'} className={inputCls} />
            </Field>
            <div className="flex justify-end">
              <button type="button" onClick={() => go('forgot')}
                className="text-sm text-[#1B5E3B] font-semibold hover:underline underline-offset-2">
                {lang === 'en' ? 'Forgot Password?' : 'पासवर्ड भूल गए?'}
              </button>
            </div>
            <OBtn><span className="flex items-center justify-center gap-2"><LogIn size={16} /> {lang === 'en' ? 'Log In' : 'लॉगिन करें'}</span></OBtn>
          </form>
          <p className="text-center text-sm text-gray-400 font-medium mt-6">
            {lang === 'en' ? "Don't have an account?" : 'खाता नहीं है?'}{' '}
            <button onClick={() => go('register')} className="text-[#F97316] font-bold hover:underline underline-offset-2">
              {lang === 'en' ? 'Sign Up' : 'पंजीकरण करें'}
            </button>
          </p>
          <div className="mt-6 pt-5 border-t border-gray-200 text-center">
            <button onClick={() => go('superadmin')}
              className="text-xs text-gray-300 hover:text-gray-500 font-semibold tracking-widest uppercase">
              ⚙️ {lang === 'en' ? 'Admin Console' : 'एडमिन कंसोल'}
            </button>
          </div>
        </>)}

        {view === 'register' && (<>
          <h2 className="text-2xl font-black text-[#0D2B1A] mb-1">{lang === 'en' ? 'Create Account' : 'खाता बनाएं'}</h2>
          <p className="text-sm text-gray-500 font-medium mb-5">{lang === 'en' ? 'Register your local service listing' : 'अपनी स्थानीय सेवा सूचीबद्ध करें'}</p>
          <Banners />
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field icon={User}><input type="text" required value={nameEn} onChange={e=>setNameEn(e.target.value)} placeholder="Name (EN)" className={inputCls+' text-xs'}/></Field>
              <Field icon={User}><input type="text" required value={nameHi} onChange={e=>setNameHi(e.target.value)} placeholder="नाम (HI)" className={inputCls+' text-xs'}/></Field>
            </div>
            <Field icon={Phone}><input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" className={inputCls}/></Field>
            <Field icon={Mail}><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@example.com" className={inputCls}/></Field>
            <Field icon={Briefcase}>
              <select value={category} onChange={e=>setCategory(e.target.value)} className={inputCls+' appearance-none'}>
                <option value="doctors">{lang==='en'?'Doctor':'चिकित्सक'}</option>
                <option value="electricians">{lang==='en'?'Electrician':'बिजली मिस्त्री'}</option>
                <option value="plumbers">{lang==='en'?'Plumber':'प्लंबर'}</option>
                <option value="mechanics">{lang==='en'?'Mechanic':'मैकेनिक'}</option>
                <option value="barbers">{lang==='en'?'Barber':'नाई'}</option>
                <option value="internet">{lang==='en'?'Internet Provider':'इंटरनेट प्रदाता'}</option>
                <option value="parlor">{lang==='en'?'Beauty Parlor':'ब्यूटी पार्लर'}</option>
                <option value="photographer">{lang==='en'?'Photographer':'फोटोग्राफर'}</option>
                <option value="csc">{lang==='en'?'CSC Center':'सीएससी केंद्र'}</option>
                <option value="tuition">{lang==='en'?'Tutor':'ट्यूशन'}</option>
                <option value="blacksmith">{lang==='en'?'Blacksmith':'लोहार'}</option>
                <option value="goldsmith">{lang==='en'?'Goldsmith':'सुनार'}</option>
                <option value="carpenter">{lang==='en'?'Carpenter':'बढ़ई'}</option>
                <option value="painter">{lang==='en'?'Painter':'पेंटर'}</option>
              </select>
            </Field>
            <input type="text" value={wardNo} onChange={e=>setWardNo(e.target.value)} placeholder={lang==='en'?'Ward Number (optional)':'वार्ड नंबर (वैकल्पिक)'} className={inputPlain}/>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={addressEn} onChange={e=>setAddressEn(e.target.value)} placeholder="Address (EN)" className={inputPlain+' text-xs'}/>
              <input type="text" value={addressHi} onChange={e=>setAddressHi(e.target.value)} placeholder="पता (HI)" className={inputPlain+' text-xs'}/>
            </div>
            <Field icon={Lock}><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder={lang==='en'?'Password':'पासवर्ड'} className={inputCls}/></Field>
            <OBtn><span className="flex items-center justify-center gap-2"><UserPlus size={16}/>{lang==='en'?'Create Account':'खाता बनाएं'}</span></OBtn>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            {lang==='en'?'Already registered?':'पहले से पंजीकृत?'}{' '}
            <button onClick={()=>go('login')} className="text-[#F97316] font-bold">{lang==='en'?'Log In':'लॉगिन'}</button>
          </p>
        </>)}

        {view === 'forgot' && (<>
          <h2 className="text-2xl font-black text-[#0D2B1A] mb-1">{lang==='en'?'Forgot Password':'पासवर्ड भूल गए'}</h2>
          <p className="text-sm text-gray-500 mb-6">{lang==='en'?'Enter your registered email address':'अपना पंजीकृत ईमेल पता दर्ज करें'}</p>
          <Banners/>
          <form onSubmit={handleForgot} className="space-y-4">
            <Field icon={Mail}><input type="email" required value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="email@example.com" className={inputCls}/></Field>
            <OBtn><span className="flex items-center justify-center gap-2"><KeyRound size={16}/>{lang==='en'?'Send OTP':'OTP भेजें'}</span></OBtn>
          </form>
        </>)}

        {view === 'reset' && (<>
          <h2 className="text-2xl font-black text-[#0D2B1A] mb-1">{lang==='en'?'Reset Password':'पासवर्ड रीसेट'}</h2>
          <p className="text-sm text-gray-500 mb-6">{lang==='en'?'Enter OTP and new password':'OTP और नया पासवर्ड दर्ज करें'}</p>
          <Banners/>
          <form onSubmit={handleReset} className="space-y-4">
            <input type="text" required value={otp} onChange={e=>setOtp(e.target.value)} placeholder="6-digit OTP" className={inputPlain+' text-center font-mono font-bold tracking-widest'}/>
            <Field icon={Lock}><input type="password" required value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder={lang==='en'?'New Password':'नया पासवर्ड'} className={inputCls}/></Field>
            <OBtn>{lang==='en'?'Update Password':'पासवर्ड अपडेट करें'}</OBtn>
          </form>
        </>)}

        {view === 'superadmin' && (<>
          <div className="w-16 h-16 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={30} className="text-[#1B5E3B]" />
          </div>
          <h2 className="text-xl font-black text-[#0D2B1A] text-center mb-1">{lang==='en'?'Admin Console':'एडमिन कंसोल'}</h2>
          <p className="text-sm text-gray-500 text-center mb-6">{lang==='en'?'Administrative access only':'केवल प्रशासनिक पहुंच'}</p>
          <Banners/>
          <form onSubmit={handleSuperAdminLogin} className="space-y-4">
            <Field icon={User}><input type="text" required value={adminUser} onChange={e=>setAdminUser(e.target.value)} placeholder={lang==='en'?'Admin Username':'एडमिन यूज़रनेम'} className={inputCls}/></Field>
            <Field icon={Lock}><input type="password" required value={adminPass} onChange={e=>setAdminPass(e.target.value)} placeholder={lang==='en'?'Admin Password':'एडमिन पासवर्ड'} className={inputCls}/></Field>
            <OBtn><span className="flex items-center justify-center gap-2"><ShieldCheck size={16}/>{lang==='en'?'Verify Session':'सत्यापित करें'}</span></OBtn>
          </form>
        </>)}

      </div>
    </div>
  );
}
