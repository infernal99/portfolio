import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { LangProvider } from "@/components/lang-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { DICTIONARIES, PROFILE } from "@/lib/content";
import "./globals.css";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono-label",
});

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const es = DICTIONARIES.es;

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: es.meta.title,
  description: es.meta.description,
  applicationName: PROFILE.name,
  authors: [{ name: PROFILE.name, url: PROFILE.github }],
  creator: PROFILE.name,
  keywords: [
    "Ian Monfil",
    "desarrollador fullstack",
    "fullstack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Supabase",
    "Barcelona",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_GB"],
    url: "/",
    siteName: PROFILE.name,
    title: es.meta.title,
    description: es.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: es.meta.title,
    description: es.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <LangProvider>
          <SmoothScroll />
          <a className="skip-link label" href="#main">
            Saltar al contenido
          </a>
          <Nav />
          <main id="main">{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
