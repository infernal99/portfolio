"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useLang } from "@/components/lang-provider";
import { PROFILE } from "@/lib/content";

// El canvas no se descarga hasta que la página ya ha pintado: el hero es
// legible y utilizable antes de que llegue un solo byte de Three.js.
const HeroObject = dynamic(() => import("@/components/three/hero-object"), {
  ssr: false,
});

/**
 * El 3D solo se monta donde aporta y no penaliza: pantalla ancha, puntero
 * fino, animación no reducida y una CPU que no vaya a sufrir. Las condiciones
 * son reactivas a propósito — si se comprobasen una sola vez al montar, abrir
 * la página en una ventana estrecha y maximizarla dejaría el objeto fuera para
 * siempre.
 */
function useCanRender3D() {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 768px)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Un margen tras el primer pintado: el hero se lee antes de que llegue
    // un solo byte de Three.js.
    const id = window.setTimeout(
      () => setReady((navigator.hardwareConcurrency ?? 8) > 4),
      120,
    );
    return () => window.clearTimeout(id);
  }, []);

  return ready && wide && finePointer && !reduced;
}

export function Hero() {
  const { t } = useLang();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canRender3D = useCanRender3D();

  const pointer = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => {
      scrollProgress.current = Math.min(window.scrollY / window.innerHeight, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fuera de pantalla el canvas deja de renderizar: cero coste mientras se lee
  // el resto de la página.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Una caja de altura cero no significa "fuera de pantalla": es una
        // pestaña en segundo plano o un primer layout todavía sin resolver.
        // Apagar el bucle de render ahí dejaba el objeto invisible hasta que
        // el usuario hacía scroll.
        if (entry.boundingClientRect.height === 0) return;
        setActive(entry.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const nameLine = (text: string, delay: number) => (
    <span className="mask-line">
      <span className="line-rise" style={{ animationDelay: `${delay}s` }}>
        {text}
      </span>
    </span>
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-10 pt-24 sm:px-8 lg:px-14"
      aria-label={t.nav.sections.hero}
      // Dos focos de color sobre el hielo: verde neón arriba a la derecha, donde
      // vive el objeto 3D, y azur abajo a la izquierda, bajo el nombre.
      style={{
        backgroundImage:
          "radial-gradient(55% 55% at 82% 28%, rgba(52,245,160,0.34), transparent 70%), radial-gradient(60% 60% at 8% 92%, rgba(10,82,214,0.18), transparent 72%)",
      }}
    >
      {/* Objeto 3D — detrás del nombre, nunca por delante de la lectura. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-full lg:w-[58%]"
        aria-hidden="true"
      >
        {canRender3D ? (
          <HeroObject
            pointer={pointer}
            scrollProgress={scrollProgress}
            active={active}
          />
        ) : (
          <StaticSolid />
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center">
        <p
          className="fade-rise flex flex-wrap items-center gap-x-4 gap-y-2"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="label slant bg-azure py-1.5 pl-4 pr-7 text-paper">
            {t.hero.role}
          </span>
          <span className="label text-ink/70">{t.hero.availability}</span>
        </p>

        <h1 className="font-display mt-6 text-[clamp(5.2rem,29vw,21rem)] lg:text-[clamp(5.2rem,23vw,21rem)]">
          {nameLine(PROFILE.firstName, 0.25)}
          <span className="block pl-[0.04em] text-azure">
            {nameLine(PROFILE.lastName, 0.36)}
          </span>
        </h1>

        <p
          className="fade-rise mt-8 max-w-[34ch] text-balance text-xl font-medium leading-snug text-ink/80 sm:text-2xl lg:max-w-[38ch] lg:text-[1.7rem]"
          style={{ animationDelay: "0.62s" }}
        >
          {t.hero.lead}
        </p>
      </div>

      <div
        className="fade-rise relative z-10 flex items-end justify-between gap-6"
        style={{ animationDelay: "0.9s" }}
      >
        <a
          href="#work"
          className="label group inline-flex items-center gap-3 text-ink/70 transition-colors hover:text-azure"
        >
          <span
            className="inline-block h-9 w-px bg-ink/30 transition-colors group-hover:bg-azure"
            aria-hidden="true"
          />
          {t.hero.scroll}
        </a>
        <span className="label hidden text-ink/75 sm:block">2026</span>
      </div>

      <div className="kerb absolute inset-x-0 bottom-0 z-10" aria-hidden="true" />
    </section>
  );
}

/**
 * Sustituto del canvas en móvil, equipos modestos y prefers-reduced-motion.
 * Misma silueta, coste cero.
 */
function StaticSolid() {
  return (
    // En móvil ocupa el aire de la parte alta, lejos del titular; en pantallas
    // grandes vuelve al centro de su columna, donde iría el canvas.
    <div className="flex h-full w-full items-start justify-end pr-2 pt-20 sm:pt-24 lg:items-center lg:justify-center lg:pr-0 lg:pt-0">
      <svg
        viewBox="0 0 200 200"
        className="h-[38vmin] w-[38vmin] max-w-full opacity-70 sm:h-[34vmin] sm:w-[34vmin] lg:h-[62vmin] lg:w-[62vmin] lg:opacity-90"
        role="presentation"
      >
        <defs>
          <linearGradient id="solid-warm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34f5a0" />
            <stop offset="50%" stopColor="#1f9bd8" />
            <stop offset="100%" stopColor="#0a52d6" />
          </linearGradient>
        </defs>
        <g transform="translate(100 100)">
          <polygon
            points="0,-78 68,-39 68,39 0,78 -68,39 -68,-39"
            fill="none"
            stroke="#04283a"
            strokeOpacity="0.28"
            strokeWidth="1"
          />
          <polygon
            points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26"
            fill="url(#solid-warm)"
          />
          <path
            d="M0,-52 L0,52 M-45,-26 L45,26 M45,-26 L-45,26"
            stroke="#f2fcf9"
            strokeOpacity="0.55"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
}
