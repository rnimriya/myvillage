import React from 'react';
import { Home, FileText, Users, Wrench, GraduationCap } from 'lucide-react';
import { translations } from '../data/translations';

export default function BottomNavigation({ activeTab, setActiveTab, lang }) {
  const t = translations[lang];

  const navItems = [
    { id: 'home',      label: t.home      || (lang === 'en' ? 'Home'      : 'मुख्य'),       icon: Home },
    { id: 'schemes',   label: t.schemes   || (lang === 'en' ? 'Schemes'   : 'योजनाएं'),     icon: FileText },
    { id: 'directory', label: t.directory || (lang === 'en' ? 'Directory' : 'निर्देशिका'), icon: Users },
    { id: 'services',  label: t.services  || (lang === 'en' ? 'Services'  : 'सेवाएं'),      icon: Wrench },
    { id: 'education', label: t.education || (lang === 'en' ? 'Education' : 'शिक्षा'),      icon: GraduationCap },
  ];

  return (
    <nav
      className="w-full bg-white border-t border-gray-200 flex items-stretch justify-around shrink-0 select-none"
      style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex-1 flex flex-col items-center justify-center relative pt-2.5 pb-1 gap-0.5 focus:outline-none active-press"
          >
            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-coral rounded-b-full" />
            )}

            <Icon
              size={21}
              strokeWidth={isActive ? 2.2 : 1.5}
              className={`transition-all duration-200 ${isActive ? 'text-coral' : 'text-gray-400'}`}
            />

            <span
              className={`text-[10px] font-semibold transition-colors duration-200 truncate max-w-[62px] ${
                isActive ? 'text-coral' : 'text-gray-400'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
