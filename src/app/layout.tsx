import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import { GoogleTagManager } from '@next/third-parties/google'


export const metadata: Metadata = {
  metadataBase: new URL("https://afk-lol.vercel.app/"),
  title: {
    default:
      "LOL AFK - Recupera tu Vida y Deja la Adicción a League of Legends",
    template: "%s | LOL AFK",
  },
  description:
    "La aplicación gratuita y en español que te ayuda a superar la adicción a League of Legends. Gamifica tu progreso, reconstruye tus hábitos y recupera el control de tu vida.",
  keywords: [
    "dejar el lol",
    "adicción a league of legends",
    "desintoxicarse del lol",
    "superar adicción videojuegos",
    "ayuda para dejar de jugar lol",
    "gamificar",
    "recuperar el tiempo perdido",
    "LOL AFK",
    "salud mental videojuegos",
  ],
  openGraph: {
    title: "LOL AFK - Recupera tu Vida",
    description:
      "La herramienta definitiva para dejar League of Legends y reconstruir tus hábitos.",
    url: "https://afk-lol.vercel.app/",
    siteName: "LOL AFK",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOL AFK - Recupera tu Vida",
    description:
      "Gamifica tu salida de League of Legends y empieza a construir la vida que quieres.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <GoogleTagManager gtmId="AW-967148300" />
      <body className="bg-slate-900 text-white min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 bg-red-x flex">{children}</main>
      </body>
    </html>
  );
}
