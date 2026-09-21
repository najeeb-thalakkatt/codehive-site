import type { Metadata } from "next";
import { Familjen_Grotesk, Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// next/font self-hosts these at build time: no request to Google at runtime.
const display = Familjen_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = Schibsted_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Codehive · AI engineering as a service",
  description: "Backend engineering for teams adding LLM features without an ML team. Stockholm.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Codehive", description: "AI engineering as a service, Stockholm.", url: "https://codehives.se", siteName: "Codehive", locale: "en_GB", type: "website" },
};

export const viewport = { themeColor: "#0b0d10", viewportFit: "cover" as const };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
