"use client";
import React, { useState } from "react";
import {  Goal, Routine } from "@/types";
import { ICONS } from "@/constants";
import { useUserStore } from "../../store/userStore";
import { saveUserData } from "@/firebaseUserData";

const Reconstruction: React.FC = () => {
  const userData = useUserStore((state) => state.userData)!;
  const updateUserData = useUserStore((state) => state.updateUserData);

  const [activeView, setActiveView] = useState("menu");

  // Goal state
  const [goalText, setGoalText] = useState("");
  const [goalArea, setGoalArea] = useState<
    "personal" | "profesional" | "salud" | "social"
  >("personal");
  const [goalDeadline, setGoalDeadline] = useState("");

  // Routine state
  const [routineText, setRoutineText] = useState("");
  const [routineTime, setRoutineTime] = useState("");

  const hobbies = [
    "Aprender a tocar un instrumento",
    "Senderismo o caminar en la naturaleza",
    "Cocinar o probar nuevas recetas",
    "Leer un libro de un género nuevo",
    "Empezar un pequeño jardín",
    "Dibujo o pintura",
    "Yoga o meditación",
    "Unirse a un club deportivo local",
    "Aprender a programar",
    "Fotografía",
  ];
  const [randomHobby, setRandomHobby] = useState(hobbies[0]);

  const addGoal = () => {
    if (!goalText || !goalDeadline) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: goalText,
      area: goalArea,
      deadline: goalDeadline,
      isCompleted: false,
    };
    updateUserData({ goals: [newGoal, ...userData.goals] });
    setGoalText("");
    setGoalDeadline("");
  };

  const toggleGoal = (id: string) => {
    updateUserData({
      goals: userData.goals.map((g) =>
        g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
      ),
    });
  };

  const addRoutine = () => {
    if (!routineText || !routineTime) return;
    const newRoutine: Routine = {
      id: Date.now().toString(),
      text: routineText,
      time: routineTime,
      isCompleted: false,
    };
    updateUserData({
      routines: [...userData.routines, newRoutine].sort((a, b) =>
        a.time.localeCompare(b.time)
      ),
    });
    setRoutineText("");
    setRoutineTime("");
  };

  // Persistencia automática en Firebase
  React.useEffect(() => {
    if (userData) {
      saveUserData(userData);
    }
  }, [userData]);

  const renderView = () => {
    switch (activeView) {
      case "routines":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">
              Constructor de Rutinas
            </h3>
            <div className="bg-slate-800 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                value={routineText}
                onChange={(e) => setRoutineText(e.target.value)}
                placeholder="Ej: Hacer ejercicio"
                className="w-full p-2 bg-slate-700 rounded"
              />
              <input
                type="time"
                value={routineTime}
                onChange={(e) => setRoutineTime(e.target.value)}
                className="w-full p-2 bg-slate-700 rounded"
              />
              <button
                onClick={addRoutine}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              >
                Añadir a la Rutina
              </button>
            </div>
            <div className="space-y-2">
              {userData.routines.map((r) => (
                <div
                  key={r.id}
                  className="bg-slate-800 p-3 rounded-lg flex items-center justify-between"
                >
                  <span className="font-mono text-teal-400">{r.time}</span>
                  <span className="text-slate-200">{r.text}</span>
                  <button className="text-slate-500 hover:text-red-500">
                    {ICONS.close}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case "goals":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">
              Establecimiento de Metas (SMART)
            </h3>
            <div className="bg-slate-800 p-4 rounded-lg mb-4 space-y-3">
              <input
                type="text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Meta específica..."
                className="w-full p-2 bg-slate-700 rounded"
              />
              <select
                value={goalArea}
                onChange={(e) => setGoalArea(e.target.value as Goal["area"])}
                className="w-full p-2 bg-slate-700 rounded"
              >
                <option value="personal">Personal</option>
                <option value="profesional">Profesional/Académico</option>
                <option value="salud">Salud</option>
                <option value="social">Social</option>
              </select>
              <input
                type="date"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className="w-full p-2 bg-slate-700 rounded"
              />
              <button
                onClick={addGoal}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              >
                Añadir Meta
              </button>
            </div>
            <div className="space-y-2">
              {userData.goals.map((g) => (
                <div
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className={`bg-slate-800 p-3 rounded-lg flex items-center cursor-pointer ${
                    g.isCompleted ? "opacity-50" : ""
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 ${
                      g.isCompleted
                        ? "bg-teal-500"
                        : "border-2 border-slate-500"
                    }`}
                  >
                    {g.isCompleted && ICONS.check}
                  </div>
                  <div className="flex-grow">
                    <p
                      className={`text-slate-200 ${
                        g.isCompleted ? "line-through" : ""
                      }`}
                    >
                      {g.text}
                    </p>
                    <p className="text-xs text-slate-400">
                      {g.area} - Hasta {g.deadline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "hobbies":
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">
              Explorador de Hobbies
            </h3>
            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <p className="text-lg text-slate-300 mb-4">
                &quot;Recupera tu tiempo&quot; probando algo nuevo. Aquí tienes
                una idea:
              </p>
              <p className="text-2xl font-bold text-teal-400 mb-6">
                {randomHobby}
              </p>
              <button
                onClick={() =>
                  setRandomHobby(
                    hobbies[Math.floor(Math.random() * hobbies.length)]
                  )
                }
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
              >
                Sugerir Otro
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveView("routines")}
              className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition"
            >
              <h3 className="font-semibold text-lg text-teal-400">
                Constructor de Rutinas
              </h3>
              <p className="text-slate-400 text-sm">
                Establece hábitos de sueño, ejercicio y alimentación.
              </p>
            </button>
            <button
              onClick={() => setActiveView("goals")}
              className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition"
            >
              <h3 className="font-semibold text-lg text-teal-400">
                Establecimiento de Metas
              </h3>
              <p className="text-slate-400 text-sm">
                Define y sigue tus objetivos con la metodología SMART.
              </p>
            </button>
            <button
              onClick={() => setActiveView("hobbies")}
              className="bg-slate-800 p-6 rounded-lg text-left hover:bg-slate-700 transition"
            >
              <h3 className="font-semibold text-lg text-teal-400">
                Explorador de Hobbies
              </h3>
              <p className="text-slate-400 text-sm">
                Encuentra nuevas actividades que te apasionen.
              </p>
            </button>
            <div className="bg-slate-800 p-6 rounded-lg text-left opacity-50">
              <h3 className="font-semibold text-lg text-teal-400">
                Gestión del Tiempo
              </h3>
              <p className="text-slate-400 text-sm">
                Pomodoro y Matriz de Eisenhower (próximamente).
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-100">Reconstrucción</h1>
        {activeView !== "menu" && (
          <button
            onClick={() => setActiveView("menu")}
            className="text-teal-400 hover:text-teal-300"
          >
            Volver
          </button>
        )}
      </div>
      <p className="text-slate-400">
        Recupera tu tiempo construyendo una vida con propósito fuera del juego.
      </p>
      {renderView()}
    </div>
  );
};

export default Reconstruction;
