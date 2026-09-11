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
    <html lang="es">
      <head>
        <link rel="stylesheet" href="/lim-store.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
