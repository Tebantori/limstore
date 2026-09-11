import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIM Shop Perú · Termos y Cups Personalizados con Grabado Láser",
  description:
    "Termos y cups de acero quirúrgico 304 y 316 personalizados con grabado láser permanente. Mantén tus bebidas frías 24h o calientes 12h. Envíos a todo el Perú.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/brand/lim-logo.png",
    shortcut: "/images/brand/lim-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@600;700;800&family=Montserrat:wght@500;600;700&family=Oswald:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#28543d] selection:text-white">
        {children}
      </body>
    </html>
  );
}
