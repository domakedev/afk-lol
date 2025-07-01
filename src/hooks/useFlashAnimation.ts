import { useEffect, useRef } from "react";

// Hook para animación flash (victoria/derrota)
export function useFlashAnimation(trigger: boolean, className: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger && ref.current) {
      ref.current.classList.add(className);
      const timeout = setTimeout(() => {
        ref.current?.classList.remove(className);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [trigger, className]);

  return ref;
}
