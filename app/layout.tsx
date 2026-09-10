import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LIM Shop Perú · Termos personalizados",
  description: "Termos y cups personalizados para acompañarte todos los días. Envíos a todo el Perú.",
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
