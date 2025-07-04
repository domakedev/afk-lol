"use client";
import React, { useState, useEffect } from "react";
import { TriggerEntry, CbtEntry } from "@/types";
import { ICONS } from "@/constants";
import { useUserStore } from "../../store/userStore";
import type { UserData } from "@/types";

const Toolkit: React.FC = () => {
  // Forzamos el tipado de userData como UserData | undefined
  const userData = useUserStore((state) => state.userData) as
    | UserData
    | undefined;
  const updateUserData = useUserStore((state) => state.updateUserData);

  // Garantiza que triggers y cbtEntries sean arrays aunque no existan en userData
  const triggers: TriggerEntry[] = Array.isArray(userData?.triggers)
    ? userData!.triggers
    : [];
  const cbtEntries: CbtEntry[] = Array.isArray(userData?.cbtEntries)
    ? userData!.cbtEntries
    : [];

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showSOS, setShowSOS] = useState(false);

  // Trigger Log State
  const [triggerSituation, setTriggerSituation] = useState("");
  const [triggerThought, setTriggerThought] = useState("");
  const [triggerFeeling, setTriggerFeeling] = useState("");
  const [triggerAction, setTriggerAction] = useState("");

  // CBT Journal State
  const [cbtSituation, setCbtSituation] = useState("");
  const [cbtAutoThought, setCbtAutoThought] = useState("");
  const [cbtEvidenceFor, setCbtEvidenceFor] = useState("");
  const [cbtEvidenceAgainst, setCbtEvidenceAgainst] = useState("");
  const [cbtAltThought, setCbtAltThought] = useState("");
  const [cbtOutcome, setCbtOutcome] = useState("");

  const addTrigger = () => {
    if (
      !triggerSituation ||
      !triggerThought ||
      !triggerFeeling ||
      !triggerAction
    )
      return;
    const newTrigger: TriggerEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("es-ES"),
      situation: triggerSituation,
      thought: triggerThought,
      feeling: triggerFeeling,
      action: triggerAction,
    };
    updateUserData({ triggers: [newTrigger, ...triggers] });
    setTriggerSituation("");
    setTriggerThought("");
    setTriggerFeeling("");
    setTriggerAction("");
    setActiveTool(null);
  };

  const addCbtEntry = () => {
    if (!cbtSituation || !cbtAutoThought || !cbtAltThought) return;
    const newEntry: CbtEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString("es-ES"),
      situation: cbtSituation,
      automaticThought: cbtAutoThought,
      evidenceFor: cbtEvidenceFor,
      evidenceAgainst: cbtEvidenceAgainst,
      alternativeThought: cbtAltThought,
      outcome: cbtOutcome,
    };
    updateUserData({ cbtEntries: [newEntry, ...cbtEntries] });
    // Reset fields
    setCbtSituation("");
    setCbtAutoThought("");
    setCbtEvidenceFor("");
    setCbtEvidenceAgainst("");
    setCbtAltThought("");
    setCbtOutcome("");
    setActiveTool(null);
  };

  const SOSModal = () => {
    const [breathingStep, setBreathingStep] = useState(0);

    useEffect(() => {
      if (!showSOS) return;
      const timer = setTimeout(
        () => {
          setBreathingStep((s) => (s + 1) % 4);
        },
        breathingStep % 2 === 0 ? 4000 : 7000
      ); // 4s inhale, 7s exhale
      return () => clearTimeout(timer);
    }, [breathingStep]);

    const breathText = [
      "Inhala (4s)",
      "Sostén (4s)",
      "Exhala (7s)",
      "Pausa (4s)",
    ];
    if (!showSOS) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
        <h2 className="text-3xl font-bold text-teal-400 mb-8">
          Respira Profundo y Relájate
        </h2>
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className={`absolute inset-0 bg-teal-500 rounded-full transition-transform duration-[4000ms] ease-in-out ${
              breathingStep % 2 === 0 ? "scale-100" : "scale-50"
            }`}
          ></div>
          <p className="relative text-2xl font-semibold text-white">
            {breathText[breathingStep]}
          </p>
        </div>
        <p className="mt-8 text-slate-300 text-center">
          Concéntrate en tu respiración. El impulso pasará.
        </p>
        <button
          onClick={() => setShowSOS(false)}
          className="absolute top-4 right-4 text-white"
        >
          {ICONS.close}
        </button>
      </div>
    );
  };

  const renderTool = () => {
    switch (activeTool) {
      case "trigger":
        return (
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">
              Registrar Desencadenante
            </h3>
            <div className="space-y-4">
              <input
                value={triggerSituation}
                onChange={(e) => setTriggerSituation(e.target.value)}
                placeholder="Situación (¿Dónde estabas?)"
                className="w-full p-2 bg-slate-700 rounded"
              />
              <input
                value={triggerThought}
                onChange={(e) => setTriggerThought(e.target.value)}
                placeholder="Pensamiento (¿Qué pensaste?)"
                className="w-full p-2 bg-slate-700 rounded"
              />
              <input
                value={triggerFeeling}
                onChange={(e) => setTriggerFeeling(e.target.value)}
                placeholder="Sentimiento (¿Cómo te sentiste?)"
                className="w-full p-2 bg-slate-700 rounded"
              />
              <input
                value={triggerAction}
                onChange={(e) => setTriggerAction(e.target.value)}
                placeholder="Acción (¿Qué hiciste?)"
                className="w-full p-2 bg-slate-700 rounded"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setActiveTool(null)}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addTrigger}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        );
      case "cbt":
        return (
          <div className="p-4 bg-slate-800 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">
              Diario de Reestructuración Cognitiva
            </h3>
            <div className="space-y-3">
              <textarea
                value={cbtSituation}
                onChange={(e) => setCbtSituation(e.target.value)}
                placeholder="Situación"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
              <textarea
                value={cbtAutoThought}
                onChange={(e) => setCbtAutoThought(e.target.value)}
                placeholder="Pensamiento Automático ('Necesito jugar ahora mismo')"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
              <textarea
                value={cbtEvidenceFor}
                onChange={(e) => setCbtEvidenceFor(e.target.value)}
                placeholder="Evidencia a favor de este pensamiento"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
              <textarea
                value={cbtEvidenceAgainst}
                onChange={(e) => setCbtEvidenceAgainst(e.target.value)}
                placeholder="Evidencia en contra"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
              <textarea
                value={cbtAltThought}
                onChange={(e) => setCbtAltThought(e.target.value)}
                placeholder="Pensamiento Alternativo y más equilibrado"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
              <textarea
                value={cbtOutcome}
                onChange={(e) => setCbtOutcome(e.target.value)}
                placeholder="Resultado: ¿Cómo te sientes ahora?"
                className="w-full p-2 bg-slate-700 rounded"
                rows={2}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setActiveTool(null)}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addCbtEntry}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTool("trigger")}
                className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition"
              >
                <h3 className="font-semibold text-lg text-teal-400">
                  Registro de Desencadenantes
                </h3>
                <p className="text-slate-400 text-sm">
                  Identifica qué te lleva a querer jugar.
                </p>
              </button>
              <button
                onClick={() => setActiveTool("cbt")}
                className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition"
              >
                <h3 className="font-semibold text-lg text-teal-400">
                  Desafío del Pensamiento
                </h3>
                <p className="text-slate-400 text-sm">
                  Cuestiona y cambia los pensamientos que no te ayudan.
                </p>
              </button>
              <button className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition">
                <h3 className="font-semibold text-lg text-teal-400">
                  Guía de Solución de Problemas
                </h3>
                <p className="text-slate-400 text-sm">
                  Enfrenta desafíos de la vida real (próximamente).
                </p>
              </button>
            </div>
          </>
        );
    }
  };

  // Mostrar últimos registros en la UI
  const renderRecentEntries = () => (
    <div className="mt-12">
      <h2 className="text-3xl font-extrabold text-center text-teal-300 mb-8 tracking-tight drop-shadow-lg">
        Últimos registros
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 border border-teal-700/40">
          <h3 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
            ⚡ Desencadenantes recientes
          </h3>
          {triggers.length > 0 ? (
            <ul className="space-y-4">
              {triggers.slice(0, 3).map((trigger: TriggerEntry) => {
                const [fecha, hora] = trigger.date.split(",");
                return (
                  <li
                    key={trigger.id}
                    className="bg-slate-700/80 rounded-xl p-4 text-slate-100 shadow-md border-l-4 border-teal-500 hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="bg-teal-700/80 text-xs px-2 py-1 rounded-full font-semibold text-teal-100">
                        {fecha?.trim()}
                      </span>
                      <span className="bg-slate-600/80 text-xs px-2 py-1 rounded-full font-semibold text-slate-200">
                        {hora?.trim()}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Situación:
                      </span>{" "}
                      {trigger.situation}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Pensamiento:
                      </span>{" "}
                      {trigger.thought}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Sentimiento:
                      </span>{" "}
                      {trigger.feeling}
                    </div>
                    <div>
                      <span className="font-bold text-teal-400">Acción:</span>{" "}
                      {trigger.action}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-slate-500 text-center py-8">
              No hay desencadenantes registrados.
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 border border-teal-700/40">
          <h3 className="text-xl font-bold text-teal-400 mb-4 flex items-center gap-2">
            📖 Diario de Reestructuración Cognitiva (CBT)
          </h3>
          {cbtEntries.length > 0 ? (
            <ul className="space-y-4">
              {cbtEntries.slice(0, 3).map((entry: CbtEntry) => {
                const [fecha, hora] = entry.date.split(",");
                return (
                  <li
                    key={entry.id}
                    className="bg-slate-700/80 rounded-xl p-4 text-slate-100 shadow-md border-l-4 border-teal-500 hover:scale-[1.02] transition-transform"
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="bg-teal-700/80 text-xs px-2 py-1 rounded-full font-semibold text-teal-100">
                        {fecha?.trim()}
                      </span>
                      <span className="bg-slate-600/80 text-xs px-2 py-1 rounded-full font-semibold text-slate-200">
                        {hora?.trim()}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Situación:
                      </span>{" "}
                      {entry.situation}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Pensamiento automático:
                      </span>{" "}
                      {entry.automaticThought}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Evidencia a favor:
                      </span>{" "}
                      {entry.evidenceFor}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Evidencia en contra:
                      </span>{" "}
                      {entry.evidenceAgainst}
                    </div>
                    <div className="mb-1">
                      <span className="font-bold text-teal-400">
                        Pensamiento alternativo:
                      </span>{" "}
                      {entry.alternativeThought}
                    </div>
                    <div>
                      <span className="font-bold text-teal-400">
                        Resultado:
                      </span>{" "}
                      {entry.outcome}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-slate-500 text-center py-8">
              No hay registros CBT.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      <SOSModal />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">
          Caja de Herramientas
        </h1>
        <button
          onClick={() => setShowSOS(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-full shadow-lg animate-pulse"
        >
          S.O.S
        </button>
      </div>
      <p className="text-slate-400">
        Usa estas técnicas de TCC para manejar los impulsos y cambiar tus
        patrones de pensamiento.
      </p>
      {renderTool()}
      {renderRecentEntries()}
    </div>
  );
};

export default Toolkit;
