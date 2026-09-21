import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

// Fonts are checked in under app/fonts (latin subset, variable where Google offers it) and served
// from the site itself: no request to Google at runtime and none at build time either, so the
// static export builds the same on a laptop and on the GitHub Actions runner.
const display = localFont({ src: "./fonts/familjen-grotesk.woff2", weight: "500 700", variable: "--font-display", display: "swap" });
const body = localFont({ src: "./fonts/schibsted-grotesk.woff2", weight: "400 700", variable: "--font-body", display: "swap" });
const mono = localFont({ src: [{ path: "./fonts/ibm-plex-mono-400.woff2", weight: "400" }, { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500" }], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://codehives.se"),
  title: "Codehive · AI engineering as a service",
  description: "Backend engineering for teams adding LLM features without an ML team. Stockholm.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { title: "Codehive", description: "AI engineering as a service, Stockholm.", url: "https://codehives.se", siteName: "Codehive", locale: "en_GB", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Codehive. Ship the AI feature." }] },
  twitter: { card: "summary_large_image", title: "Codehive", description: "AI engineering as a service, Stockholm.", images: ["/og.png"] },
};

// Cookie-free analytics. Set NEXT_PUBLIC_UMAMI_WEBSITE_ID in Vercel; without it nothing loads.
const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const viewport = { themeColor: "#0b0d10", viewportFit: "cover" as const };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        {children}
        {umamiId && <Script src="https://cloud.umami.is/script.js" data-website-id={umamiId} strategy="afterInteractive" />}
      </body>
    </html>
  );
}
