"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

/**
 * Bloque invertido que corta la página en dos. La transición de entrada es un
 * clip-path que se abre con el scroll, no un fundido: da la sensación de que
 * el bloque oscuro se despliega sobre el papel.
 */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { t } = useLang();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const radius = useTransform(scrollYProgress, [0, 0.25], ["46% 46% 0 0", "0% 0% 0 0"]);
  const noteY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <motion.section
      id="manifesto"
      ref={ref}
      aria-label={t.nav.sections.manifesto}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink px-5 py-28 text-ivory sm:px-8 lg:px-14"
      style={reduced ? undefined : { borderRadius: radius }}
    >
      <div className="relative z-10 w-full">
        <h2 className="font-display max-w-[16ch] text-[clamp(2.4rem,7.5vw,6.5rem)]">
          <MaskedLines
            lines={t.manifesto.lines}
            lineClassName="text-balance"
            stagger={0.12}
          />
        </h2>

        <motion.div style={reduced ? undefined : { y: noteY }}>
          <Reveal delay={0.2} className="mt-14 max-w-[52ch] lg:ml-auto lg:mt-24">
            <p className="text-base leading-relaxed text-ivory/60 sm:text-lg">
              {t.manifesto.note}
            </p>
          </Reveal>
        </motion.div>
      </div>

      {/* Trama tenue: da profundidad sin pedir un solo byte de imagen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #f6f1e8 0 1px, transparent 1px 96px)",
        }}
      />
    </motion.section>
  );
}
