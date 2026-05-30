import React, { useState } from 'react';
import MobileFrame from './components/MobileFrame';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import HomeFeed from './screens/HomeFeed';
import Schemes from './screens/Schemes';
import Directory from './screens/Directory';
import Services from './screens/Services';
import Education from './screens/Education';
import Auth from './screens/Auth';
import Dashboard from './screens/Dashboard';
import SuperAdmin from './screens/SuperAdmin';
import { db } from './data/db';

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [session, setSession] = useState(db.getSession());
  const [isAdminActive, setIsAdminActive] = useState(db.getAdminSession());

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  const handleLoginSuccess = (user) => {
    setSession(user);
    setActiveTab('portal');
  };

  const handleLogout = () => {
    db.clearSession();
    setSession(null);
    setActiveTab('services');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminActive(true);
    setActiveTab('superadmin');
  };

  const handleAdminLogout = () => {
    db.clearAdminSession();
    setIsAdminActive(false);
    setActiveTab('home');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':      return <HomeFeed lang={lang} onNavigate={setActiveTab} />;
      case 'schemes':   return <Schemes lang={lang} />;
      case 'directory': return <Directory lang={lang} />;
      case 'services':  return (
        <Services lang={lang} session={session} onNavigateToPortal={() => setActiveTab('portal')} />
      );
      case 'education': return <Education lang={lang} />;
      case 'portal':
        return session ? (
          <Dashboard provider={session} onLogout={handleLogout} lang={lang} />
        ) : (
          <Auth lang={lang} onLoginSuccess={handleLoginSuccess} onAdminLoginSuccess={handleAdminLoginSuccess} />
        );
      case 'superadmin':
        return isAdminActive ? (
          <SuperAdmin lang={lang} onLogout={handleAdminLogout} />
        ) : (
          <Auth lang={lang} onLoginSuccess={handleLoginSuccess} onAdminLoginSuccess={handleAdminLoginSuccess} />
        );
      default: return <HomeFeed lang={lang} />;
    }
  };

  const headerSession = isAdminActive ? { isAdmin: true } : session;
  const handleHeaderPortalClick = () => setActiveTab(isAdminActive ? 'superadmin' : 'portal');

  return (
    <MobileFrame>
      <Header
        lang={lang}
        onLangChange={toggleLanguage}
        session={headerSession}
        onPortalClick={handleHeaderPortalClick}
        activeTab={activeTab}
      />

      <main className="flex-1 overflow-hidden flex flex-col bg-[#F2F9F5]">
        {renderActiveScreen()}
      </main>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />
    </MobileFrame>
  );
}
