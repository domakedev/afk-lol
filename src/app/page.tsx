
"use client"

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ICONS } from '@/constants';
import { UserData } from '@/types';
import Dashboard from '@/components/Dashboard';
import ToolkitPage from './toolkit/page';
import Reconstruction from './reconstruccion/page';
import Education from './educacion/page';
import Onboarding from './onboarding/page';

const App: React.FC = () => {
  const [userData, setUserData] = useLocalStorage<UserData>('lol-afk-data', {
    onboardingComplete: false,
    userName: '',
    dayZero: null,
    commitment: '',
    assessmentScore: 0,
    horasRecuperadas: 0,
    horasPorRecuperar: 0, // Set by user during onboarding
    killStreak: 0,
    activities: [],
    goals: [],
    routines: [],
    triggers: [],
    cbtEntries: [],
    defeats: [],
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  if (!userData.onboardingComplete) {
    return <Onboarding setUserData={setUserData} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userData={userData} setUserData={setUserData} />;
      case 'toolkit':
        return <ToolkitPage userData={userData} setUserData={setUserData} />;
      case 'reconstruction':
        return <Reconstruction userData={userData} setUserData={setUserData} />;
      case 'education':
        return <Education />;
      default:
        return <Dashboard userData={userData} setUserData={setUserData} />;
    }
  };

  const NavItem: React.FC<{ tabName: string; label: string; icon: React.ReactNode; }> = ({ tabName, label, icon }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors duration-200 ${
            activeTab === tabName ? 'text-teal-400' : 'text-slate-400 hover:text-teal-300'
        }`}
        aria-label={label}
        aria-current={activeTab === tabName ? 'page' : undefined}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <main className="flex-grow pt-6 pb-20">
        {renderContent()}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 shadow-lg z-10">
          <nav className="flex justify-around max-w-3xl mx-auto" role="navigation" aria-label="Main">
              <NavItem tabName="dashboard" label="Panel" icon={ICONS.dashboard} />
              <NavItem tabName="toolkit" label="Herramientas" icon={ICONS.toolkit} />
              <NavItem tabName="reconstruction" label="Reconstruir" icon={ICONS.reconstruction} />
              <NavItem tabName="education" label="Educación" icon={ICONS.education} />
          </nav>
      </footer>
    </div>
  );
};

export default App;
