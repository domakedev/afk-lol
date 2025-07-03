"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ICONS } from "@/constants";
import { UserData } from "@/types";
import Dashboard from "@/components/Dashboard";
import ToolkitPage from "../components/toolkit/page";
import Reconstruction from "../components/reconstruccion/page";
import Education from "./educacion/page";
import Onboarding from "@/components/Onboarding";
import Login from "../components/Login";
import LandingPage from "@/components/LandingPage";
import { loadUserData, saveUserData } from "../firebaseUserData";

const App: React.FC = () => {
  const [user, setUser] = useState<unknown>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser: { email: unknown }) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          const data = await loadUserData();
          setUserData(
            data || {
              onboardingComplete: false,
              userName: firebaseUser.email || "",
              dayZero: new Date().toISOString().slice(0, 10),
              horasRecuperadas: 0,
              horasPorRecuperar: 0,
              killStreak: 0,
              activities: [],
              defeats: [],
              commitment: "",
              goals: [],
              routines: [],
              triggers: [],
              cbtEntries: [],
              assessmentScore: 0,
            }
          );
        } else {
          setUserData(null);
        }
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user && userData) saveUserData(userData);
  }, [userData, user]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Forzar dashboard al terminar onboarding
  useEffect(() => {
    if (userData && userData.onboardingComplete) {
      setActiveTab("dashboard");
    }
  }, [userData]);

  const renderContent = () => {
    if (!userData) return null;
    if (!userData.onboardingComplete) {
      return (
        <Onboarding
          setUserData={
            setUserData as React.Dispatch<React.SetStateAction<UserData>>
          }
        />
      );
    }
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            userData={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserData>>
            }
          />
        );
      case "toolkit":
        return (
          <ToolkitPage
            userData={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserData>>
            }
          />
        );
      case "reconstruction":
        return (
          <Reconstruction
            userData={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserData>>
            }
          />
        );
      case "education":
        return <Education />;
      default:
        return (
          <Dashboard
            userData={userData}
            setUserData={
              setUserData as React.Dispatch<React.SetStateAction<UserData>>
            }
          />
        );
    }
  };

  const NavItem: React.FC<{
    tabName: string;
    label: string;
    icon: React.ReactNode;
  }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm transition-colors duration-200 ${
        activeTab === tabName
          ? "text-teal-400"
          : "text-slate-400 hover:text-teal-300"
      }`}
      aria-label={label}
      aria-current={activeTab === tabName ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!user) {
    if (showLogin) {
      return <Login onLogin={() => setLoading(true)} onCancel={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }
  if (!userData)
    return <div className="text-center mt-10">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <main className="flex-grow pt-6 pb-20">
        {renderContent()}
        <button
          onClick={() => {
            signOut(auth);
            setShowLogin(false);
          }}
          className="absolute top-4 right-4 bg-slate-700 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 shadow-lg z-10">
        <nav
          className="flex justify-around max-w-3xl mx-auto"
          role="navigation"
          aria-label="Main"
        >
          <NavItem tabName="dashboard" label="Panel" icon={ICONS.dashboard} />
          <NavItem
            tabName="toolkit"
            label="Herramientas"
            icon={ICONS.toolkit}
          />
          <NavItem
            tabName="reconstruction"
            label="Reconstruir"
            icon={ICONS.reconstruction}
          />
          <NavItem
            tabName="education"
            label="Educación"
            icon={ICONS.education}
          />
        </nav>
      </footer>
    </div>
  );
};

export default App;
