import React, { useState } from 'react';
import { Bell, MapPin, Users, FileText, Wrench, GraduationCap, Briefcase, ImageIcon, Calendar, ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';
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

        {/* Announcements */}
        {announcements.length > 0 && (
          <section className="mb-4">
            <SL label={lang==='en'?'URGENT ANNOUNCEMENTS':'आपातकालीन घोषणाएं'} />
            <div className="space-y-3">
              {announcements.map((a) => {
                const key = a.badge.en.toLowerCase();
                const bc = catBadge[key] || 'bg-orange-100 text-orange-800';
                return (
                  <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${bc}`}>
                          {a.badge[lang]}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={9} strokeWidth={1.5} />
                          {a.date[lang]}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0D2B1A] leading-snug mb-1">{a.title[lang]}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{a.desc[lang]}</p>
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-white active-press"
                      style={{ background:'linear-gradient(135deg,#F97316,#EA6C0A)' }}>
                      {lang==='en'?"I've read this":'पढ़ लिया'}
                    </button>
                  </div>
                );
              })}
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

        {/* Jobs */}
        {jobsList.length > 0 && (
          <>
            <div className="border-t border-gray-200 mb-4" />
            <section className="pb-8">
              <SL label={lang==='en'?'GOVERNMENT JOBS':'सरकारी नौकरियां'} />
              <div className="space-y-4">
                {jobsList.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#4B91F1] uppercase tracking-wider">🏛️ {job.department[lang]}</h4>
                      <h3 className="text-sm font-bold text-[#0D2B1A] mt-1 leading-snug">{job.title[lang]}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-[#F2F9F5] border border-green-100 rounded-xl p-3 text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">👥 {t.jobVacancies}</span>
                        <span className="text-[#0D2B1A] font-bold">{job.vacancies[lang]}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">🎓 {t.jobEligibility}</span>
                        <span className="text-[#0D2B1A] font-bold">{job.eligibility[lang]}</span>
                      </div>
                      <div className="col-span-2 border-t border-gray-200 pt-2">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">📅 {t.jobLastDate}</span>
                        <span className="text-[#F97316] font-bold">{job.lastDate[lang]}</span>
                      </div>
                    </div>
                    <a href={job.link} target="_blank" rel="noopener noreferrer"
                      className="text-white font-bold text-xs text-center py-3 rounded-2xl block active-press"
                      style={{ background:'linear-gradient(135deg,#F97316,#EA6C0A)' }}
                      onClick={(e) => {
                        if(job.link.includes('hssc.gov.in')||job.link.includes('hpsc.gov.in')){
                          e.preventDefault();
                          alert(`Redirecting to ${job.link}...`);
                        }
                      }}>
                      🔗 {t.jobApplyBtn}
                    </a>
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
