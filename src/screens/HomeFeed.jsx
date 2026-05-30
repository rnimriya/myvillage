import React, { useState } from 'react';
import { Bell, MapPin, Users, FileText, Wrench, GraduationCap, Briefcase, ImageIcon, Calendar, ChevronDown, ChevronUp, BookOpen, Search, ExternalLink, CheckCircle2 } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

const G = 'linear-gradient(160deg, #082318 0%, #0F3D27 55%, #1B5E3B 100%)';

const Wave = () => (
  <svg viewBox="0 0 390 36" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
    style={{ display: 'block', width: '100%', height: 36 }}>
    <path d="M0,36 C80,8 200,28 300,10 C350,2 370,18 390,4 L390,36 Z" fill="#F2F9F5"/>
  </svg>
);

const catBadge = {
  heritage:    'bg-purple-100 text-purple-700',
  development: 'bg-green-100 text-green-800',
  healthcare:  'bg-red-100 text-red-700',
  education:   'bg-indigo-100 text-indigo-700',
  water:       'bg-blue-100 text-blue-700',
  agriculture: 'bg-yellow-100 text-yellow-800',
};

const ANN_META = {
  water:       { g: 'linear-gradient(135deg,#0ea5e9,#0369a1)', emoji: '💧' },
  agriculture: { g: 'linear-gradient(135deg,#16a34a,#14532d)', emoji: '🌾' },
  heritage:    { g: 'linear-gradient(135deg,#7c3aed,#4c1d95)', emoji: '🏛️' },
  healthcare:  { g: 'linear-gradient(135deg,#dc2626,#991b1b)', emoji: '🏥' },
  education:   { g: 'linear-gradient(135deg,#2563eb,#1e40af)', emoji: '🎓' },
  development: { g: 'linear-gradient(135deg,#0f766e,#134e4a)', emoji: '🏗️' },
};

const SL = ({ label }) => (
  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1B5E3B] mb-3 select-none">{label}</p>
);

export default function HomeFeed({ lang, onNavigate }) {
  const t = translations[lang];
  const [expandedNews, setExpandedNews] = useState(null);

  const announcements = db.getAnnouncements();
  const newsList      = db.getNews();
  const jobsList      = db.getJobs();

  const menuItems = [
    { id: 'directory', label: lang==='en'?'Members':'सदस्य',    Icon: Users,         bg:'#D1FAE5', color:'#065F46' },
    { id: 'schemes',   label: lang==='en'?'Schemes':'योजनाएं',   Icon: FileText,      bg:'#DBEAFE', color:'#1E40AF' },
    { id: 'services',  label: lang==='en'?'Services':'सेवाएं',   Icon: Wrench,        bg:'#FEF3C7', color:'#92400E' },
    { id: 'education', label: lang==='en'?'Education':'शिक्षा',  Icon: GraduationCap, bg:'#FCE7F3', color:'#9D174D' },
    { id: null,        label: lang==='en'?'News':'समाचार',       Icon: BookOpen,      bg:'#EDE9FE', color:'#4C1D95' },
    { id: null,        label: lang==='en'?'Jobs':'नौकरी',        Icon: Briefcase,     bg:'#D1FAE5', color:'#064E3B' },
    { id: null,        label: lang==='en'?'Gallery':'गैलरी',    Icon: ImageIcon,     bg:'#FEF9C3', color:'#78350F' },
    { id: null,        label: lang==='en'?'Events':'कार्यक्रम', Icon: Calendar,      bg:'#FFE4E6', color:'#9F1239' },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col bg-[#F2F9F5]">

      {/* ── Green Hero ── */}
      <div className="relative shrink-0" style={{ background: G }}>
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none"
          style={{ background:'rgba(27,94,59,0.4)', transform:'translate(35%,-35%)' }} />
        <div className="absolute bottom-8 left-0 w-28 h-28 rounded-full pointer-events-none"
          style={{ background:'rgba(110,231,183,0.07)', transform:'translate(-25%,0)' }} />

        <div className="relative z-10 px-5 pt-5 pb-2">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-green-300 text-xs font-semibold">
                🌱 {lang==='en'?'Good Morning':'शुभ प्रभात'}
              </p>
              <h2 className="text-[22px] font-black text-white mt-0.5 leading-tight">
                {lang==='en'?'Lohari Jatu':'लोहारी जाटू'}
              </h2>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-white/45 shrink-0" />
                <span className="text-[11px] text-white/45 font-medium">
                  {lang==='en'?'Charkhi Dadri, Haryana':'चरखी दादरी, हरियाणा'}
                </span>
              </div>
            </div>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <Bell size={17} className="text-white" />
              </div>
              {announcements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[#F97316] rounded-full text-[8px] font-black text-white flex items-center justify-center shadow-md">
                  {announcements.length}
                </span>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="bg-white/12 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3 mb-2">
            <Search size={15} className="text-white/50 shrink-0" />
            <span className="text-white/40 text-sm font-medium">
              {lang==='en'?'Search announcements, news...':'घोषणाएं, समाचार खोजें...'}
            </span>
          </div>
        </div>

        <div className="relative z-10"><Wave /></div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 -mt-1">

        {/* Quick Menu */}
        <div className="grid grid-cols-4 gap-3 mb-5 pt-1">
          {menuItems.map((item, i) => {
            const { Icon } = item;
            return (
              <button key={i} onClick={() => item.id && onNavigate?.(item.id)}
                className="active-press flex flex-col items-center gap-1.5">
                <div className="w-full aspect-square rounded-2xl flex items-center justify-center shadow-sm border border-white/80"
                  style={{ backgroundColor: item.bg, maxWidth: 60, maxHeight: 60 }}>
                  <Icon size={22} strokeWidth={1.5} style={{ color: item.color }} />
                </div>
                <span className="text-[10px] font-semibold text-[#0D2B1A] text-center leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-gray-200 mb-4" />

        {/* Announcements — Horizontal Carousel */}
        {announcements.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <SL label={lang==='en'?'URGENT ANNOUNCEMENTS':'आपातकालीन घोषणाएं'} />
              <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                🔴 {announcements.length} {lang==='en'?'Active':'सक्रिय'}
              </span>
            </div>
            <div className="overflow-x-auto no-scrollbar -mx-4">
              <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
                {announcements.map((a) => {
                  const key = a.badge.en.toLowerCase();
                  const meta = ANN_META[key] || { g: 'linear-gradient(135deg,#F97316,#ea580c)', emoji: '📢' };
                  return (
                    <div key={a.id} className="w-[270px] rounded-2xl overflow-hidden shadow-sm shrink-0 border border-white/60">
                      {/* Gradient top */}
                      <div className="p-4" style={{ background: meta.g }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
                            style={{ background: 'rgba(255,255,255,0.2)' }}>
                            {a.badge[lang]}
                          </span>
                          <span className="text-[10px] text-white/70 flex items-center gap-1">
                            <Calendar size={9} /> {a.date[lang]}
                          </span>
                        </div>
                        <div className="text-3xl mb-2">{meta.emoji}</div>
                        <h3 className="text-sm font-bold text-white leading-snug">{a.title[lang]}</h3>
                      </div>
                      {/* White bottom */}
                      <div className="bg-white px-4 pt-3 pb-4">
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{a.desc[lang]}</p>
                        <button className="active-press w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white"
                          style={{ background: meta.g }}>
                          <CheckCircle2 size={12} strokeWidth={2.5} />
                          {lang==='en'?"Mark as Read":'पढ़ लिया'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <div className="border-t border-gray-200 mb-4" />

        {/* Village News */}
        <section className="mb-4">
          <SL label={lang==='en'?'VILLAGE UPDATES':'गांव की खबरें'} />
          <div className="space-y-4">
            {newsList.map((news) => {
              const isExp = expandedNews === news.id;
              const key = news.category.en.toLowerCase();
              const bc = catBadge[key] || 'bg-gray-100 text-gray-600';
              return (
                <article key={news.id} onClick={() => setExpandedNews(isExp ? null : news.id)}
                  className="active-press cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {news.image && (
                    <div className="h-40 w-full bg-gray-100 overflow-hidden relative">
                      <img src={news.image} alt={news.title[lang]} className="w-full h-full object-cover" loading="lazy" />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${bc}`}>
                        {news.category[lang]}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    {!news.image && (
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 ${bc}`}>
                        {news.category[lang]}
                      </span>
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-[#1B5E3B] truncate max-w-[140px]">{news.author[lang]}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar size={9}/> {news.date[lang]}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0D2B1A] leading-snug">{news.title[lang]}</h3>
                    <p className={`text-xs text-gray-500 mt-1.5 leading-relaxed ${isExp?'':'line-clamp-2'}`}>{news.desc[lang]}</p>
                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100">
                      <span className="text-xs font-bold text-[#1B5E3B]">
                        {isExp?(lang==='en'?'Show Less':'कम दिखाएं'):(lang==='en'?'Read More':'अधिक पढ़ें')}
                      </span>
                      {isExp?<ChevronUp size={13} className="text-[#1B5E3B]"/>:<ChevronDown size={13} className="text-[#1B5E3B]"/>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Jobs — Board Style */}
        {jobsList.length > 0 && (
          <>
            <div className="border-t border-gray-200 mb-4" />
            <section className="pb-8">
              <div className="flex items-center justify-between mb-3">
                <SL label={lang==='en'?'GOVERNMENT JOBS':'सरकारी नौकरियां'} />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {jobsList.length} {lang==='en'?'Open':'खुले'}
                </span>
              </div>
              <div className="space-y-3">
                {jobsList.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-sm overflow-hidden"
                    style={{ borderLeft: '4px solid #F97316' }}>
                    <div className="p-4">
                      {/* Top row: department + deadline */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-bold text-sky-600 bg-sky-50 border border-sky-200 px-2 py-1 rounded-full leading-none">
                          🏛️ {job.department[lang]}
                        </span>
                        <span className="text-[10px] font-bold text-[#F97316] bg-orange-50 border border-orange-200 px-2 py-1 rounded-full shrink-0 leading-none">
                          ⏰ {job.lastDate[lang]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-[14px] font-bold text-[#0D2B1A] leading-snug mb-3">
                        {job.title[lang]}
                      </h3>

                      {/* Info pills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl">
                          👥 {job.vacancies[lang]}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-xl">
                          🎓 {job.eligibility[lang]}
                        </span>
                      </div>

                      {/* Apply button */}
                      <a href={job.link} target="_blank" rel="noopener noreferrer"
                        className="active-press flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-xs"
                        style={{ background:'linear-gradient(135deg,#F97316,#EA6C0A)', boxShadow:'0 4px 12px rgba(249,115,22,0.25)' }}
                        onClick={(e) => {
                          if(job.link.includes('hssc.gov.in')||job.link.includes('hpsc.gov.in')){
                            e.preventDefault();
                            alert(`Redirecting to ${job.link}...`);
                          }
                        }}>
                        <ExternalLink size={13} strokeWidth={2} />
                        {t.jobApplyBtn}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
