import { useCallback } from "react";

// Hook para feedback de voz reutilizable
export function useSpeak() {
  return useCallback(async (text: string) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        window.speechSynthesis.speak(utterance);
      }
    }
  }, []);
}
