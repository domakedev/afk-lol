"use client";

import React, { useState } from "react";
import { UserData } from "@/types";
import { ASSESSMENT_QUESTIONS, ICONS } from "@/constants";
import { saveUserData } from "@/firebaseUserData";
import { useUserStore } from "../store/userStore";
import { useRouter } from "next/navigation";

const Onboarding: React.FC = () => {
  const setUserData = useUserStore((state) => state.setUserData);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<number[]>(
    Array(ASSESSMENT_QUESTIONS.length).fill(-1)
  );
  const [commitment, setCommitment] = useState("");
  const [dayZero, setDayZero] = useState("");
  const [horasPorRecuperar, setHorasPorRecuperar] = useState("");

  const router = useRouter();

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const getFormattedDate = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split("T")[0];
  };

  const calculateScore = () => answers.filter((a) => a === 1).length;
  const allQuestionsAnswered = answers.every((a) => a !== -1);

  const handleSubmit = () => {
    if (
      !name ||
      !commitment ||
      !dayZero ||
      !horasPorRecuperar ||
      parseInt(horasPorRecuperar) <= 0
    ) {
      alert("Por favor, completa todos los campos con valores válidos.");
      return;
    }
    const horasEnMinutos = parseInt(horasPorRecuperar, 10) * 60;
    const newUserData: UserData = {
      onboardingComplete: true,
      userName: name,
      assessmentScore: calculateScore(),
      commitment,
      dayZero,
      horasPorRecuperar: horasEnMinutos,
      horasRecuperadas: 0,
      killStreak: 0,
      activities: [],
      goals: [],
      routines: [],
      triggers: [],
      cbtEntries: [],
      defeats: [],
      email: null,
    };
    setUserData(newUserData);
    saveUserData(newUserData); // <-- Guardar en Firestore inmediatamente
    //evniar a la página de dashboard
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-400 mb-4">
              Bienvenido/a a LOL AFK
            </h1>
            <p className="text-lg text-slate-300 mb-8">
              Hoy inicias un camino de cambio real. No estás solo/a: cada paso,
              por pequeño que sea, es una victoria. ¡Vamos juntos!
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-teal-500 cursor-pointer hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-1"
            >
              Comenzar{ICONS.arrowRight}
            </button>
          </div>
        );
      case 1: // Name
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-slate-100">
              Primero, ¿cómo te gustaría que te llamemos?
            </h2>
            <p className="text-slate-400 mb-6">
              Puede ser tu nombre real, un apodo o algo que te inspire.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre o apodo preferido"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        );
      case 2: // Assessment
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-100">
              Autoevaluación Inicial
            </h2>
            <p className="text-slate-400 mb-6">
              Responde honestamente. No hay respuestas correctas o incorrectas.
            </p>
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
              {ASSESSMENT_QUESTIONS.map((q, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded-lg">
                  <p className="mb-3 text-slate-300">
                    {i + 1}. {q}
                  </p>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={answers[i] === 1}
                        onChange={() => handleAnswerChange(i, 1)}
                        className="form-radio h-5 w-5 text-teal-500 bg-slate-700 border-slate-600 focus:ring-teal-500"
                      />
                      <span>Sí</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q${i}`}
                        checked={answers[i] === 0}
                        onChange={() => handleAnswerChange(i, 0)}
                        className="form-radio h-5 w-5 text-red-500 bg-slate-700 border-slate-600 focus:ring-red-500"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {allQuestionsAnswered && (
              <p className="mt-6 text-center text-teal-400 font-semibold">
                Tu puntuación: {calculateScore()} /{" "}
                {ASSESSMENT_QUESTIONS.length}
              </p>
            )}
          </div>
        );
      case 3: // Commitment
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-100">
              ¿Cuál es tu mayor motivación para dejar LoL?
            </h2>
            <p className="text-slate-400 mb-6">
              Escribe tus razones personales. Volver a leerlas te dará fuerza en
              los momentos difíciles. Sé honesto/a contigo mismo/a.
            </p>
            <textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Ej: 'Quiero recuperar mi tiempo, mejorar mi salud mental y disfrutar más de mi vida real.'"
              rows={8}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        );
      case 4: // Day Zero
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-100">
              Configura tu &quot;Día Cero&quot;
            </h2>
            <p className="text-slate-400 mb-6">
              Elige la fecha en la que te comprometes a irte &quot;AFK&quot; del
              juego. Este es el inicio de tu nueva partida en la vida real.
            </p>
            <input
              type="date"
              value={dayZero}
              onChange={(e) => setDayZero(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none appearance-none"
              style={{ colorScheme: "dark" }}
            />
            <div className="flex justify-around mt-4 space-x-2">
              <button
                onClick={() => setDayZero(getFormattedDate(-1))}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm cursor-pointer"
              >
                Inicié Ayer
              </button>
              <button
                onClick={() => setDayZero(getFormattedDate(0))}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm cursor-pointer"
              >
                Hoy
              </button>
              <button
                onClick={() => setDayZero(getFormattedDate(1))}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm cursor-pointer"
              >
                Mañana
              </button>
            </div>
          </div>
        );
      case 5: // Horas por Recuperar
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-slate-100">
              ¿Cuánto tiempo perdido quieres recuperar?
            </h2>
            <p className="text-slate-400 mb-6">
              Estima las horas que dedicaste al juego. Este será tu objetivo de
              recuperación. Recuerda: cada minuto que recuperes es un logro.
            </p>
            <input
              type="number"
              value={horasPorRecuperar}
              onChange={(e) => setHorasPorRecuperar(e.target.value)}
              placeholder="Ej: 1500"
              min="1"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <div className="mt-8 flex flex-col items-start">
              <a
                href="https://lolvalue.com/wasted-time-lol"
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-fit px-4 max-w-xs bg-yellow-400/90 hover:bg-yellow-300 text-slate-900 font-semibold text-sm rounded-lg shadow p-2 border border-amber-300 mb-1 transition-all duration-700 ease-out"
              >
                <div className="flex flex-row items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-amber-600 group-hover:text-yellow-500 transition-colors duration-700 ease-out"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a5.25 5.25 0 11-7.43-7.43 5.25 5.25 0 017.43 7.43z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 19.5L15 15"
                    />
                  </svg>
                  <span className="text-center">Consulta tu tiempo exacto</span>
                </div>
              </a>
              <span className="text-xs text-slate-400 mt-1 ml-1">
                Se abrirá una página externa: lolvalue.com
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !name) return true;
    if (step === 2 && !allQuestionsAnswered) return true;
    if (step === 3 && !commitment) return true;
    if (step === 4 && !dayZero) return true;
    if (step === 5 && (!horasPorRecuperar || parseInt(horasPorRecuperar) <= 0))
      return true;
    return false;
  };

  return (
    <div
      className="min-h-full min-w-full bg-slate-900 flex flex-col justify-center items-center p-4"
      id="onboarding"
    >
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-slate-700">
        <div className="min-h-[400px] flex flex-col justify-center">
          {renderStep()}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {step > 0 ? (
            <button
              onClick={handlePrev}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg flex items-center cursor-pointer"
            >
              {ICONS.arrowLeft} <span className="ml-2">Anterior</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-4">
            {step === 2 && (
              <button
                onClick={handleNext}
                className="bg-slate-600 cursor-pointer hover:bg-slate-500 text-slate-200 font-bold py-2 px-4 rounded-lg"
              >
                Omitir por ahora
              </button>
            )}
            {step < 5 && step > 0 && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center cursor-pointer"
              >
                <span className="mr-2">Siguiente</span> {ICONS.arrowRight}
              </button>
            )}
            {step === 5 && (
              <button
                onClick={handleSubmit}
                disabled={isNextDisabled()}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center cursor-pointer"
              >
                Completar y Empezar {ICONS.check}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
