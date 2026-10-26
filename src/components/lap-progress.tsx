"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Barra de vuelta: lo que llevas de la página, como el progreso de vuelta en
 * una retransmisión. Va del azur al verde neón y la punta, que es lo que se
 * ve sobre los bloques azur, es siempre el verde.
 */
export function LapProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // El muelle suaviza el salto de las ruedas de ratón por pasos.
  const smooth = useSpring(scrollYProgress, { stiffness: 240, damping: 34, mass: 0.4 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[5px] bg-ink/10"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-azure via-azure to-volt"
        style={{ scaleX: reduced ? scrollYProgress : smooth }}
      />
    </div>
  );
}
