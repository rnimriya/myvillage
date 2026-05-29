import React, { useState } from 'react';
import { AlertCircle, Calendar, MessageSquare, Megaphone, ChevronDown, ChevronUp, Briefcase } from 'lucide-react';
import { translations } from '../data/translations';
import { db } from '../data/db';

const SectionLabel = ({ icon: Icon, label, color = 'text-coral' }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="w-1 h-4 rounded-full bg-coral shrink-0" />
    <Icon size={13} strokeWidth={2} className={color} />
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
);

export default function HomeFeed({ lang }) {
  const t = translations[lang];
  const [expandedAnnounce, setExpandedAnnounce] = useState(null);
  const [expandedNews, setExpandedNews] = useState(null);

  const announcementsList = db.getAnnouncements();
  const newsList = db.getNews();
  const jobsList = db.getJobs();

  const toggleAnnounce = (id) => setExpandedAnnounce(expandedAnnounce === id ? null : id);
  const toggleNews = (id) => setExpandedNews(expandedNews === id ? null : id);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-8 bg-[#F4F6F8] flex flex-col pt-4">

      {/* 1. Urgent Announcements */}
      <section className="px-4 pb-2">
        <SectionLabel icon={Megaphone} label={t.urgentAnnouncements} color="text-amber-500" />

        <div className="space-y-3">
          {announcementsList.length > 0 ? (
            announcementsList.map((announce) => {
              const isExpanded = expandedAnnounce === announce.id;
              return (
                <div
                  key={announce.id}
                  onClick={() => toggleAnnounce(announce.id)}
                  className="active-press cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-500 mt-0.5 shrink-0">
                      <AlertCircle size={16} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 pr-5">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          {announce.badge[lang]}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                          <Calendar size={9} strokeWidth={1.5} />
                          {announce.date[lang]}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                        {announce.title[lang]}
                      </h3>
                      <p className={`text-gray-500 text-xs mt-1.5 leading-relaxed ${isExpanded ? 'block' : 'line-clamp-2'}`}>
                        {announce.desc[lang]}
                      </p>
                      <div className="flex justify-end mt-1.5">
                        {isExpanded
                          ? <ChevronUp size={14} className="text-amber-500" />
                          : <ChevronDown size={14} className="text-amber-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs font-medium bg-white rounded-2xl shadow-sm border border-gray-100">
              📭 {lang === 'en' ? 'No urgent announcements at this time.' : 'इस समय कोई महत्वपूर्ण घोषणा नहीं है।'}
            </div>
          )}
        </div>
      </section>

      <div className="mx-4 my-4 border-t border-gray-200" />

      {/* 2. Village Updates Feed */}
      <section className="px-4 flex-1">
        <SectionLabel icon={MessageSquare} label={t.villageUpdates} />

        <div className="space-y-4">
          {newsList.length > 0 ? (
            newsList.map((news) => {
              const isExpanded = expandedNews === news.id;
              return (
                <article
                  key={news.id}
                  onClick={() => toggleNews(news.id)}
                  className="active-press cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="h-44 w-full relative bg-gray-100 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title[lang]}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-coral font-bold text-[10px] uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                      {news.category[lang]}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center text-[11px] mb-2">
                      <span className="font-semibold text-coral truncate max-w-[150px]">
                        {news.author[lang]}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-gray-400">
                        <Calendar size={10} strokeWidth={1.5} />
                        {news.date[lang]}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 leading-snug tracking-tight mb-1.5">
                      {news.title[lang]}
                    </h3>

                    <p className={`text-gray-500 text-xs leading-relaxed ${isExpanded ? 'block' : 'line-clamp-3'}`}>
                      {news.desc[lang]}
                    </p>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-xs font-semibold text-coral">
                      <span>{isExpanded ? (lang === 'en' ? 'Show Less' : 'कम दिखाएं') : (lang === 'en' ? 'Read More' : 'अधिक पढ़ें')}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs font-medium">
              📭 {lang === 'en' ? 'No updates in news feed yet.' : 'समाचार फ़ीड में अभी कोई अपडेट नहीं है।'}
            </div>
          )}
        </div>
      </section>

      <div className="mx-4 my-4 border-t border-gray-200" />

      {/* 3. Govt Jobs Feed */}
      <section className="px-4 pb-6">
        <SectionLabel icon={Briefcase} label={t.govtJobs} />

        <div className="space-y-4">
          {jobsList.length > 0 ? (
            jobsList.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3"
              >
                <div>
                  <h4 className="text-[10px] font-bold text-sky-blue uppercase tracking-wider">
                    🏛️ {job.department[lang]}
                  </h4>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1 leading-snug">
                    {job.title[lang]}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs text-gray-500 font-medium">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                      👥 {t.jobVacancies}
                    </span>
                    <span className="text-gray-900 font-semibold">{job.vacancies[lang]}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                      🎓 {t.jobEligibility}
                    </span>
                    <span className="text-gray-900 font-semibold">{job.eligibility[lang]}</span>
                  </div>
                  <div className="col-span-2 border-t border-gray-200 pt-2">
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
                      📅 {t.jobLastDate}
                    </span>
                    <span className="text-amber-500 font-bold">{job.lastDate[lang]}</span>
                  </div>
                </div>

                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-coral hover:bg-coral-dark text-white font-bold text-xs text-center py-2.5 rounded-xl active-press cursor-pointer uppercase tracking-wider block transition-colors"
                  onClick={(e) => {
                    if (job.link.includes('hssc.gov.in') || job.link.includes('hpsc.gov.in')) {
                      e.preventDefault();
                      alert(`${lang === 'en' ? 'Redirecting to Haryana Recruitment Portal' : 'हरियाणा भर्ती पोर्टल पर निर्देशित किया जा रहा है'} (${job.link})...`);
                    }
                  }}
                >
                  🔗 {t.jobApplyBtn}
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs font-medium">
              📭 {t.noJobs}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
