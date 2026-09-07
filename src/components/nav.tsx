"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { SECTION_IDS, type SectionId } from "@/lib/content";
import { EASE } from "@/components/motion-primitives";

/** Marca la sección visible para el índice lateral y el overlay móvil. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>("hero");

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { threshold: [0.25, 0.5], rootMargin: "-20% 0px -35% 0px" },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

/**
 * Bandera dibujada, no emoji: Windows no trae glifos de banderas y el emoji
 * degrada a las dos letras del país, que junto a la etiqueta se leía "ES ES".
 */
function Flag({ lang }: { lang: "es" | "en" }) {
  return (
    <svg
      viewBox="0 0 18 12"
      className="h-3 w-[18px] shrink-0 rounded-[2px]"
      aria-hidden="true"
    >
      {lang === "es" ? (
        <>
          <rect width="18" height="12" fill="#c60b1e" />
          <rect y="3" width="18" height="6" fill="#ffc400" />
        </>
      ) : (
        <>
          <rect width="18" height="12" fill="#012169" />
          <path d="M0 0l18 12M18 0L0 12" stroke="#fff" strokeWidth="2.6" />
          <path d="M0 0l18 12M18 0L0 12" stroke="#c8102e" strokeWidth="1.4" />
          <path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="4" />
          <path d="M9 0v12M0 6h18" stroke="#c8102e" strokeWidth="2.2" />
        </>
      )}
    </svg>
  );
}

export function Nav() {
  const { t, lang, toggle } = useLang();
  const active = useActiveSection();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Con el overlay abierto el fondo no debe desplazarse detrás.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Marca + idioma: siempre visibles, en todas las anchuras. */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 mix-blend-difference sm:px-8 lg:px-14">
        <a
          href="#hero"
          className="label text-ivory transition-opacity hover:opacity-60"
        >
          Ian Monfil
        </a>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label={t.a11y.langToggle}
            className="label flex items-center gap-2 text-ivory transition-opacity hover:opacity-60"
          >
            <Flag lang={lang} />
            {lang === "es" ? "ES" : "EN"}
          </button>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="label text-ivory transition-opacity hover:opacity-60 lg:hidden"
            aria-expanded={open}
            aria-controls="nav-overlay"
          >
            {t.nav.menu}
          </button>
        </div>
      </header>

      {/* Índice numerado lateral — la navegación principal en escritorio. */}
      <nav
        className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:right-14"
        aria-label={t.nav.menu}
      >
        <ul className="flex flex-col items-end gap-3">
          {SECTION_IDS.map((id, i) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={`label transition-all duration-300 ${
                      isActive
                        ? "text-ember opacity-100"
                        : "text-ink/50 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {t.nav.sections[id]}
                  </span>
                  <span
                    className={`label tabular-nums transition-colors duration-300 ${
                      isActive ? "text-ember" : "text-ink/35 group-hover:text-ink/70"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-8 bg-ember"
                        : "w-3 bg-ink/30 group-hover:w-6 group-hover:bg-ink/60"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Overlay a pantalla completa en móvil y tablet. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-overlay"
            className="fixed inset-0 z-[60] flex flex-col bg-ink px-5 pb-10 pt-5 sm:px-8 lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="label text-ivory"
                autoFocus
              >
                {t.nav.close}
              </button>
            </div>

            <ul className="mt-auto flex flex-col gap-1">
              {SECTION_IDS.map((id, i) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className="font-display flex items-baseline gap-4 py-1 text-[clamp(2.6rem,13vw,4.5rem)] uppercase text-ivory"
                  >
                    <span className="label text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t.nav.sections[id]}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
