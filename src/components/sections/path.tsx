"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { MILESTONES, PERIODS } from "@/lib/content";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

/**
 * Trayectoria: una línea temporal vertical, un hito por paso.
 *
 * Antes esto era una fila que avanzaba en horizontal con el scroll. Se leía
 * mal: cualquier gesto mínimo desplazaba el texto que estabas leyendo, y en
 * los extremos la fila se movía sin que hubiera nada nuevo que ver. La página
 * ya se recorre de arriba abajo; la línea temporal ahora hace lo mismo, y lo
 * único que reacciona al scroll es el raíl, que se va dibujando por detrás.
 */
export function Path() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    // De cuando la lista entra por abajo a cuando su final llega al centro:
    // el raíl termina de dibujarse justo con el último hito.
    offset: ["start 85%", "end 60%"],
  });
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="path"
      aria-label={t.nav.sections.path}
      className="relative bg-ivory px-5 py-28 sm:px-8 lg:px-14 lg:pr-32 lg:py-40"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* El encabezado acompaña al recorrido en vez de desaparecer al inicio. */}
        <header className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="label text-ember">{t.path.label}</p>
          </Reveal>
          <h2 className="font-display mt-4 max-w-[14ch] text-[clamp(2.2rem,6vw,4.75rem)]">
            <MaskedLines lines={[t.path.title]} />
          </h2>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[42ch] text-ink/70">{t.path.intro}</p>
          </Reveal>
        </header>

        <ol ref={listRef} className="relative">
          {/* Raíl: la línea gris está siempre; la ámbar se dibuja al bajar. */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px bg-ink/15"
          />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-ember"
            style={reduced ? { scaleY: 1 } : { scaleY: railScale }}
          />

          {MILESTONES.map((milestone, i) => {
            const copy = t.path.items[milestone.id];
            const isProduct = milestone.kind === "product";

            return (
              <motion.li
                key={milestone.id}
                className="relative pb-14 pl-10 last:pb-0 sm:pl-12"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* El punto tapa el raíl: por eso lleva anillo del color del
                    fondo, para que la línea no se vea cruzarlo por detrás. */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full ring-4 ring-ivory ${
                    isProduct ? "bg-ember" : "bg-clay"
                  }`}
                />

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="label tabular-nums text-ink/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label text-ember">
                    {PERIODS[lang][milestone.id]}
                  </span>
                  <span className="label text-ink/55">
                    {t.path.kinds[milestone.kind]}
                  </span>
                </div>

                <h3 className="font-display mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight">
                  {copy.title}
                </h3>
                <p className="mt-1.5 text-sm text-ink/60">{milestone.place}</p>
                <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-ink/75">
                  {copy.detail}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
