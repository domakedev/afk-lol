import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors,
  } = useForm<{ email: string; pass: string }>();
  const [error, setError] = useState("");

  const onSubmit = async (data: { email: string; pass: string }) => {
    setError("");
    clearErrors();
    try {
      await signInWithEmailAndPassword(auth, data.email, data.pass);
      onLogin();
    } catch {
      setError("Usuario o contraseña incorrectos");
      setFormError("email", { type: "manual", message: " " });
      setFormError("pass", { type: "manual", message: " " });
    }
  };

  const onRegister = async (data: { email: string; pass: string }) => {
    setError("");
    clearErrors();
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.pass);
      onLogin();
    } catch {
      setError("No se pudo registrar");
      setFormError("email", { type: "manual", message: " " });
      setFormError("pass", { type: "manual", message: " " });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm bg-slate-800/80 rounded-2xl shadow-2xl border border-slate-700 p-8 flex flex-col gap-6 animate-fade-in-scale">
        <h1 className="text-2xl font-bold text-center text-teal-400 mb-2 drop-shadow">
          Iniciar sesión
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...formRegister("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Email inválido",
                },
              })}
              placeholder="Email"
              className={`w-full p-3 bg-slate-900 border rounded-lg text-slate-200 focus:ring-2 focus:outline-none placeholder:text-slate-500 ${
                errors.email
                  ? "border-red-500 focus:ring-red-400"
                  : "border-slate-700 focus:ring-teal-500"
              }`}
              autoComplete="email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </div>
            )}
          </div>
          <div>
            <input
              {...formRegister("pass", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Mínimo 6 caracteres",
                },
              })}
              placeholder="Contraseña"
              type="password"
              className={`w-full p-3 bg-slate-900 border rounded-lg text-slate-200 focus:ring-2 focus:outline-none placeholder:text-slate-500 ${
                errors.pass
                  ? "border-red-500 focus:ring-red-400"
                  : "border-slate-700 focus:ring-teal-500"
              }`}
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {errors.pass && (
              <div className="text-red-400 text-xs mt-1">
                {errors.pass.message}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-400 text-center text-sm -mt-2">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={handleSubmit(onRegister)}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </div>
    </div>
  );
}
