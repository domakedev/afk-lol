"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/firebase";
import { useUserStore } from "../store/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [hovered, setHovered] = useState<"login" | "register" | "guest" | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const setIsGuest = useUserStore((state) => state.setIsGuest);
  const userData = useUserStore((state) => state.userData);
  const isGuest = useUserStore((state) => state.isGuest);

  const router = useRouter();

  useEffect(() => {
    // Escucha cambios de sesión y actualiza el flag cuando Firebase responde
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setAuthChecked(false);
      } else {
        setAuthChecked(true);
      }
      // Si hay usuario, también puedes actualizar el store aquí si lo deseas
    });
    return () => unsubscribe();
  }, []);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      setIsGuest(true);
      router.push("/onboarding");
    } catch {
      // Manejar error si se desea
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full min-w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-200 px-4 relative overflow-hidden py-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-700/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-stretch gap-8 animate-fade-in-scale z-10">
        {/* Columna principal: logo, título, botón, descripción */}
        <div className="flex-1 flex flex-col items-center gap-8 order-1 md:order-none">
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
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
            {/* El botón solo se renderiza si ya se chequeó el auth y no hay usuario ni invitado */}
            {authChecked && !userData && !isGuest && (
              <button
                type="button"
                onClick={handleGuestLogin}
                onMouseEnter={() => setHovered("guest")}
                onMouseLeave={() => setHovered(null)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 text-slate-500 font-bold py-3 px-8 rounded-lg border-2 border-slate-500 hover:bg-slate-200 transition-all duration-200 transform hover:scale-105 shadow-xl text-lg ring-2 ring-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-400/50 cursor-pointer ${
                  hovered === "guest" ? "scale-105 shadow-2xl" : ""
                } ${loading ? "opacity-60 cursor-wait" : ""}`}
                disabled={loading}
              >
                <span className="text-2xl">🎮</span>{" "}
                {loading ? "Entrando..." : "Continuar como invitado"}
              </button>
            )}
          </div>
          <h2 className="text-xl text-slate-300 font-semibold text-center mb-4">
            Recupera tu tiempo, mejora tu bienestar y alcanza tus metas fuera
            del juego
          </h2>
          <p className="text-slate-400 text-center max-w-md mb-4">
            AFK LOL es una app para jugadores que quieren dejar de perder horas
            en League of Legends y transformar su tiempo en hábitos, actividades
            y logros reales. Lleva un registro de tu progreso, recibe
            herramientas de apoyo y celebra cada avance.
          </p>
        </div>
        {/* Columna ¿Cómo funciona? */}
        <div className="w-full md:w-[380px] flex-shrink-0 order-2 md:order-none">
          <div className="w-full flex flex-col gap-6 bg-slate-800/70 rounded-xl p-6 border border-slate-700 shadow-lg h-full justify-center">
            <h3 className="text-lg text-teal-300 font-bold mb-2 text-center md:text-center">
              ¿Cómo funciona?
            </h3>
            <div className="flex flex-col sm:flex-row md:flex-col gap-4 justify-center items-center md:items-center">
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
                  Completa actividades, usa herramientas y suma horas
                  recuperadas.
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
        </div>
      </div>
      <footer className="sm:absolute sm:bottom-0 pt-4 sm:pb-4 text-xs text-slate-500 text-center md:text-left">
        No es solo dejar de jugar, es empezar a ganar en la vida real.
      </footer>
    </div>
  );
}
