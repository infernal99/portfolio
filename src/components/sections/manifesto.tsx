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
      data-saturated
      ref={ref}
      aria-label={t.nav.sections.manifesto}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-azure px-5 py-28 text-paper sm:px-8 lg:px-14"
      style={reduced ? undefined : { borderRadius: radius }}
    >
      <div className="relative z-10 w-full">
        <h2 className="font-display max-w-[16ch] text-[clamp(3.2rem,10.5vw,9.5rem)]">
          <MaskedLines
            lines={t.manifesto.lines}
            lineClassName="text-balance"
            stagger={0.12}
          />
        </h2>

        <motion.div style={reduced ? undefined : { y: noteY }}>
          <Reveal delay={0.2} className="mt-14 max-w-[52ch] lg:ml-auto lg:mt-24">
            <p className="text-lg font-medium leading-relaxed text-paper/90 sm:text-xl">
              {t.manifesto.note}
            </p>
          </Reveal>
        </motion.div>
      </div>

      {/* Líneas de velocidad en diagonal: profundidad sin pedir un byte de imagen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #f2fcf9 0 2px, transparent 2px 120px)",
        }}
      />
    </motion.section>
  );
}
