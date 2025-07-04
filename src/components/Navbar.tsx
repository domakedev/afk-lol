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
} from "react-icons/fa";

export default function Navbar() {
  const userData = useUserStore((state) => state.userData);
  const isGuest = useUserStore((state) => state.isGuest);
  const router = useRouter();
  const pathname = usePathname();

  // Mostrar solo el logo como Home si no hay usuario ni invitado
  if (!userData && !isGuest) {
    return (
      <nav className="w-full bg-slate-800/90 border-b border-slate-700 z-40 flex items-center justify-between px-4 py-2 shadow-lg backdrop-blur fixed top-0 left-0">
        <div className="flex gap-2 items-center">
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
              className="font-extrabold tracking-tight text-lg"
              style={{ fontFamily: "Russo One, sans-serif" }}
            >
              AFK LOL
            </span>
          </Link>
        </div>
        <div className="flex gap-2 items-center ml-auto">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg font-bold text-white bg-teal-500 hover:bg-teal-600 transition-all duration-150 shadow-md flex items-center gap-2"
          >
            <FaSignInAlt /> Iniciar sesión
          </Link>
          <Link
            href="/login?mode=register"
            className="px-4 py-2 rounded-lg font-bold text-teal-700 bg-white hover:bg-teal-50 border-2 border-teal-400 transition-all duration-150 shadow-md flex items-center gap-2"
          >
            <FaUserPlus /> Registrarse
          </Link>
        </div>
      </nav>
    );
  }

  // Solo mostrar si hay usuario o invitado
  if (!userData && !isGuest) return null;

  return (
    <nav className="w-full bg-slate-800/90 border-b border-slate-700 z-40 flex items-center justify-between px-4 py-2 shadow-lg backdrop-blur fixed top-0 left-0">
      <div className="flex gap-2 items-center">
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
            className="font-extrabold tracking-tight text-lg"
            style={{ fontFamily: "Russo One, sans-serif" }}
          >
            AFK LOL
          </span>
        </Link>
        <Link
          href="/dashboard"
          className={`px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-teal-600 hover:text-white transition-all duration-150 flex items-center gap-2 ${
            pathname === "/dashboard"
              ? "bg-teal-700/80 text-white shadow-md scale-105"
              : ""
          }`}
        >
          <FaTachometerAlt /> Dashboard
        </Link>
        <Link
          href="/toolkit"
          className={`px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-indigo-600 hover:text-white transition-all duration-150 flex items-center gap-2 ${
            pathname === "/toolkit"
              ? "bg-indigo-700/80 text-white shadow-md scale-105"
              : ""
          }`}
        >
          <FaToolbox /> Herramientas
        </Link>
        <Link
          href="/reconstruccion"
          className={`px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-amber-600 hover:text-white transition-all duration-150 flex items-center gap-2 ${
            pathname === "/reconstruccion"
              ? "bg-amber-700/80 text-white shadow-md scale-105"
              : ""
          }`}
        >
          <FaBrain /> Reconstrucción
        </Link>
        <Link
          href="/educacion"
          className={`px-4 py-2 rounded-lg font-bold text-slate-200 hover:bg-pink-600 hover:text-white transition-all duration-150 flex items-center gap-2 ${
            pathname === "/educacion"
              ? "bg-pink-700/80 text-white shadow-md scale-105"
              : ""
          }`}
        >
          <FaBookOpen /> Educación
        </Link>
      </div>
      <div className="flex items-center gap-3 ml-auto bg-slate-700/60 px-4 py-1 rounded-full shadow border border-slate-600">
        <span className="font-semibold text-teal-300 text-sm flex items-center gap-1">
          {userData?.email || (isGuest && "Invitado")}
        </span>
        <button
          onClick={async () => {
            await auth.signOut();
            router.push("/");
          }}
          className="px-3 py-1 cursor-pointer rounded bg-red-600 text-xs text-white font-bold transition-all duration-150 border border-slate-600 shadow-sm"
          title="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
