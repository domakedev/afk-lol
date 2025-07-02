"use client";

import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserData } from "@/types";

const DashboardPage = () => {
  const [userData] = useLocalStorage<UserData>("lol-afk-data", {
    onboardingComplete: false,
    userName: "",
    assessmentScore: 0,
    commitment: "",
    dayZero: null,
    horasRecuperadas: 0,
    horasPorRecuperar: 0,
    killStreak: 0,
    activities: [],
    goals: [],
    routines: [],
    triggers: [],
    cbtEntries: [],
    defeats: [],
  });

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900">
      <div className="bg-slate-800/70 p-8 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-teal-400 mb-4">
          ¡Bienvenido/a al Dashboard!
        </h1>
        <p className="text-lg text-slate-200 mb-2">
          Hola, {userData.userName || "Invitado"} 👋
        </p>
        <p className="text-slate-400 mb-4">
          Aquí podrás ver tu progreso y acceder a tus herramientas.
        </p>
        {/* Puedes agregar más widgets, estadísticas o accesos aquí */}
      </div>
    </div>
  );
};

export default DashboardPage;
