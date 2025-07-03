import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "AFK Recovery App",
  description:
    "Recupera tu vida y hábitos con refuerzos positivos y seguimiento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Russo+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-900 text-white min-h-screen font-sans">
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}
