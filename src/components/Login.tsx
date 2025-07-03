import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";

export default function Login({
  onLogin,
  onCancel,
}: {
  onLogin: () => void;
  onCancel?: () => void;
}) {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
    clearErrors,
  } = useForm<{ email: string; pass: string }>();
  const [error, setError] = useState("");
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  const onSubmit = async (data: { email: string; pass: string }) => {
    setError("");
    clearErrors();
    setIsSubmittingLogin(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.pass);
      onLogin();
    } catch {
      setError("Usuario o contraseña incorrectos");
      setFormError("email", { type: "manual", message: " " });
      setFormError("pass", { type: "manual", message: " " });
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const onRegister = async (data: { email: string; pass: string }) => {
    setError("");
    clearErrors();
    setIsSubmittingRegister(true);
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        // Vincular cuenta anónima con email
        const credential = EmailAuthProvider.credential(data.email, data.pass);
        await linkWithCredential(auth.currentUser, credential);
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.pass);
      }
      onLogin();
    } catch {
      setError("No se pudo registrar");
      setFormError("email", { type: "manual", message: " " });
      setFormError("pass", { type: "manual", message: " " });
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
      {typeof onCancel === "function" && (
        <button
          onClick={onCancel}
          className="fixed left-6 top-6 flex items-center gap-2 bg-slate-800/90 border border-slate-700 text-teal-400 hover:bg-slate-700 hover:text-white font-bold text-base px-5 py-2 rounded-full shadow-lg transition-all duration-200 z-50 backdrop-blur cursor-pointer"
          type="button"
        >
          <FaArrowLeft />
          <span className="tracking-tight">Volver</span>
        </button>
      )}
      <div className="w-full max-w-sm bg-slate-800/80 rounded-2xl shadow-2xl border border-slate-700 p-8 flex flex-col gap-6 animate-fade-in-scale relative">
        <h1 className="text-2xl font-bold text-center text-teal-400 mb-2 drop-shadow">
          Bienvenido
        </h1>
        <div className="flex flex-col gap-1 text-center"></div>
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
              disabled={isSubmittingLogin || isSubmittingRegister}
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
              disabled={isSubmittingLogin || isSubmittingRegister}
            />
            {errors.pass && (
              <div className="text-red-400 text-xs mt-1">
                {errors.pass.message}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-400 text-center text-sm -mt-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            disabled={isSubmittingLogin}
          >
            <span>{isSubmittingLogin ? "Entrando..." : "Iniciar sesión"}</span>
          </button>
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={handleSubmit(onRegister)}
              className="w-full bg-amber-500/90 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex flex-col items-center cursor-pointer"
              disabled={isSubmittingRegister}
            >
              <span>
                {isSubmittingRegister ? "Registrando..." : "Crear nueva cuenta"}
              </span>
            </button>
            <p className="text-xs w-full text-center text-slate-400">
              Al hacer <span className="font-bold">click</span> crearás una
              cuenta nueva
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
