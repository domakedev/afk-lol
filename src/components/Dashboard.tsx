"use client";

import React, { useState, useMemo, useEffect } from "react";
import { UserData, ActivityEntry, DefeatEntry } from "../types";
import { ICONS } from "../constants";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { MdOutlineVisibility } from "react-icons/md";

// --- ElevenLabs & Web Speech API Implementation ---

let voices: SpeechSynthesisVoice[] = [];
let femaleSpanishVoice: SpeechSynthesisVoice | undefined;

const populateVoices = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    voices = window.speechSynthesis.getVoices();
    femaleSpanishVoice =
      voices.find(
        (voice) =>
          voice.lang.startsWith("es-") &&
          voice.name.toLowerCase().includes("google") &&
          (voice.name.toLowerCase().includes("femenino") ||
            voice.name.toLowerCase().includes("female"))
      ) ||
      voices.find(
        (voice) => voice.lang === "es-US" && voice.name.includes("Paulina")
      ) ||
      voices.find(
        (voice) => voice.lang === "es-ES" && voice.name.includes("Mónica")
      ) ||
      voices.find(
        (voice) =>
          (voice.lang === "es-US" || voice.lang === "es-MX") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("mujer"))
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "es-ES" &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("mujer"))
      ) ||
      voices.find(
        (voice) =>
          voice.lang.startsWith("es-") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("mujer"))
      ) ||
      voices.find((voice) => voice.lang.startsWith("es-"));
  }
};

if (typeof window !== "undefined" && window.speechSynthesis) {
  populateVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
}

const speak = async (
  text: string,
  options?: { pitch?: number; rate?: number; lang?: string }
): Promise<void> => {
  // --- Llamada a la API local /api/tts ---
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, ...options }),
    });
    if (!response.ok) throw new Error("/api/tts error");
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    return new Promise<void>((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      audio.play().catch((error) => {
        console.error("Error reproduciendo audio /api/tts:", error);
        resolve();
      });
    });
  } catch (error) {
    console.error("Fallo /api/tts, fallback a Web Speech API", error);
  }

  // --- Fallback Web Speech API ---
  return new Promise<void>((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || "es-ES";
    utterance.pitch = options?.pitch || 1.0;
    utterance.rate = options?.rate || 1.1;
    if (femaleSpanishVoice) utterance.voice = femaleSpanishVoice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
};

// StatCard ahora acepta children para contenido extra debajo del valor
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subValue?: string;
  color: string;
  children?: React.ReactNode;
  topButton?: React.ReactNode;
  bottomButton?: React.ReactNode;
}> = ({ title, value, subValue, color, children, topButton, bottomButton }) => (
  <div className="bg-slate-800 p-4 rounded-lg shadow-md text-center relative flex flex-col justify-between py-6">
    {topButton && (
      <div className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2 z-10 cursor-pointer">
        {topButton}
      </div>
    )}
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
      {children}
    </div>
    {bottomButton && (
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
        {bottomButton}
      </div>
    )}
  </div>
);

const ReinforcementOverlay: React.FC<{
  userData: UserData;
  daysAfk: number;
  onClose: () => void;
}> = ({ userData, daysAfk, onClose }) => {
  const [message, setMessage] = useState("");
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const sequence = async () => {
      await new Promise((res) => setTimeout(res, 100));
      if (isCancelled) return;

      await speak("Refuerzo activado.", { pitch: 1.2, rate: 1 });
      if (isCancelled) return;
      await new Promise((res) => setTimeout(res, 500));
      if (isCancelled) return;

      // Mensaje de días AFK
      let text1 = "";
      if (daysAfk > 0) {
        text1 = `¡Llevas ${daysAfk} día${daysAfk > 1 ? "s" : ""} AFK!`;
      } else {
        text1 = "¡Hoy es el primer día de tu nueva etapa!";
      }
      setMessage(text1);
      await speak(text1);
      if (isCancelled) return;
      await new Promise((res) => setTimeout(res, 500));
      if (isCancelled) return;

      // Mensaje de horas recuperadas
      const hours = Math.floor(userData.horasRecuperadas / 60);
      const minutes = userData.horasRecuperadas % 60;
      let text2 = "";
      if (userData.horasRecuperadas > 0) {
        text2 = `¡Has recuperado ${hours} horas y ${minutes} minutos!`;
      } else {
        text2 = "¡Cada pequeño paso cuenta! Sigue avanzando.";
      }
      setMessage(text2.toUpperCase());
      await speak(text2);
      if (isCancelled) return;
      await new Promise((res) => setTimeout(res, 500));
      if (isCancelled) return;

      // Compromiso
      const text3 = userData.commitment;
      setMessage(`Recuerda tu compromiso: "${text3}"`);
      await speak(`Recuerda tu compromiso: ${text3}`);
      if (isCancelled) return;

      setShowClose(true);
    };

    sequence();

    return () => {
      isCancelled = true;
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [userData, daysAfk]);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4 text-center"
      onClick={showClose ? onClose : undefined}
    >
      {message && (
        <div key={message} className="animate-fade-in-scale">
          <p
            className={`text-3xl lg:text-5xl font-bold text-teal-400 mb-8 p-4 ${
              message.length > 50 ? "italic" : ""
            }`}
          >
            {message}
          </p>
        </div>
      )}
      {showClose && (
        <button
          onClick={onClose}
          className="mt-8 bg-teal-500/80 text-white font-bold py-2 px-6 rounded-lg animate-fade-in-scale"
        >
          Toca para cerrar
        </button>
      )}
    </div>
  );
};

// Modal reutilizable para mostrar detalles
const DetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in-scale min-h-full">
      <div className="bg-slate-900 rounded-xl shadow-2xl p-6 max-w-md w-full relative border-2 border-teal-400 mx-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-teal-400 text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-teal-300">
          {title}
        </h2>
        <div className="max-h-72 overflow-y-auto pr-2">{children}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}> = ({ userData, setUserData }) => {
  const [activity, setActivity] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [error, setError] = useState("");
  const [visualEffect, setVisualEffect] = useState<string | null>(null);
  const [showReinforcement, setShowReinforcement] = useState(false);
  const [showVictoryFlash, setShowVictoryFlash] = useState(false);
  const [showVictoryText, setShowVictoryText] = useState(false);
  const { width, height } = useWindowSize();

  const [actionTab, setActionTab] = useState<"victory" | "defeat">("victory");
  const [lostHours, setLostHours] = useState("");
  const [lostMinutes, setLostMinutes] = useState("");
  const [gameMode, setGameMode] = useState<
    "ARAM" | "TFT" | "Ranked" | "Normales"
  >("Ranked");
  const [defeatError, setDefeatError] = useState("");

  const [showHorasModal, setShowHorasModal] = useState(false);
  const [horasInput, setHorasInput] = useState("");
  const [horasError, setHorasError] = useState("");

  const [showDetail, setShowDetail] = useState<"victorias" | "derrotas" | null>(
    null
  );

  // Indicadores de victorias y derrotas con icono y efecto brillante
  const IndicatorCard: React.FC<{
    count: number;
    color: string;
    onClick: () => void;
    active?: boolean;
  }> = ({ count, color, onClick, active }) => (
    <button
      className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-xl transition-all duration-150 select-none ${color} shadow-xl text-4xl md:text-5xl text-slate-800 focus:outline-none font-bold overflow-hidden
      ${
        active
          ? "scale-95 shadow-inner"
          : "hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-inner"
      }`}
      onClick={onClick}
      type="button"
      style={{
        // --- Estilos base para el botón ---
        outline: "none",
        border: "none",
        cursor: "pointer",
        padding: 0, // Sin padding extra, cuadrado puro
        borderRadius: "1rem", // Consistente con el resto de la app
        color: "white",
        fontWeight: "bold",
        textShadow: "0px 2px 8px rgba(0,0,0,0.25)",
        letterSpacing: "0.01em",
        transition: "all 0.12s cubic-bezier(.4,2,.6,1)",
        background: color.includes("teal")
          ? "linear-gradient(135deg, #14b8a6 70%, #0f766e 100%)"
          : color.includes("red")
          ? "linear-gradient(135deg, #dc2626 70%, #991b1b 100%)"
          : "linear-gradient(135deg, #404040 70%, #18181b 100%)",
        boxShadow: color.includes("teal")
          ? "0 2px 8px 0 #14b8a6a0, 0 8px 32px 0 #0f766e60, 0 1.5px 0 #0d9488"
          : color.includes("red")
          ? "0 2px 8px 0 #dc2626a0, 0 8px 32px 0 #991b1b60, 0 1.5px 0 #b91c1c"
          : "0 2px 8px 0 #404040a0, 0 8px 32px 0 #18181b60, 0 1.5px 0 #18181b",
      }}
      aria-label="Ver detalles"
    >
      {/* Efecto glossy */}
      <span
        className="absolute left-0 top-0 w-full h-full rounded-xl pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg,rgba(255,255,255,0.45) 0%,rgba(255,255,255,0.12) 60%,rgba(255,255,255,0.05) 100%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Icono de ver más */}
      <span className="absolute top-1.5 right-2 text-slate-100 text-lg md:text-xl pointer-events-none">
        <MdOutlineVisibility />
      </span>
      <span className="z-10">{count}</span>
    </button>
  );

  const daysAfk = useMemo(() => {
    if (!userData.dayZero) return 0;
    const parts = userData.dayZero.split("-").map(Number);
    const dayZeroDate = new Date(parts[0], parts[1] - 1, parts[2]);
    const now = new Date();
    if (dayZeroDate > now) return 0;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffTime = today.getTime() - dayZeroDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }, [userData.dayZero]);

  const formatMinutes = (totalMinutes: number) => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return { hours: h, minutes: m, display: `${h}h ${m}m` };
  };

  const killStreakAnnouncements: { [key: number]: string } = {
    1: "¡Primera Sangre!",
    2: "¡Doble kill!",
    3: "¡Triple-kill!",
    4: "¡Quadra-kill!",
    6: "¡Imparable!",
    7: "¡Racha de Dios!",
    8: "¡Legendario!",
  };

  const reproducirEfectoRacha = (
    textoVoz: string,
    options?: { pitch?: number; rate?: number }
  ): Promise<void> => {
    return new Promise(async (resolve) => {
      const visualText = textoVoz.includes("Penta-kill")
        ? "Penta-kill"
        : textoVoz.replace(/[¡!]/g, "");
      const nivel = visualText.toLowerCase().replace(/ /g, "_");

      setVisualEffect(nivel);

      if (nivel === "penta-kill") {
        // Reproducir sonido de fondo muy bajito
        const bgAudio = new Audio("/celebration/celebration.mp3");
        bgAudio.volume = 0.1; // volumen muy bajo
        bgAudio.play().catch(() => {});
        // Mostrar confeti
        setShowVictoryFlash(true);
        // TTS
        await Promise.all([
          speak(textoVoz, options || { pitch: 1.5, rate: 1.5 }),
          new Promise((res) => setTimeout(res, 3200)), // tiempo para ver el confeti
        ]);
        setShowVictoryFlash(false);
        setVisualEffect(null);
        resolve();
        return;
      }

      await new Promise((res) => setTimeout(res, 1500));
      setVisualEffect(null);
      await speak(textoVoz, options || { pitch: 1.2, rate: 1.3 });
      resolve();
    });
  };

  const handleClaimVictory = () => {
    const h = parseInt(hours || "0", 10);
    const m = parseInt(minutes || "0", 10);
    if (!activity.trim() || (h === 0 && m === 0)) {
      setError("Añade una descripción y un tiempo válido.");
      return;
    }
    if (h < 0 || m < 0 || m >= 60) {
      setError("El tiempo introducido no es válido.");
      return;
    }
    setError("");

    const timeSpent = h * 60 + m;
    const newEntry: ActivityEntry = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString("es-ES"),
      description: activity,
      timeSpent,
    };

    const oldTotalRecuperadas = userData.horasRecuperadas;
    const newTotalRecuperadas = oldTotalRecuperadas + timeSpent;
    const newKillStreak = userData.killStreak + 1;

    setUserData((prev) => ({
      ...prev,
      horasRecuperadas: newTotalRecuperadas,
      // horasPorRecuperar ya no disminuye al reclamar victoria
      killStreak: newKillStreak,
      activities: [newEntry, ...prev.activities].slice(0, 50),
    }));

    (async () => {
      let milestoneAnnounced = false;

      if (newKillStreak === 5) {
        milestoneAnnounced = true;

        await reproducirEfectoRacha("¡Pe-pe-pe... Penta-kill!", {
          pitch: 1.5,
          rate: 1.5,
        });

        await new Promise((res) => setTimeout(res, 200));

        const visualEffectsPromise = new Promise<void>((resolve) => {
          setShowVictoryFlash(true);
          setShowVictoryText(true);
          setTimeout(() => {
            setShowVictoryFlash(false);
            setShowVictoryText(false);
            resolve();
          }, 2500);
        });

        await speak("¡VICTORIA!", { pitch: 1.2, rate: 0.8 });
        await visualEffectsPromise;
      }

      if (!milestoneAnnounced) {
        const announcement = killStreakAnnouncements[newKillStreak];
        if (announcement) {
          await reproducirEfectoRacha(announcement);
          milestoneAnnounced = true;
        }
      }

      if (!milestoneAnnounced) {
        const oldHoursFloored = Math.floor(oldTotalRecuperadas / 60);
        const newHoursFloored = Math.floor(newTotalRecuperadas / 60);
        if (newHoursFloored > oldHoursFloored && newHoursFloored > 0) {
          await speak(`${newHoursFloored} horas recuperadas`);
        }
      }
    })();

    setActivity("");
    setHours("");
    setMinutes("");
  };

  const handleRegisterDefeat = () => {
    const h = parseInt(lostHours || "0", 10);
    const m = parseInt(lostMinutes || "0", 10);
    if (h === 0 && m === 0) {
      setDefeatError("Añade un tiempo perdido válido.");
      return;
    }
    if (h < 0 || m < 0 || m >= 60) {
      setDefeatError("El tiempo introducido no es válido.");
      return;
    }
    setDefeatError("");

    const timeLost = h * 60 + m;
    const newDefeat: DefeatEntry = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString("es-ES"),
      gameMode,
      timeLost,
    };

    const oldKillStreak = userData.killStreak;

    setUserData((prev) => ({
      ...prev,
      horasPorRecuperar: prev.horasPorRecuperar + timeLost,
      killStreak: 0,
      defeats: [newDefeat, ...prev.defeats].slice(0, 50),
    }));

    (async () => {
      if (oldKillStreak > 0) {
        await speak(
          `Racha de ${oldKillStreak} terminada. ¡A empezar de nuevo con más fuerza!`
        );
      } else {
        await speak(
          "Derrota registrada. Ánimo, una caída no es el final del camino."
        );
      }
    })();

    setLostHours("");
    setLostMinutes("");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col p-4 space-y-6 max-w-4xl mx-auto">
      {/* Confetti para pentakill */}
      {visualEffect === "penta-kill" && showVictoryFlash && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={400}
          recycle={false}
        />
      )}
      {visualEffect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ width: "100vw", height: "100vh" }}
        >
          <div
            className="absolute left-0 top-0 w-screen h-screen bg-teal-500/30 backdrop-blur-sm animate-flash"
            style={{ zIndex: 1 }}
          />
          <h1
            className="relative text-7xl font-bold text-white uppercase drop-shadow-lg animate-fade-in-scale"
            style={{ WebkitTextStroke: "2px black", zIndex: 2 }}
          >
            {visualEffect.replace(/_/g, " ")}
          </h1>
        </div>
      )}
      {showVictoryFlash && (
        <div
          className="fixed inset-0 pointer-events-none z-50 animate-victory-flash"
          style={{ width: "100vw", height: "100vh" }}
        ></div>
      )}
      {showVictoryText && (
        <div className="victory-text-overlay">
          <h1 className="text-8xl md:text-9xl font-bold uppercase animate-victory-text">
            Victoria
          </h1>
        </div>
      )}
      {showReinforcement && (
        <ReinforcementOverlay
          userData={userData}
          daysAfk={daysAfk}
          onClose={() => setShowReinforcement(false)}
        />
      )}

      <h1 className="text-3xl font-bold text-slate-100 text-center">
        ¡Hola, {userData.userName}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard title="Días 'AFK'" value={daysAfk} color="text-teal-400" />
        <StatCard
          title="Horas Recuperadas"
          value={formatMinutes(userData.horasRecuperadas).display}
          color="text-indigo-400"
        />
        <div className="relative">
          <StatCard
            title="Horas totales a recuperar"
            value={formatMinutes(userData.horasPorRecuperar).display}
            color="text-amber-400"
            topButton={
              <button
                className="text-xs px-4 py-1 rounded bg-amber-500/90 hover:bg-amber-600 cursor-pointer text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
                onClick={() => {
                  setHorasInput(
                    Math.floor(userData.horasPorRecuperar / 60).toString()
                  );
                  setHorasError("");
                  setShowHorasModal(true);
                }}
                title="Actualizar valor manualmente"
                style={{ minWidth: 90 }}
              >
                Actualizar
              </button>
            }
            bottomButton={
              <a
                href="https://lolvalue.com/wasted-time-lol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-4 py-1 rounded bg-slate-700 hover:bg-slate-800 text-amber-200 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg"
                title="Ir a lolvalue.com"
                style={{ minWidth: 90 }}
              >
                Ver horas
              </a>
            }
          />
          {showHorasModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-80 flex flex-col items-center animate-fade-in-scale border border-amber-400">
                <h3 className="text-lg font-bold text-amber-400 mb-2">
                  Actualizar horas a recuperar
                </h3>
                <input
                  type="number"
                  min="0"
                  value={horasInput}
                  onChange={(e) =>
                    setHorasInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full p-2 mb-2 rounded bg-slate-900 border border-amber-400 text-center text-lg text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Horas (ej: 120)"
                />
                {horasError && (
                  <p className="text-red-400 text-xs mb-2">{horasError}</p>
                )}
                <div className="flex gap-2 w-full mt-2">
                  <button
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded"
                    onClick={() => {
                      const horas = parseInt(horasInput, 10);
                      if (isNaN(horas) || horas < 0) {
                        setHorasError("Introduce un número válido de horas");
                        return;
                      }
                      setUserData((prev) => ({
                        ...prev,
                        horasPorRecuperar: horas * 60,
                      }));
                      setShowHorasModal(false);
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 rounded"
                    onClick={() => setShowHorasModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-amber-300 text-sm font-semibold -mt-1 mb-4">
        {(() => {
          const nextMilestones = [
            { n: 1, label: "Primera Sangre" },
            { n: 2, label: "Doble kill" },
            { n: 3, label: "Triple-kill" },
            { n: 4, label: "Quadra-kill" },
            { n: 5, label: "Penta-kill (¡Victoria!)" },
            { n: 6, label: "Imparable" },
            { n: 7, label: "Racha de Dios" },
            { n: 8, label: "Legendario" },
          ];
          const current = userData.killStreak;
          const next = nextMilestones.find((m) => m.n > current);
          if (next) {
            const tareasRestantes = next.n - current;
            return `Obtendrás el logro de ${next.label.toUpperCase()} al completar ${tareasRestantes} tarea${
              tareasRestantes > 1 ? "s" : ""
            } más${next.n === 5 ? " (¡Victoria!)" : ""}.`;
          } else {
            return `¡Sigue sumando racha! Próximo logro: ${
              current + 1
            } tareas seguidas.`;
          }
        })()}
      </div>

      {/* Nuevos indicadores de victorias y derrotas */}
      <div className="flex justify-center gap-8 mb-6 my-5">
        <IndicatorCard
          count={userData.activities.length}
          color="bg-teal-500"
          onClick={() =>
            setShowDetail(showDetail === "victorias" ? null : "victorias")
          }
          active={showDetail === "victorias"}
        />
        <IndicatorCard
          count={userData.defeats.length}
          color="bg-red-500"
          onClick={() =>
            setShowDetail(showDetail === "derrotas" ? null : "derrotas")
          }
          active={showDetail === "derrotas"}
        />
      </div>

      <DetailModal
        open={showDetail === "victorias"}
        onClose={() => setShowDetail(null)}
        title="Detalle de Victorias"
      >
        {userData.activities.length > 0 ? (
          userData.activities.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800 p-3 rounded-lg flex justify-between items-center mb-2 mx-2 cursor-pointer"
            >
              <div>
                <p className="text-slate-200">{entry.description}</p>
                <p className="text-xs text-slate-500">{entry.date}</p>
              </div>
              <span className="font-semibold text-teal-400">
                {formatMinutes(entry.timeSpent).display}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-4">
            Aún no has reclamado ninguna victoria.
          </p>
        )}
      </DetailModal>
      <DetailModal
        open={showDetail === "derrotas"}
        onClose={() => setShowDetail(null)}
        title="Detalle de Derrotas"
      >
        {userData.defeats.length > 0 ? (
          userData.defeats.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-800 p-3 rounded-lg flex justify-between items-center mb-2"
            >
              <div>
                <p className="text-slate-200">Partida: {entry.gameMode}</p>
                <p className="text-xs text-slate-500">{entry.date}</p>
              </div>
              <span className="font-semibold text-red-400">
                -{formatMinutes(entry.timeLost).display}
              </span>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-4">
            ¡Sin recaídas! Sigue así.
          </p>
        )}
      </DetailModal>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-slate-700">
        <div className="flex border-b border-slate-700 mb-4">
          <button
            onClick={() => setActionTab("victory")}
            className={`flex-1 py-2 font-bold text-center transition-colors ${
              actionTab === "victory"
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-slate-400"
            }`}
          >
            VICTORIA
          </button>
          <button
            onClick={() => setActionTab("defeat")}
            className={`flex-1 py-2 font-bold text-center transition-colors ${
              actionTab === "defeat"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-slate-400"
            }`}
          >
            DERROTA
          </button>
        </div>

        {actionTab === "victory" && (
          <div className="animate-fade-in-scale space-y-4">
            <h2 className="text-xl font-semibold -mt-2 mb-2 text-center text-slate-100">
              Reclamar Victoria
            </h2>
            <p className="text-sm text-center text-teal-300 -mt-2 mb-3">
              Cada tarea completada te otorga +1 Kill en tu racha.
            </p>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="¿En qué invertiste tu tiempo?"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="Horas"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="Minutos"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              onClick={handleClaimVictory}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
            >
              {ICONS.plus} <span className="ml-2">RECLAMAR VICTORIA</span>
            </button>
          </div>
        )}

        {actionTab === "defeat" && (
          <div className="animate-fade-in-scale space-y-4">
            <h2 className="text-xl font-semibold -mt-2 mb-2 text-center text-slate-100">
              Registrar Derrota
            </h2>
            <p className="text-sm text-center text-slate-400 -mt-1 mb-3">
              Una recaída no borra tu progreso. Aprende, levántate y sigue
              adelante. ¡Tú puedes!
            </p>
            <select
              value={gameMode}
              onChange={(e) =>
                setGameMode(e.target.value as DefeatEntry["gameMode"])
              }
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="Ranked">Ranked</option>
              <option value="Normales">Normales</option>
              <option value="ARAM">ARAM</option>
              <option value="TFT">TFT</option>
            </select>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                value={lostHours}
                onChange={(e) => setLostHours(e.target.value)}
                placeholder="Horas"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <input
                type="number"
                min="0"
                max="59"
                value={lostMinutes}
                onChange={(e) => setLostMinutes(e.target.value)}
                placeholder="Minutos"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            {defeatError && (
              <p className="text-red-400 text-sm text-center">{defeatError}</p>
            )}
            <button
              onClick={handleRegisterDefeat}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-transform transform hover:scale-105"
            >
              <span className="font-mono text-lg mr-2">-</span> REGISTRAR
              DERROTA
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowReinforcement(true)}
        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center mt-2"
      >
        {ICONS.shield}{" "}
        <span className="ml-2">
          Necesito motivación (¡ayúdame a no recaer!)
        </span>
      </button>
    </div>
  );
};

export default Dashboard;
