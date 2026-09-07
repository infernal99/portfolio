"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { MILESTONES, PERIODS } from "@/lib/content";
import { Reveal } from "@/components/motion-primitives";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Trayectoria. En escritorio el bloque se fija y los hitos avanzan en
 * horizontal con el scroll; en móvil, donde ese gesto secuestra la navegación,
 * es una lista vertical normal.
 */
export function Path() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const horizontal = isDesktop && !reduced;
  const trackRef = useRef<HTMLOListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [distance, setDistance] = useState(0);

  // Cuánto hay que desplazar: lo que sobresale del viewport, más el respiro final.
  useEffect(() => {
    const measure = () => {
      const el = trackRef.current;
      setDistance(
        horizontal && el
          ? Math.max(el.scrollWidth - window.innerWidth + 80, 0)
          : 0,
      );
    };
    // En el siguiente frame: el layout ya está resuelto y la medida es real.
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [horizontal, lang]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.05, 1]);

  return (
    <section
      id="path"
      ref={sectionRef}
      aria-label={t.nav.sections.path}
      className="relative bg-ivory"
      style={horizontal ? { height: `${100 + (distance / 8)}vh` } : undefined}
    >
      <div
        className={
          horizontal
            ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
            : "flex flex-col justify-center py-24"
        }
      >
        <header className="px-5 sm:px-8 lg:px-14">
          <Reveal>
            <p className="label text-ember">{t.path.label}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(2.2rem,6vw,4.75rem)]">
              {t.path.title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[46ch] text-ink/60">{t.path.intro}</p>
          </Reveal>
        </header>

        {/* Raíl que se dibuja conforme avanza el recorrido. */}
        {horizontal && (
          <motion.div
            aria-hidden="true"
            className="mt-14 h-px origin-left bg-ink/20"
            style={{ scaleX: lineScale }}
          />
        )}

        <motion.ol
          ref={trackRef}
          className={
            horizontal
              ? "mt-10 flex w-max gap-6 px-14"
              : "mt-12 flex flex-col gap-10 px-5 sm:px-8"
          }
          style={horizontal ? { x } : undefined}
        >
          {MILESTONES.map((m, i) => {
            const copy = t.path.items[m.id];
            return (
              <motion.li
                key={m.id}
                className={`relative ${
                  horizontal
                    ? "w-[19rem] shrink-0 xl:w-[22rem]"
                    : "border-l border-ink/15 pl-5"
                }`}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: horizontal ? 0 : i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-full ${
                      m.kind === "product" ? "bg-ember" : "bg-clay"
                    }`}
                  />
                  <span className="label text-ink/45">{t.path.kinds[m.kind]}</span>
                </div>

                <p className="label mt-4 text-ember">{PERIODS[lang][m.id]}</p>
                <h3 className="font-display mt-2 text-2xl leading-tight sm:text-[1.7rem]">
                  {copy.title}
                </h3>
                <p className="mt-1 text-sm text-ink/50">{m.place}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  {copy.detail}
                </p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
