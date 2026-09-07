"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { LANGUAGES, STACK } from "@/lib/content";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

/**
 * Stack. Sin porcentajes ni barras: las tecnologías se listan como un índice
 * tipográfico y cada una se enciende al pasar por encima. Lo que importa es
 * cuáles son y de dónde salen, no un número inventado de dominio.
 */
export function Stack() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  return (
    <section
      id="stack"
      aria-label={t.nav.sections.stack}
      className="relative z-10 bg-ivory px-5 py-28 sm:px-8 lg:px-14 lg:pr-32 lg:py-40"
    >
      <header>
        <Reveal>
          <p className="label text-ember">{t.stack.label}</p>
        </Reveal>
        <h2 className="font-display mt-4 max-w-[12ch] text-[clamp(2.4rem,7vw,6rem)]">
          <MaskedLines lines={[t.stack.title]} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[46ch] text-ink/60">{t.stack.intro}</p>
        </Reveal>
      </header>

      <div className="mt-16 grid gap-x-10 gap-y-14 lg:mt-24 lg:grid-cols-3">
        {STACK.map((group, gi) => (
          <div key={group.id} className="border-t border-ink/15 pt-6">
            <h3 className="label text-ink/45">{t.stack.groups[group.id]}</h3>
            <ul className="mt-6 flex flex-col gap-1">
              {group.items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.45, delay: gi * 0.05 + i * 0.03 }}
                >
                  <span className="font-display group inline-flex cursor-default items-baseline gap-3 text-3xl transition-colors duration-300 hover:text-ember sm:text-4xl">
                    <span
                      aria-hidden="true"
                      className="label text-ink/25 transition-colors group-hover:text-ember"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-20 border-t border-ink/15 pt-6">
        <h3 className="label text-ink/45">{t.stack.languagesTitle}</h3>
        <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
          {LANGUAGES.map((l) => (
            <Reveal as="li" key={l.id}>
              <span className="font-display text-2xl sm:text-3xl">
                {t.stack.languages[l.id]}
              </span>
              <span className="label ml-3 text-ember">{t.stack.levels[l.level]}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
