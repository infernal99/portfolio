"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Aparición corta y con desplazamiento breve. Nada dura más de 0,7 s. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Revelado por líneas con máscara: cada línea sube desde debajo de su propio
 * recorte. Es el gesto tipográfico principal del sitio.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };

  const line: Variants = {
    hidden: reduced ? { opacity: 0 } : { y: "110%" },
    show: reduced
      ? { opacity: 1, transition: { duration: 0.4 } }
      : { y: "0%", transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
    >
      {lines.map((text, i) => (
        <span className="mask-line" key={i}>
          <motion.span className={lineClassName} variants={line} style={{ display: "block" }}>
            {text}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export { EASE };
