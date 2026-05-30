import React, { useState, useRef } from 'react';
import { db } from '../data/db';
import { translations } from '../data/translations';
import {
  ShieldCheck, LogOut, Trash2, Plus, Pencil, Upload, ImagePlus,
  Megaphone, MessageSquare, Award, Users, Wrench, GraduationCap, X, Check, Briefcase,
  BadgeCheck, FileText, Calendar, User
} from 'lucide-react';

const compressImage = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 900;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.78));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

export default function SuperAdmin({ lang, onLogout }) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('announcements');

  const categoryIcons = {
    doctors: '🩺', electricians: '⚡', plumbers: '🔧', mechanics: '🚜',
    barbers: '💈', internet: '🌐', parlor: '💇‍♀️', photographer: '📷',
    csc: '🖥️', tuition: '📚', blacksmith: '⚒️', goldsmith: '💍',
    sports: '🏆', carpenter: '🪚', painter: '🎨'
  };

  const [announcements, setAnnouncements] = useState(db.getAnnouncements());
  const [news, setNews] = useState(db.getNews());
  const [schemes, setSchemes] = useState(db.getSchemes());
  const [leaders, setLeaders] = useState(db.getLeaders());
  const [providers, setProviders] = useState(db.getProviders());
  const [schools, setSchools] = useState(db.getSchools());
  const [jobs, setJobs] = useState(db.getJobs());

  const [kycProviders,       setKycProviders]       = useState(db.getPendingKYCProviders());
  const [kycRejectTarget,    setKycRejectTarget]    = useState(null);
  const [kycRejectNote,      setKycRejectNote]      = useState('');
  const [showKYCRejectModal, setShowKYCRejectModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [formFields, setFormFields] = useState({});

  const addNewsImgRef  = useRef(null);
  const editNewsImgRef = useRef(null);

  const [showEditNewsModal, setShowEditNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [editNewsFields, setEditNewsFields] = useState({});

  const openEditNews = (item) => {
    setEditingNews(item);
    setEditNewsFields({
      titleEn: item.title.en, titleHi: item.title.hi,
      catEn: item.category.en, catHi: item.category.hi,
      authorEn: item.author.en, authorHi: item.author.hi,
      descEn: item.desc.en, descHi: item.desc.hi,
      image: item.image
    });
    setShowEditNewsModal(true);
  };

  const handleEditNewsSubmit = (e) => {
    e.preventDefault();
    db.updateNews(editingNews.id, {
      title: { en: editNewsFields.titleEn, hi: editNewsFields.titleHi },
      category: { en: editNewsFields.catEn, hi: editNewsFields.catHi },
      author: { en: editNewsFields.authorEn, hi: editNewsFields.authorHi },
      desc: { en: editNewsFields.descEn, hi: editNewsFields.descHi },
      image: editNewsFields.image || editingNews.image
    });
    refreshAllData();
    setShowEditNewsModal(false);
    setEditingNews(null);
  };

  const refreshAllData = () => {
    setAnnouncements(db.getAnnouncements());
    setNews(db.getNews());
    setSchemes(db.getSchemes());
    setLeaders(db.getLeaders());
    setProviders(db.getProviders());
    setSchools(db.getSchools());
    setJobs(db.getJobs());
    setKycProviders(db.getPendingKYCProviders());
  };

  const handleApproveKYC = (id) => {
    db.approveKYC(id);
    refreshAllData();
  };

  const handleRejectKYC = () => {
    if (!kycRejectNote.trim()) return;
    db.rejectKYC(kycRejectTarget, kycRejectNote.trim());
    setShowKYCRejectModal(false);
    setKycRejectTarget(null);
    setKycRejectNote('');
    refreshAllData();
  };

  const handleDelete = (id, type) => {
    if (confirm(lang === 'en' ? 'Are you sure you want to delete this entry?' : 'क्या आप वाकई इस प्रविष्टि को हटाना चाहते हैं?')) {
      if (type === 'announcements') db.deleteAnnouncement(id);
      if (type === 'news') db.deleteNews(id);
      if (type === 'schemes') db.deleteScheme(id);
      if (type === 'leaders') db.deleteLeader(id);
      if (type === 'providers') db.rejectProvider(id);
      if (type === 'schools') db.deleteSchool(id);
      if (type === 'jobs') db.deleteJob(id);
      refreshAllData();
    }
  };

  const handleApproveProvider = (id) => {
    db.approveProvider(id);
    refreshAllData();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'announcements') {
      db.addAnnouncement({
        title: { en: formFields.titleEn, hi: formFields.titleHi },
        desc: { en: formFields.descEn, hi: formFields.descHi },
        date: { en: "Just Now", hi: "अभी" },
        badge: { en: formFields.badgeEn.toUpperCase(), hi: formFields.badgeHi }
      });
    } else if (activeTab === 'news') {
      db.addNews({
        category: { en: formFields.catEn, hi: formFields.catHi },
        title: { en: formFields.titleEn, hi: formFields.titleHi },
        desc: { en: formFields.descEn, hi: formFields.descHi },
        author: { en: formFields.authorEn, hi: formFields.authorHi },
        date: { en: "Just Now", hi: "अभी" },
        image: formFields.image || 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600'
      });
    } else if (activeTab === 'schemes') {
      db.addScheme({
        name: { en: formFields.nameEn, hi: formFields.nameHi },
        category: formFields.category || 'agriculture',
        benefits: { en: formFields.benefitsEn, hi: formFields.benefitsHi },
        eligibility: { en: formFields.eligibilityEn, hi: formFields.eligibilityHi },
        department: { en: formFields.deptEn, hi: formFields.deptHi }
      });
    } else if (activeTab === 'leaders') {
      db.addLeader({
        name: { en: formFields.nameEn, hi: formFields.nameHi },
        role: { en: formFields.roleEn, hi: formFields.roleHi },
        phone: formFields.phone,
        whatsapp: formFields.whatsapp,
        ward: { en: formFields.wardEn, hi: formFields.wardHi },
        image: formFields.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
      });
    } else if (activeTab === 'schools') {
      db.addSchool({
        type: formFields.type || 'primary',
        name: { en: formFields.nameEn, hi: formFields.nameHi },
        principal: { en: formFields.principalEn, hi: formFields.principalHi },
        phone: formFields.phone,
        hours: { en: formFields.hoursEn, hi: formFields.hoursHi },
        announcement: { en: formFields.announceEn, hi: formFields.announceHi },
        location: { en: formFields.locEn, hi: formFields.locHi }
      });
    } else if (activeTab === 'jobs') {
      db.addJob({
        title: { en: formFields.titleEn, hi: formFields.titleHi },
        department: { en: formFields.deptEn, hi: formFields.deptHi },
        vacancies: { en: formFields.vacEn, hi: formFields.vacHi },
        eligibility: { en: formFields.eligEn, hi: formFields.eligHi },
        lastDate: { en: formFields.lastDateEn, hi: formFields.lastDateHi },
        link: formFields.link || "https://hssc.gov.in"
      });
    }

    refreshAllData();
    setShowAddModal(false);
    setFormFields({});
  };

  const inputCls = "form-input w-full text-sm";
  const labelCls = "form-label block mb-1.5";

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#FAF7F2]">

      {/* Dark header banner */}
      <div
        className="px-5 pt-4 pb-4 shrink-0 select-none"
        style={{ background: 'linear-gradient(160deg, #1A0F05 0%, #3D2008 35%, #7A4E1A 65%, #C8973A 100%)' }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-gold/15 border border-amber-gold/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} strokeWidth={1.5} className="text-amber-gold" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                {lang === 'en' ? 'Super Admin Console' : 'सुपर एडमिन कंसोल'}
              </h2>
              <p className="text-[9px] text-white/50 font-medium uppercase tracking-widest mt-0.5">
                {lang === 'en' ? 'Panchayat Management Portal' : 'पंचायत प्रबंधन पोर्टल'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="active-press flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-red-500/20 hover:text-red-300 text-xs font-medium transition-all"
          >
            <LogOut size={12} strokeWidth={1.5} />
            <span>{lang === 'en' ? 'Exit' : 'बाहर'}</span>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0 select-none bg-white border-b border-[#E8E0D4] shadow-sm">
        {[
          { id: 'announcements', label: lang === 'en' ? 'Alerts' : 'घोषणाएं', icon: Megaphone },
          { id: 'news', label: lang === 'en' ? 'Village Update' : 'ग्राम अपडेट', icon: MessageSquare },
          { id: 'schemes', label: lang === 'en' ? 'Schemes' : 'योजनाएं', icon: Award },
          { id: 'leaders', label: lang === 'en' ? 'Leaders' : 'प्रतिनिधि', icon: Users },
          { id: 'providers', label: lang === 'en' ? 'Providers' : 'सेवाएं', icon: Wrench },
          { id: 'schools', label: lang === 'en' ? 'Schools' : 'स्कूल', icon: GraduationCap },
          { id: 'jobs', label: lang === 'en' ? 'Jobs' : 'नौकरियां', icon: Briefcase },
          { id: 'kyc',  label: lang === 'en' ? 'KYC' : 'केवाईसी',  icon: BadgeCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`active-press flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                isActive
                  ? 'bg-forest-teal-700 border-forest-teal-700 text-white shadow-md shadow-forest-teal-700/20'
                  : 'bg-[#FAF7F2] border-[#E8E0D4] text-[#8A7560] hover:bg-[#F5ECD8] hover:text-slate-700'
              }`}
            >
              <Icon size={11} strokeWidth={1.5} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section action bar */}
      <div className="px-5 py-2.5 flex justify-between items-center bg-[#F5ECD8] border-b border-[#E8E0D4] select-none shrink-0">
        <span className="text-[10px] font-bold text-[#8A7560] uppercase tracking-widest">
          {lang === 'en' ? `Manage ${activeTab}` : `${activeTab} प्रबंधित करें`}
        </span>
        {activeTab !== 'providers' && activeTab !== 'kyc' && (
          <button
            onClick={() => { setFormFields({}); setShowAddModal(true); }}
            className="active-press flex items-center gap-1 px-3 py-1.5 bg-forest-teal-700 hover:bg-forest-teal-600 text-white font-bold text-[10px] rounded-full tracking-wider transition-colors shadow-sm"
          >
            <Plus size={11} strokeWidth={2} />
            <span>{lang === 'en' ? 'ADD NEW' : 'नया जोड़ें'}</span>
          </button>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3 bg-[#FAF7F2]">

        {/* A. ANNOUNCEMENTS */}
        {activeTab === 'announcements' && announcements.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {item.badge[lang]}
              </span>
              <h4 className="text-sm font-bold text-[#2D1F0E] mt-1.5 truncate">{item.title[lang]}</h4>
              <p className="text-xs text-[#8A7560] truncate mt-0.5">{item.desc[lang]}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id, 'announcements')}
              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-100 transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* B. VILLAGE UPDATE */}
        {activeTab === 'news' && news.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl overflow-hidden shadow-sm">
            {/* Cover image */}
            {item.image && (
              <div className="w-full h-32 overflow-hidden bg-[#F5ECD8]">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4">
              {/* Category + date row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
                  {item.category[lang]}
                </span>
                <span className="text-[9px] text-[#8A7560] flex items-center gap-1">
                  <Calendar size={9} /> {item.date[lang]}
                </span>
              </div>
              {/* Title */}
              <h4 className="text-sm font-black text-[#0D2B1A] leading-snug mb-1.5 line-clamp-2">
                {item.title[lang]}
              </h4>
              {/* Description */}
              <p className="text-[11px] text-[#8A7560] leading-relaxed line-clamp-2 mb-3">
                {item.desc[lang]}
              </p>
              {/* Author */}
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-5 h-5 rounded-full bg-[#F5ECD8] border border-[#E8D5C0] flex items-center justify-center shrink-0">
                  <User size={10} className="text-[#8A7560]" />
                </div>
                <span className="text-[10px] text-[#8A7560] font-semibold truncate">{item.author[lang]}</span>
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-[#F0E8DC]">
                <button
                  onClick={() => openEditNews(item)}
                  className="active-press flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#F2F9F5] border border-[#D4EBD9] text-[#0F3D27] text-xs font-bold transition-colors hover:bg-[#D4EBD9]"
                >
                  <Pencil size={12} strokeWidth={2} />
                  {lang === 'en' ? 'Edit' : 'संपादित करें'}
                </button>
                <button
                  onClick={() => handleDelete(item.id, 'news')}
                  className="active-press flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-red-50 border border-red-100 text-red-500 text-xs font-bold transition-colors hover:bg-red-100"
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  {lang === 'en' ? 'Delete' : 'हटाएं'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* C. SCHEMES */}
        {activeTab === 'schemes' && schemes.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                {item.category.toUpperCase()}
              </span>
              <h4 className="text-sm font-bold text-[#2D1F0E] mt-1.5 truncate">{item.name[lang]}</h4>
              <p className="text-xs text-[#8A7560] truncate mt-0.5">🏢 {item.department[lang]}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id, 'schemes')}
              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-100 transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* D. LEADERS */}
        {activeTab === 'leaders' && leaders.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full border border-[#E8E0D4] bg-[#F5ECD8] flex items-center justify-center text-lg shrink-0">
                👤
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[#2D1F0E] truncate">{item.name[lang]}</h4>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">{item.role[lang]}</p>
                <p className="text-xs text-[#8A7560] truncate mt-0.5">📞 {item.phone} • 📍 {item.ward[lang]}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(item.id, 'leaders')}
              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-100 transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* E. PROVIDERS MODERATION */}
        {activeTab === 'providers' && providers.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-center gap-4 w-full">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl border border-[#E8E0D4] bg-[#F5ECD8] flex items-center justify-center text-lg shrink-0">
                  {categoryIcons[item.category] || '👤'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="text-sm font-bold text-[#2D1F0E] truncate">{item.name[lang]}</h4>
                    {item.status === 'approved' ? (
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-lg">LIVE</span>
                    ) : (
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-lg">PENDING</span>
                    )}
                  </div>
                  <p className="text-[9px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">🛠️ {item.category.toUpperCase()}</p>
                  <p className="text-xs text-[#8A7560] mt-0.5">📞 {item.phone} • {item.experience[lang]}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleApproveProvider(item.id)}
                    className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 transition-colors"
                    title="Approve"
                  >
                    <Check size={14} strokeWidth={2} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id, 'providers')}
                  className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center border border-red-100 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Audit work photo */}
            {(item.workImages?.[0] || item.workImage) && (
              <div className="border-t border-slate-100 pt-2.5">
                <p className="text-[8px] font-bold text-amber-600 uppercase tracking-wider mb-1">
                  ⚠️ Audit Photo:
                </p>
                <div className="rounded-xl overflow-hidden border border-[#E8E0D4] bg-[#F5ECD8] aspect-video max-h-36">
                  <img
                    src={item.workImages?.[0] || item.workImage}
                    alt="Audit"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* F. SCHOOLS */}
        {activeTab === 'schools' && schools.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">
                {item.type.toUpperCase()}
              </span>
              <h4 className="text-sm font-bold text-[#2D1F0E] mt-1.5 truncate">{item.name[lang]}</h4>
              <p className="text-xs text-[#8A7560] truncate mt-0.5">👤 {item.principal[lang]}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id, 'schools')}
              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-100 transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* G. JOBS */}
        {activeTab === 'jobs' && jobs.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex justify-between items-center gap-4 shadow-sm">
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                {item.department[lang]}
              </span>
              <h4 className="text-sm font-bold text-[#2D1F0E] mt-1.5 truncate">{item.title[lang]}</h4>
              <p className="text-xs text-[#8A7560] truncate mt-0.5">👥 {item.vacancies[lang]} | {item.eligibility[lang]}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id, 'jobs')}
              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-100 transition-colors"
            >
              <Trash2 size={14} strokeWidth={1.5} />
            </button>
          </div>
        ))}

        {/* H. KYC MODERATION */}
        {activeTab === 'kyc' && kycProviders.map((item) => (
          <div key={item.id} className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full border border-[#E8E0D4] bg-[#F5ECD8] flex items-center justify-center overflow-hidden shrink-0 text-xl">
                {item.profilePhoto
                  ? <img src={item.profilePhoto} alt="" className="w-full h-full object-cover" />
                  : categoryIcons[item.category] || '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#2D1F0E] truncate">{item.name[lang]}</h4>
                <p className="text-[9px] font-bold text-sky-600 uppercase tracking-wider mt-0.5">🛠️ {item.category.toUpperCase()}</p>
                <p className="text-xs text-[#8A7560] mt-0.5">📞 {item.phone}</p>
              </div>
              <span className="text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-lg shrink-0 self-start">
                {item.kycDocType?.toUpperCase() || 'DOC'}
              </span>
            </div>

            {item.kycDocument && (
              <div className="border border-[#E8E0D4] rounded-xl overflow-hidden bg-[#FAF7F2] aspect-video">
                <img src={item.kycDocument} alt="KYC Document" className="w-full h-full object-contain" loading="lazy" />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleApproveKYC(item.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-colors shadow-sm"
              >
                <Check size={13} strokeWidth={2} />
                {lang === 'en' ? 'Approve KYC' : 'स्वीकृत करें'}
              </button>
              <button
                onClick={() => { setKycRejectTarget(item.id); setKycRejectNote(''); setShowKYCRejectModal(true); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-500 text-xs font-bold rounded-full transition-colors"
              >
                <X size={13} strokeWidth={2} />
                {lang === 'en' ? 'Reject' : 'अस्वीकार'}
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {((activeTab === 'announcements' && announcements.length === 0) ||
          (activeTab === 'news' && news.length === 0) ||
          (activeTab === 'schemes' && schemes.length === 0) ||
          (activeTab === 'leaders' && leaders.length === 0) ||
          (activeTab === 'providers' && providers.length === 0) ||
          (activeTab === 'schools' && schools.length === 0) ||
          (activeTab === 'jobs' && jobs.length === 0) ||
          (activeTab === 'kyc' && kycProviders.length === 0)) && (
          <div className="text-center py-12 text-slate-400 font-semibold text-xs">
            📭 {lang === 'en' ? 'No items in this collection.' : 'इस श्रेणी में कोई प्रविष्टि नहीं है।'}
          </div>
        )}
      </div>

      {/* KYC REJECT MODAL */}
      {showKYCRejectModal && (
        <div className="absolute inset-0 bg-[#2D1F0E]/70 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white border border-[#E8E0D4] rounded-2xl w-full max-w-sm p-5 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2D1F0E] uppercase tracking-wider">
                {lang === 'en' ? 'Reject KYC' : 'KYC अस्वीकार करें'}
              </h3>
              <button type="button" onClick={() => setShowKYCRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-1">
              <label className={labelCls}>{lang === 'en' ? 'Rejection Reason (required)' : 'अस्वीकृति कारण (आवश्यक)'}</label>
              <textarea
                rows={3}
                value={kycRejectNote}
                onChange={e => setKycRejectNote(e.target.value)}
                placeholder={lang === 'en' ? 'e.g. Document is blurry or invalid...' : 'उदा. दस्तावेज़ धुंधला या अमान्य है...'}
                className={inputCls}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowKYCRejectModal(false)}
                className="form-button secondary flex-1">
                {lang === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button onClick={handleRejectKYC}
                disabled={!kycRejectNote.trim()}
                className="form-button flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors">
                {lang === 'en' ? 'Reject KYC' : 'अस्वीकार करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FORM MODAL */}
      {showAddModal && (
        <div className="absolute inset-0 bg-[#2D1F0E]/70 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto">
          <div className="bg-white border border-[#E8E0D4] rounded-3xl w-full max-w-sm flex flex-col max-h-[92%] overflow-hidden shadow-2xl">
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center select-none bg-[#FAF7F2] shrink-0 rounded-t-3xl">
              <h3 className="text-sm font-bold text-[#2D1F0E] uppercase tracking-wider">
                {lang === 'en' ? `Add ${activeTab}` : `नया ${activeTab} जोड़ें`}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleAddSubmit} className="p-5 overflow-y-auto no-scrollbar flex-1 space-y-4">

              {/* Announcement */}
              {activeTab === 'announcements' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Title (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleEn: e.target.value})} className={inputCls} placeholder="e.g. Pipeline Repair" /></div>
                    <div className="space-y-1"><label className={labelCls}>शीर्षक (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleHi: e.target.value})} className={inputCls} placeholder="उदा. पाइपलाइन मरम्मत" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Badge (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, badgeEn: e.target.value})} className={inputCls} placeholder="e.g. WATER" /></div>
                    <div className="space-y-1"><label className={labelCls}>टैग (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, badgeHi: e.target.value})} className={inputCls} placeholder="उदा. जल आपूर्ति" /></div>
                  </div>
                  <div className="space-y-1"><label className={labelCls}>Description (EN)</label><textarea required onChange={(e) => setFormFields({...formFields, descEn: e.target.value})} rows="2" className={inputCls} placeholder="Details..."></textarea></div>
                  <div className="space-y-1"><label className={labelCls}>विवरण (HI)</label><textarea required onChange={(e) => setFormFields({...formFields, descHi: e.target.value})} rows="2" className={inputCls} placeholder="विवरण..."></textarea></div>
                </>
              )}

              {/* News */}
              {activeTab === 'news' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Title (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>शीर्षक (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Category (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, catEn: e.target.value})} className={inputCls} placeholder="Healthcare" /></div>
                    <div className="space-y-1"><label className={labelCls}>श्रेणी (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, catHi: e.target.value})} className={inputCls} placeholder="स्वास्थ्य" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Author (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, authorEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>लेखक (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, authorHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  {/* Image upload */}
                  <div className="space-y-1">
                    <label className={labelCls}>{lang === 'en' ? 'Feature Image' : 'फ़ीचर छवि'}</label>
                    <div
                      onClick={() => addNewsImgRef.current.click()}
                      className="relative w-full h-36 rounded-2xl border-2 border-dashed border-[#D4EBD9] bg-[#F2F9F5] flex flex-col items-center justify-center cursor-pointer hover:border-[#1B5E3B] transition-colors overflow-hidden"
                    >
                      {formFields.image ? (
                        <>
                          <img src={formFields.image} alt="" className="w-full h-full object-cover" />
                          <button type="button"
                            onClick={e => { e.stopPropagation(); setFormFields({...formFields, image: ''}); }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center">
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <ImagePlus size={22} className="text-[#52786A] mb-1.5" />
                          <span className="text-xs font-bold text-[#52786A]">{lang === 'en' ? 'Tap to upload photo' : 'फोटो अपलोड करें'}</span>
                          <span className="text-[10px] text-[#92B4A4] mt-0.5">JPG · PNG · WEBP</span>
                        </>
                      )}
                    </div>
                    <input ref={addNewsImgRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files[0]; if (f) compressImage(f, url => setFormFields({...formFields, image: url})); e.target.value = ''; }} />
                  </div>
                  <div className="space-y-1"><label className={labelCls}>Description (EN)</label><textarea required onChange={(e) => setFormFields({...formFields, descEn: e.target.value})} rows="2" className={inputCls}></textarea></div>
                  <div className="space-y-1"><label className={labelCls}>विवरण (HI)</label><textarea required onChange={(e) => setFormFields({...formFields, descHi: e.target.value})} rows="2" className={inputCls}></textarea></div>
                </>
              )}

              {/* Schemes */}
              {activeTab === 'schemes' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Scheme Name (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>योजना का नाम (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Department (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, deptEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>विभाग (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, deptHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Scheme Category</label>
                    <select onChange={(e) => setFormFields({...formFields, category: e.target.value})} className={inputCls}>
                      <option value="agriculture">Agriculture / खेती</option>
                      <option value="housing">Housing / आवास</option>
                      <option value="healthcare">Healthcare / स्वास्थ्य</option>
                      <option value="education">Education / शिक्षा</option>
                    </select>
                  </div>
                  <div className="space-y-1"><label className={labelCls}>Benefits (EN)</label><textarea required onChange={(e) => setFormFields({...formFields, benefitsEn: e.target.value})} rows="2" className={inputCls}></textarea></div>
                  <div className="space-y-1"><label className={labelCls}>लाभ (HI)</label><textarea required onChange={(e) => setFormFields({...formFields, benefitsHi: e.target.value})} rows="2" className={inputCls}></textarea></div>
                  <div className="space-y-1"><label className={labelCls}>Eligibility (EN)</label><textarea required onChange={(e) => setFormFields({...formFields, eligibilityEn: e.target.value})} rows="2" className={inputCls}></textarea></div>
                  <div className="space-y-1"><label className={labelCls}>पात्रता (HI)</label><textarea required onChange={(e) => setFormFields({...formFields, eligibilityHi: e.target.value})} rows="2" className={inputCls}></textarea></div>
                </>
              )}

              {/* Leaders */}
              {activeTab === 'leaders' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Name (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>नाम (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Role (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, roleEn: e.target.value})} className={inputCls} placeholder="Ward Member" /></div>
                    <div className="space-y-1"><label className={labelCls}>पद (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, roleHi: e.target.value})} className={inputCls} placeholder="वार्ड सदस्य" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Phone</label><input type="tel" required onChange={(e) => setFormFields({...formFields, phone: e.target.value})} className={inputCls} placeholder="+9198765..." /></div>
                    <div className="space-y-1"><label className={labelCls}>WhatsApp</label><input type="text" required onChange={(e) => setFormFields({...formFields, whatsapp: e.target.value})} className={inputCls} placeholder="9198765..." /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Ward (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, wardEn: e.target.value})} className={inputCls} placeholder="Ward No. 4" /></div>
                    <div className="space-y-1"><label className={labelCls}>वार्ड (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, wardHi: e.target.value})} className={inputCls} placeholder="वार्ड संख्या 4" /></div>
                  </div>
                  <div className="space-y-1"><label className={labelCls}>Photo URL</label><input type="text" onChange={(e) => setFormFields({...formFields, image: e.target.value})} className={inputCls} placeholder="https://..." /></div>
                </>
              )}

              {/* Schools */}
              {activeTab === 'schools' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>School Name (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>स्कूल का नाम (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, nameHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Principal (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, principalEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>प्राचार्य (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, principalHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Hours (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, hoursEn: e.target.value})} className={inputCls} placeholder="9 AM - 3 PM" /></div>
                    <div className="space-y-1"><label className={labelCls}>समय (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, hoursHi: e.target.value})} className={inputCls} placeholder="9 AM - 3 PM" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Location (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, locEn: e.target.value})} className={inputCls} /></div>
                    <div className="space-y-1"><label className={labelCls}>स्थान (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, locHi: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={labelCls}>School Type</label>
                      <select onChange={(e) => setFormFields({...formFields, type: e.target.value})} className={inputCls}>
                        <option value="anganwadi">Anganwadi</option>
                        <option value="primary">Primary</option>
                        <option value="high">High School</option>
                        <option value="library">Library</option>
                      </select>
                    </div>
                    <div className="space-y-1"><label className={labelCls}>Phone</label><input type="tel" required onChange={(e) => setFormFields({...formFields, phone: e.target.value})} className={inputCls} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Alert (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, announceEn: e.target.value})} className={inputCls} placeholder="Free uniform..." /></div>
                    <div className="space-y-1"><label className={labelCls}>अनाउंसमेंट (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, announceHi: e.target.value})} className={inputCls} placeholder="निशुल्क ड्रेस..." /></div>
                  </div>
                </>
              )}

              {/* Jobs */}
              {activeTab === 'jobs' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Job Title (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleEn: e.target.value})} className={inputCls} placeholder="Constable Recruitment" /></div>
                    <div className="space-y-1"><label className={labelCls}>नौकरी शीर्षक (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, titleHi: e.target.value})} className={inputCls} placeholder="कांस्टेबल भर्ती" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Department (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, deptEn: e.target.value})} className={inputCls} placeholder="Haryana Police" /></div>
                    <div className="space-y-1"><label className={labelCls}>विभाग (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, deptHi: e.target.value})} className={inputCls} placeholder="हरियाणा पुलिस" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Vacancies (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, vacEn: e.target.value})} className={inputCls} placeholder="5,000 Posts" /></div>
                    <div className="space-y-1"><label className={labelCls}>रिक्तियां (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, vacHi: e.target.value})} className={inputCls} placeholder="5,000 पद" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Eligibility (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, eligEn: e.target.value})} className={inputCls} placeholder="12th Pass" /></div>
                    <div className="space-y-1"><label className={labelCls}>पात्रता (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, eligHi: e.target.value})} className={inputCls} placeholder="12वीं पास" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><label className={labelCls}>Last Date (EN)</label><input type="text" required onChange={(e) => setFormFields({...formFields, lastDateEn: e.target.value})} className={inputCls} placeholder="June 25, 2026" /></div>
                    <div className="space-y-1"><label className={labelCls}>अंतिम तिथि (HI)</label><input type="text" required onChange={(e) => setFormFields({...formFields, lastDateHi: e.target.value})} className={inputCls} placeholder="25 जून 2026" /></div>
                  </div>
                  <div className="space-y-1"><label className={labelCls}>Apply Link / URL</label><input type="text" onChange={(e) => setFormFields({...formFields, link: e.target.value})} className={inputCls} placeholder="https://hssc.gov.in" defaultValue="https://hssc.gov.in" /></div>
                </>
              )}

              <button
                type="submit"
                className="form-button primary w-full mt-4 flex items-center justify-center gap-2"
              >
                <Plus size={14} strokeWidth={2} />
                {lang === 'en' ? 'ADD TO DIRECTORY' : 'सूची में जोड़ें'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT NEWS MODAL */}
      {showEditNewsModal && editingNews && (
        <div className="absolute inset-0 bg-[#0D2B1A]/75 backdrop-blur-sm z-50 flex items-center justify-center p-5 overflow-y-auto">
          <div className="bg-white border border-[#E8E0D4] rounded-3xl w-full max-w-sm flex flex-col max-h-[92%] overflow-hidden shadow-2xl">
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-[#F2F9F5] rounded-t-3xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1B5E3B]/10 border border-[#1B5E3B]/20 flex items-center justify-center">
                  <Pencil size={14} strokeWidth={2} className="text-[#1B5E3B]" />
                </div>
                <h3 className="text-sm font-black text-[#0D2B1A] uppercase tracking-wide">
                  {lang === 'en' ? 'Edit Village Update' : 'ग्राम अपडेट संपादित करें'}
                </h3>
              </div>
              <button onClick={() => setShowEditNewsModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Edit form */}
            <form onSubmit={handleEditNewsSubmit} className="p-5 overflow-y-auto no-scrollbar flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelCls}>Title (EN)</label>
                  <input type="text" required value={editNewsFields.titleEn} onChange={e => setEditNewsFields({...editNewsFields, titleEn: e.target.value})} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>शीर्षक (HI)</label>
                  <input type="text" required value={editNewsFields.titleHi} onChange={e => setEditNewsFields({...editNewsFields, titleHi: e.target.value})} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelCls}>Category (EN)</label>
                  <input type="text" required value={editNewsFields.catEn} onChange={e => setEditNewsFields({...editNewsFields, catEn: e.target.value})} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>श्रेणी (HI)</label>
                  <input type="text" required value={editNewsFields.catHi} onChange={e => setEditNewsFields({...editNewsFields, catHi: e.target.value})} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelCls}>Author (EN)</label>
                  <input type="text" required value={editNewsFields.authorEn} onChange={e => setEditNewsFields({...editNewsFields, authorEn: e.target.value})} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>लेखक (HI)</label>
                  <input type="text" required value={editNewsFields.authorHi} onChange={e => setEditNewsFields({...editNewsFields, authorHi: e.target.value})} className={inputCls} />
                </div>
              </div>
              {/* Image upload */}
              <div className="space-y-1">
                <label className={labelCls}>{lang === 'en' ? 'Feature Image' : 'फ़ीचर छवि'}</label>
                <div
                  onClick={() => editNewsImgRef.current.click()}
                  className="relative w-full h-36 rounded-2xl border-2 border-dashed border-[#D4EBD9] bg-[#F2F9F5] flex flex-col items-center justify-center cursor-pointer hover:border-[#1B5E3B] transition-colors overflow-hidden"
                >
                  {editNewsFields.image ? (
                    <>
                      <img src={editNewsFields.image} alt="" className="w-full h-full object-cover" />
                      <button type="button"
                        onClick={e => { e.stopPropagation(); setEditNewsFields({...editNewsFields, image: ''}); }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/55 text-white flex items-center justify-center">
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={22} className="text-[#52786A] mb-1.5" />
                      <span className="text-xs font-bold text-[#52786A]">{lang === 'en' ? 'Tap to upload photo' : 'फोटो अपलोड करें'}</span>
                      <span className="text-[10px] text-[#92B4A4] mt-0.5">JPG · PNG · WEBP</span>
                    </>
                  )}
                </div>
                <input ref={editNewsImgRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (f) compressImage(f, url => setEditNewsFields({...editNewsFields, image: url})); e.target.value = ''; }} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Description (EN)</label>
                <textarea required rows="3" value={editNewsFields.descEn} onChange={e => setEditNewsFields({...editNewsFields, descEn: e.target.value})} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className={labelCls}>विवरण (HI)</label>
                <textarea required rows="3" value={editNewsFields.descHi} onChange={e => setEditNewsFields({...editNewsFields, descHi: e.target.value})} className={inputCls} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditNewsModal(false)}
                  className="form-button secondary flex-1">
                  {lang === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button type="submit" className="form-button primary flex-1">
                  {lang === 'en' ? 'Save Changes' : 'सहेजें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
