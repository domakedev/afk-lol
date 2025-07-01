# AFK Recovery App (Next.js)

Recupera tu vida y hábitos con refuerzos positivos, seguimiento de victorias/derrotas y feedback de voz.

## Características

- Registro de victorias y derrotas con formularios y listados.
- Selector de modo de juego para derrotas.
- Feedback de voz usando ElevenLabs (API segura) y Web Speech API como fallback.
- Overlay/modal de refuerzo visual y sonoro al alcanzar racha de 5 victorias.
- Navegación por tabs (Dashboard, Toolkit, Reconstrucción, Educación) usando App Router de Next.js.
- Animaciones y flashes visuales para refuerzo positivo/negativo.
- Hooks personalizados para feedback de voz y animaciones.
- Layout global y estilos modernos con Tailwind CSS.

## Estructura

- `/src/components/Dashboard.tsx`: Componente principal con lógica de registro y refuerzos.
- `/src/app/api/tts/route.ts`: Endpoint seguro para síntesis de voz ElevenLabs.
- `/src/hooks/`: Hooks personalizados (`useSpeak`, `useFlashAnimation`).
- `/src/app/toolkit`, `/reconstruccion`, `/educacion`: Vistas adicionales.

## Scripts

- `npm run dev`: Desarrollo
- `npm run build`: Build producción
- `npm run start`: Producción
- `npm run lint`: Linter

## Notas

- Personaliza los módulos de Toolkit, Reconstrucción y Educación según tus necesidades.
- Puedes extender los hooks y animaciones para más feedback visual/sonoro.

---

¡Listo para usar y expandir!
