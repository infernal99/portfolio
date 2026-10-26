import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed, Chakra_Petch } from "next/font/google";
import { LangProvider } from "@/components/lang-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LapProgress } from "@/components/lap-progress";
import { Nav } from "@/components/nav";
import { DICTIONARIES, PROFILE } from "@/lib/content";
import "./globals.css";

// Titulares: condensada y pesada, en cursiva, como el rotulado de una
// retransmisión de F1 o MotoGP. Solo se cargan los pesos y estilos que se usan.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["italic"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

// Cuerpo de texto: la hermana "normal" de la anterior, para que casen.
const sans = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-barlow",
});

// Rótulos: angulosa y técnica, como la telemetría de un monoplaza.
const mono = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-chakra-petch",
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
  themeColor: "#f2fcf9",
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
          <LapProgress />
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
