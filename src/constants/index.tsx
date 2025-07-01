import React from "react";

export const ICONS = {
  close: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  check: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-teal-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  plus: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  arrowRight: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  arrowLeft: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h17"
      />
    </svg>
  ),
  shield: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  // Nav Icons
  dashboard: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  toolkit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  reconstruction: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  education: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mb-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
};

export const ASSESSMENT_QUESTIONS = [
  "¿Has sentido la necesidad de jugar durante cantidades de tiempo cada vez mayores para sentirte satisfecho?",
  "¿Te sientes inquieto/a o irritable cuando intentas reducir o dejar de jugar?",
  "¿Has intentado sin éxito controlar, reducir o dejar de jugar?",
  "¿Sientes que a menudo piensas en el juego incluso cuando no estás jugando?",
  "¿Juegas cuando te sientes angustiado/a (por ejemplo, indefenso, culpable, ansioso, deprimido)?",
  "Después de perder en el juego, ¿vuelves a jugar otro día para intentar recuperar (perseguir tus pérdidas)?",
  "¿Has mentido a familiares, terapeutas u otros para ocultar tu grado de implicación en el juego?",
  "¿Has puesto en peligro o perdido una relación importante, un trabajo o una oportunidad educativa/profesional debido al juego?",
  "¿Has dependido de otros para que te proporcionen dinero para aliviar una situación financiera desesperada causada por el juego?",
];

export const EDUCATION_ARTICLES = [
  {
    title: "Entendiendo el Cerebro Adicto",
    content:
      "La adicción a los videojuegos, como otras adicciones conductuales, secuestra el sistema de recompensa del cerebro. El neurotransmisor dopamina, asociado con el placer y la motivación, se libera en grandes cantidades durante el juego. Con el tiempo, el cerebro se adapta, necesitando cada vez más estímulo para sentir el mismo placer (tolerancia) y sintiéndose mal sin él (abstinencia).\n\nEste ciclo crea un poderoso impulso para seguir jugando, incluso cuando se conocen las consecuencias negativas. No es una falta de voluntad, sino un cambio neurobiológico real que requiere estrategias específicas para ser superado.",
  },
  {
    title: "¿Qué es la Terapia Cognitivo-Conductual (TCC)?",
    content:
      "La TCC es una de las terapias más efectivas para tratar la adicción al juego. Se basa en una idea simple: nuestros pensamientos, sentimientos y comportamientos están interconectados. Cambiando los patrones de pensamiento negativos o inútiles, podemos cambiar cómo nos sentimos y qué hacemos.\n\nEn esta app, herramientas como el 'Registro de Desencadenantes' y el 'Desafío del Pensamiento' son aplicaciones directas de la TCC. Te ayudan a identificar qué situaciones te incitan a jugar y a cuestionar los pensamientos automáticos que justifican ese impulso, para reemplazarlos por otros más racionales y saludables.",
  },
  {
    title: "La Importancia de Reconstruir tu Vida",
    content:
      "Dejar de jugar es solo la mitad de la batalla. El vacío que deja el juego debe ser llenado con actividades significativas y gratificantes en el mundo real. Sin alternativas, la probabilidad de recaer es alta.\n\nLa sección de 'Reconstrucción' está diseñada para ayudarte con esto. Establecer metas SMART (Específicas, Medibles, Alcanzables, Relevantes, con Plazo) te da un sentido de propósito. Crear rutinas saludables estabiliza tu día a día. Explorar nuevos hobbies te permite descubrir nuevas fuentes de alegría y satisfacción que no dependen de una pantalla.",
  },
  {
    title: "Manejo de Impulsos (Cravings)",
    content:
      "Los impulsos por jugar son inevitables, especialmente al principio. La clave no es evitarlos, sino aprender a manejarlos. Cuando sientas un impulso, recuerda que es como una ola: crece, alcanza un pico y luego disminuye. No dura para siempre.\n\nUsa el botón S.O.S. para practicar la respiración profunda. Esto activa el sistema nervioso parasimpático, que induce un estado de calma. Distráete con una actividad de tu lista de hobbies. Habla con un amigo o familiar de confianza. Cada vez que superas un impulso sin jugar, debilitas la adicción y fortaleces tu autocontrol.",
  },
];
