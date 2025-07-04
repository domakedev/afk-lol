import React from "react";
import { motion } from "framer-motion";

interface PillsProps {
  userKillStreak: number;
  brokenPill: string | null;
  setBrokenPill: (key: string | null) => void;
}

const gradients = [
  "linear-gradient(270deg,#14b8a6,#06b6d4,#6366f1,#14b8a6)",
  "linear-gradient(270deg,#ef4444,#f97316,#ea580c,#ef4444)",
  "linear-gradient(270deg,#f59e0b,#b45309,#f59e0b,#b45309)",
  "linear-gradient(270deg,#6366f1,#a21caf,#f472b6,#6366f1)",
  "linear-gradient(270deg,#f97316,#ea580c,#be185d,#f97316)",
  "linear-gradient(270deg,#f43f5e,#be185d,#7c3aed,#f43f5e)",
  "linear-gradient(270deg,#22d3ee,#818cf8,#f472b6,#22d3ee)",
  "linear-gradient(270deg,#22c55e,#0ea5e9,#6366f1,#22c55e)",
  "linear-gradient(270deg,#6366f1,#14b8a6,#22d3ee,#f43f5e,#6366f1)",
];
const shadows = [
  "0 2px 8px 0 #14b8a6a0, 0 8px 32px 0 #6366f160",
  "0 2px 8px 0 #ef4444a0, 0 8px 32px 0 #f9731660",
  "0 2px 8px 0 #b45309a0, 0 8px 32px 0 #f59e0b60",
  "0 2px 8px 0 #6366f1a0, 0 8px 32px 0 #a21caf60",
  "0 2px 8px 0 #be185da0, 0 8px 32px 0 #f9731660",
  "0 2px 8px 0 #f43f5ea0, 0 8px 32px 0 #7c3aed60",
  "0 2px 8px 0 #22d3eea0, 0 8px 32px 0 #818cf860",
  "0 2px 8px 0 #22c55ea0, 0 8px 32px 0 #0ea5e960",
  "0 2px 8px 0 #6366f1a0, 0 8px 32px 0 #f43f5e60",
];

const pillLabels: Record<string, string> = {
  0: "Nuevo inicio",
  1: "Primera Sangre",
  2: "Doble kill",
  3: "Triple-kill",
  4: "Quadra-kill",
  5: "Penta-kill",
  6: "Imparable",
  7: "Racha de Dios",
  8: "Legendario",
};

const Pills: React.FC<PillsProps> = ({
  userKillStreak,
  brokenPill,
  setBrokenPill,
}) => {
  const pieces = Array.from({ length: 12 });
  return (
    <>
      {/* Portal para piezas animadas fuera del pill */}
      {brokenPill &&
        (() => {
          const key = brokenPill;
          const pillBg = gradients[Number(key)];
          const pillShadow = shadows[Number(key)];
          const pillEl =
            typeof document !== "undefined"
              ? document.querySelector(`[data-pill-key="${key}"]`)
              : null;
          if (!pillEl) return null;
          const rect = pillEl.getBoundingClientRect();
          const parentRect = pillEl.parentElement?.getBoundingClientRect();
          const left = rect.left - (parentRect?.left || 0);
          const top = rect.top - (parentRect?.top || 0);
          return (
            <div
              style={{
                position: "absolute",
                left,
                top,
                width: rect.width,
                height: rect.height,
                pointerEvents: "none",
                zIndex: 50,
              }}
            >
              {pieces.map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-sm"
                  initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: (Math.random() - 0.5) * 180,
                    y: (Math.random() - 0.5) * 180,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    top: "40%",
                    left: "40%",
                    background: pillBg,
                    boxShadow: pillShadow,
                    zIndex: 10,
                  }}
                />
              ))}
            </div>
          );
        })()}
      {Object.entries(pillLabels).map(([key, label]) => {
        const unlocked = userKillStreak >= Number(key);
        const pillBg = unlocked
          ? gradients[Number(key)]
          : "linear-gradient(90deg,#475569 0%,#1e293b 100%)";
        const pillShadow = unlocked
          ? shadows[Number(key)]
          : "0 2px 8px 0 #334155a0, 0 8px 32px 0 #1e293b60";
        if (!unlocked) {
          return (
            <div
              key={key}
              style={{ display: "inline-block", cursor: "not-allowed" }}
            >
              <span
                data-pill-key={key}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 select-none shadow-md animate-gradient-move border-transparent text-white`}
                style={{
                  minWidth: 90,
                  background: pillBg,
                  backgroundSize: undefined,
                  borderColor: "#64748b",
                  boxShadow: pillShadow,
                  position: "relative",
                  display: "inline-block",
                  overflow: "hidden",
                  opacity: 0.6,
                  pointerEvents: "none",
                }}
              >
                <span className="relative z-20" style={{ color: "#cbd5e1" }}>
                  {label}
                </span>
              </span>
            </div>
          );
        }
        return (
          <span
            key={key}
            data-pill-key={key}
            className={`px-4 py-3 rounded-full text-xs font-bold transition-all duration-200 select-none shadow-md animate-gradient-move border-transparent text-white`}
            style={{
              minWidth: 90,
              background: pillBg,
              backgroundSize: "400% 400%",
              borderColor: "transparent",
              boxShadow: pillShadow,
              position: "relative",
              display: "inline-block",
              overflow: "hidden",
              cursor: "cell",
              opacity: 1,
              pointerEvents: "auto",
            }}
            onClick={() => {
              setBrokenPill(key);
              setTimeout(() => setBrokenPill(null), 900);
              // Reproducir sonido de victoria a medio volumen
              const audio = new Audio("/celebration/pill-click.mp3");
              audio.volume = 0.5;
              audio.play().catch(() => {});
            }}
          >
            <span className="relative z-20" style={{ color: "#fff" }}>
              {label}
            </span>
          </span>
        );
      })}
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-move {
          animation: gradientMove 3.5s ease-in-out infinite;
          background-size: 400% 400% !important;
          background-clip: padding-box;
        }
      `}</style>
    </>
  );
};

export default Pills;
