import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ECO-CITY | Gêmeo Digital Urbano",
  description: "Uma cidade. Milhares de decisões. Um futuro para construir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      {/*
        Optimization: Added preload hints for logo to ensure it loads early for the loading screen.
        Set background color on body to match loading screen instantly.
      */}
      <head>
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased text-white bg-brand-black`}>
        <main className="relative min-h-screen overflow-hidden bg-brand-black">
          {children}
        </main>
      </body>
    </html>
  );
}
