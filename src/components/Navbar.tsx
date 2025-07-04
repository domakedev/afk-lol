"use client";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/firebase";
import Image from "next/image";
import {
  FaTachometerAlt,
  FaToolbox,
  FaBrain,
  FaBookOpen,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { loadUserData } from "@/firebaseUserData";

export default function Navbar() {
  const userData = useUserStore((state) => state.userData);
  const isGuest = useUserStore((state) => state.isGuest);
  const setUser = useUserStore((state) => state.setUser);
  const setUserData = useUserStore((state) => state.setUserData);
  const setIsGuest = useUserStore((state) => state.setIsGuest);
  const setLoading = useUserStore((state) => state.setLoading);
  const setLoadingUserData = useUserStore((state) => state.setLoadingUserData);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sincroniza el store con el usuario de Firebase en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: unknown) => {
      setUser(user);
      if (!user) {
        setUserData(null);
        setIsGuest(false);
      } else {
        const userData = await loadUserData();
        setUserData(userData);
      }
    });
    return () => unsubscribe();
  }, [setUser, setUserData, setIsGuest]);

  // Función reutilizable para cerrar sesión y limpiar el store
  const handleSignOut = async () => {
    setLoading(true);
    setLoadingUserData(true);
    setUser(null);
    setUserData(null);
    setIsGuest(false);
    await auth.signOut();
    setLoading(false);
    setLoadingUserData(false);
    router.push("/");
  };

  // Mostrar solo el logo como Home si no hay usuario ni invitado
  if (!userData && !isGuest) {
    return (
      <nav className="w-full bg-slate-800/90 border-b border-slate-700 z-40 flex items-center justify-between px-4 py-2 shadow-lg backdrop-blur sticky top-0 left-0">
        <div className="flex gap-2 items-center">
          {/* Logo Home */}
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-teal-600 hover:text-white transition-colors ${
              pathname === "/"
                ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg scale-105"
                : ""
            }`}
          >
            <Image
              src="/logo.png"
              alt="AFK LOL"
              className="w-7 h-7 drop-shadow"
              width={28}
              height={28}
            />
            <span
              className="font-extrabold tracking-tight text-lg hidden sm:inline"
              style={{ fontFamily: "Russo One, sans-serif" }}
            >
              AFK LOL
            </span>
          </Link>
        </div>
        <div className="flex gap-2 items-center ml-auto">
          <Link
            href="/login"
            className="px-3 py-2 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 transition-all duration-150 shadow-md flex items-center gap-2 text-xs sm:text-base"
          >
            <FaSignInAlt />{" "}
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Link>
          <Link
            href="/login"
            className="px-3 py-2 rounded-lg font-bold text-teal-700 bg-white hover:bg-teal-50 border-2 border-teal-400 transition-all duration-150 shadow-md flex items-center gap-2 text-xs sm:text-base"
          >
            <FaUserPlus /> <span className="hidden sm:inline">Registrarse</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Solo mostrar si hay usuario o invitado
  if (!userData && !isGuest) return null;

  // Responsive: menú hamburguesa en móvil
  return (
    <nav className="w-full bg-slate-800/90 border-b border-slate-700 z-40 flex items-center px-4 py-2 shadow-lg backdrop-blur sticky top-0 left-0">
      {/* Izquierda: logo + enlaces */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-teal-600 hover:text-white transition-colors ${
            pathname === "/"
              ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white shadow-lg scale-105"
              : ""
          }`}
        >
          <Image
            src="/logo.png"
            alt="AFK LOL"
            className="w-7 h-7 drop-shadow"
            width={28}
            height={28}
          />
          <span
            className="font-extrabold tracking-tight text-lg  lg:inline"
            style={{ fontFamily: "Russo One, sans-serif" }}
          >
            AFK LOL
          </span>
        </Link>
        {/* Enlaces principales: ocultos en móvil, visibles en md+ */}
        <div className="hidden md:flex gap-3 items-center">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded-lg font-bold text-slate-200 hover:bg-teal-600 hover:text-white transition-all duration-150 flex items-center gap-2 text-sm ${
              pathname === "/dashboard"
                ? "bg-teal-700/80 text-white shadow-md scale-105"
                : ""
            }`}
          >
            <FaTachometerAlt />{" "}
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/toolkit"
            className={`px-3 py-2 rounded-lg font-bold text-slate-200 hover:bg-indigo-600 hover:text-white transition-all duration-150 flex items-center gap-2 text-sm ${
              pathname === "/toolkit"
                ? "bg-indigo-700/80 text-white shadow-md scale-105"
                : ""
            }`}
          >
            <FaToolbox /> <span className="hidden sm:inline">Herramientas</span>
          </Link>
          <Link
            href="/reconstruccion"
            className={`px-3 py-2 rounded-lg font-bold text-slate-200 hover:bg-amber-600 hover:text-white transition-all duration-150 flex items-center gap-2 text-sm ${
              pathname === "/reconstruccion"
                ? "bg-amber-700/80 text-white shadow-md scale-105"
                : ""
            }`}
          >
            <FaBrain /> <span className="hidden sm:inline">Reconstrucción</span>
          </Link>
          <Link
            href="/educacion"
            className={`px-3 py-2 rounded-lg font-bold text-slate-200 hover:bg-pink-600 hover:text-white transition-all duration-150 flex items-center gap-2 text-sm ${
              pathname === "/educacion"
                ? "bg-pink-700/80 text-white shadow-md scale-105"
                : ""
            }`}
          >
            <FaBookOpen /> <span className="hidden sm:inline">Educación</span>
          </Link>
        </div>
      </div>
      {/* Botón hamburguesa solo en móvil, alineado a la derecha */}
      <button
        className="ml-2 flex md:hidden p-2 rounded hover:bg-slate-700 transition-colors"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>
      {/* Controles de usuario: solo visibles en desktop, alineados a la derecha */}
      <div className="hidden md:flex items-center gap-4 bg-gradient-to-r from-teal-800/80 to-slate-800/80 px-4 py-1 rounded-full shadow-lg border border-teal-500/40 text-sm ml-4 transition-all duration-200">
        <span className="font-semibold text-teal-200 flex items-center gap-2 px-2">
          <FaUserPlus className="text-teal-400 text-lg" />
          {userData?.email || "Invitado"}
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-700 text-white font-bold shadow-md border border-red-400/40 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
          title="Cerrar sesión"
        >
          <FaSignInAlt className="text-base" />
          <span className="hidden lg:inline">Cerrar sesión</span>
        </button>
      </div>
      {/* Menú móvil: visible solo si menuOpen y en pantallas pequeñas */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex"
          style={{ top: 0, left: 0, width: "100vw", height: "100vh" }}
          onClick={() => setMenuOpen(false)}
        >
          <aside
            className="relative h-full w-4/5 max-w-xs bg-slate-900 shadow-2xl flex flex-col gap-2 p-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-2xl"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes />
            </button>
            <Link
              href="/dashboard"
              className={`px-3 py-3 rounded-lg font-bold text-slate-200 hover:bg-teal-600 hover:text-white transition-all duration-150 flex items-center gap-3 text-base ${
                pathname === "/dashboard"
                  ? "bg-teal-700/80 text-white shadow-md scale-105"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link
              href="/toolkit"
              className={`px-3 py-3 rounded-lg font-bold text-slate-200 hover:bg-indigo-600 hover:text-white transition-all duration-150 flex items-center gap-3 text-base ${
                pathname === "/toolkit"
                  ? "bg-indigo-700/80 text-white shadow-md scale-105"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <FaToolbox /> Herramientas
            </Link>
            <Link
              href="/reconstruccion"
              className={`px-3 py-3 rounded-lg font-bold text-slate-200 hover:bg-amber-600 hover:text-white transition-all duration-150 flex items-center gap-3 text-base ${
                pathname === "/reconstruccion"
                  ? "bg-amber-700/80 text-white shadow-md scale-105"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <FaBrain /> Reconstrucción
            </Link>
            <Link
              href="/educacion"
              className={`px-3 py-3 rounded-lg font-bold text-slate-200 hover:bg-pink-600 hover:text-white transition-all duration-150 flex items-center gap-3 text-base ${
                pathname === "/educacion"
                  ? "bg-pink-700/80 text-white shadow-md scale-105"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <FaBookOpen /> Educación
            </Link>
            <div className="mt-6 flex flex-col gap-2 border-t border-slate-600 pt-4">
              <span className="font-semibold text-teal-300 flex items-center gap-1">
                {userData?.email || (isGuest && "Invitado")}
              </span>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await handleSignOut();
                }}
                className="px-3 py-2 cursor-pointer rounded bg-red-600 text-white font-bold transition-all duration-150 flex items-center gap-2 hover:bg-red-700 hover:transform hover:scale-105"
                title="Cerrar sesión"
              >
                <FaSignInAlt /> Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
}

// Animación para el menú móvil (puedes añadir esto a tu CSS global o tailwind.config.js)
// .animate-slide-in { animation: slideIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes slideIn { from { transform: translateX(-100%); opacity: 0.5; } to { transform: translateX(0); opacity: 1; } }
