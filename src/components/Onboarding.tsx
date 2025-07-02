"use client";

import React, { useState } from "react";
import { UserData } from "@/types";
import { ASSESSMENT_QUESTIONS, ICONS } from "@/constants";

interface OnboardingProps {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const Onboarding: React.FC<OnboardingProps> = ({ setUserData }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<number[]>(
    Array(ASSESSMENT_QUESTIONS.length).fill(-1)
  );
  const [commitment, setCommitment] = useState("");
  const [dayZero, setDayZero] = useState("");
  const [horasPorRecuperar, setHorasPorRecuperar] = useState("");

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
    setUserData((prev) => ({
      ...prev,
      onboardingComplete: true,
      userName: name,
      assessmentScore: calculateScore(),
      commitment,
      dayZero,
      horasPorRecuperar: horasEnMinutos,
    }));
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
              Estás dando el primer paso para recuperar tu vida. Estamos aquí
              para apoyarte en cada momento de este viaje.
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
            >
              Comenzar {ICONS.arrowRight}
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
              Puede ser tu nombre real o un apodo.
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre o apodo"
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
              Declaración de Compromiso
            </h2>
            <p className="text-slate-400 mb-6">
              ¿Por qué quieres hacer esto? Escribir tus razones personales
              refuerza tu motivación. Vuelve a leer esto cuando necesites
              fuerza.
            </p>
            <textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Ej: 'Quiero dejar de jugar para mejorar mis notas, pasar más tiempo con mi familia y sentirme más sano y con más energía...'"
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
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm"
              >
                Inicié Ayer
              </button>
              <button
                onClick={() => setDayZero(getFormattedDate(0))}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm"
              >
                Hoy
              </button>
              <button
                onClick={() => setDayZero(getFormattedDate(1))}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg text-sm"
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
              Establece tu Meta de Recuperación
            </h2>
            <p className="text-slate-400 mb-6">
              ¿Cuántas horas estimas que has perdido en el juego? Sé honesto
              contigo mismo. Este será tu objetivo principal a recuperar.
            </p>
            <input
              type="number"
              value={horasPorRecuperar}
              onChange={(e) => setHorasPorRecuperar(e.target.value)}
              placeholder="Ej: 1500"
              min="1"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4" id="onboarding">
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl border border-slate-700">
        <div className="min-h-[400px] flex flex-col justify-center">
          {renderStep()}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {step > 0 ? (
            <button
              onClick={handlePrev}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded-lg flex items-center"
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
                className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold py-2 px-4 rounded-lg"
              >
                Omitir por ahora
              </button>
            )}
            {step < 5 && step > 0 && (
              <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center"
              >
                <span className="mr-2">Siguiente</span> {ICONS.arrowRight}
              </button>
            )}
            {step === 5 && (
              <button
                onClick={handleSubmit}
                disabled={isNextDisabled()}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center"
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
