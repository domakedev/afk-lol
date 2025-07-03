import Image from "next/image";
import React, { useState } from "react";

export default function LandingPage({
  onLoginClick,
  onGuestClick,
}: {
  onLoginClick: (mode?: "register") => void;
  onGuestClick: () => void;
}) {
  const [hovered, setHovered] = useState<"login" | "register" | "guest" | null>(
    null
  );
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="max-w-xl w-full flex flex-col items-center gap-8 animate-fade-in-scale z-10">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt="AFK LOL logo"
            className="w-24 h-24 mb-2 drop-shadow-lg animate-bounce-slow"
            width={1024}
            height={1024}
          />
          <h1 className="text-4xl font-extrabold text-teal-400 drop-shadow mb-2 text-center tracking-tight">
            AFK LOL
          </h1>
        </div>
        <h2 className="text-xl text-slate-300 font-semibold text-center mb-4">
          Recupera tu tiempo, mejora tu bienestar y alcanza tus metas fuera del
          juego
        </h2>
        <p className="text-slate-400 text-center max-w-md mb-4">
          AFK LOL es una app para jugadores que quieren dejar de perder horas en
          League of Legends y transformar su tiempo en hábitos, actividades y
          logros reales. Lleva un registro de tu progreso, recibe herramientas
          de apoyo y celebra cada avance.
        </p>
        {/* Sección ¿Cómo funciona? */}
        <div className="w-full flex flex-col gap-6 bg-slate-800/70 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg text-teal-300 font-bold mb-2 text-center">
            ¿Cómo funciona?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-4xl">🎯</span>
              <span className="text-slate-300 font-semibold">
                Registra tu meta
              </span>
              <span className="text-xs text-slate-400 text-center min-h-12">
                Define cuántas horas quieres recuperar y tu objetivo personal.
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-4xl">🗺️👀🏋️</span>
              <span className="text-slate-300 font-semibold">
                Sigue tu progreso
              </span>
              <span className="text-xs text-slate-400 text-center min-h-12">
                Completa actividades, usa herramientas y suma horas recuperadas.
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <span className="text-4xl">🥳</span>{" "}
              <span className="text-slate-300 font-semibold">
                Celebra logros
              </span>
              <span className="text-xs text-slate-400 text-center min-h-12">
                Visualiza tu avance y recibe recompensas virtuales.
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <button
            onClick={() => onLoginClick()}
            onMouseEnter={() => setHovered("login")}
            onMouseLeave={() => setHovered(null)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-500 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-xl text-lg ring-2 ring-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-400/50 cursor-pointer ${
              hovered === "login" ? "scale-105 shadow-2xl" : ""
            }`}
          >
            <span className="text-2xl">🔑</span> Iniciar sesión
          </button>
          <button
            onClick={() => onLoginClick("register")}
            onMouseEnter={() => setHovered("register")}
            onMouseLeave={() => setHovered(null)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-white/90 text-teal-700 font-bold py-3 px-8 rounded-lg border-2 border-teal-400 hover:bg-teal-50 transition-all duration-200 transform hover:scale-105 shadow-xl text-lg ring-2 ring-teal-200 focus:outline-none focus:ring-4 focus:ring-teal-200/50 cursor-pointer ${
              hovered === "register" ? "scale-105 shadow-2xl" : ""
            }`}
          >
            <span className="text-2xl">📝</span> Registrarse
          </button>
          <button
            onClick={onGuestClick}
            onMouseEnter={() => setHovered("guest")}
            onMouseLeave={() => setHovered(null)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 text-white font-bold py-3 px-8 rounded-lg border-2 border-slate-500 hover:bg-slate-800 transition-all duration-200 transform hover:scale-105 shadow-xl text-lg ring-2 ring-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-400/50 cursor-pointer ${
              hovered === "guest" ? "scale-105 shadow-2xl" : ""
            }`}
          >
            <span className="text-2xl">👤</span> Continuar como invitado
          </button>
        </div>
        <div className="mt-8 text-xs text-slate-500 text-center">
          No es solo dejar de jugar, es empezar a ganar en la vida real.
        </div>
      </div>
    </div>
  );
}
