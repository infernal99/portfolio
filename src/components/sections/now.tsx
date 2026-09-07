"use client";

import { useLang } from "@/components/lang-provider";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

/**
 * "Ahora". Cierra la narración antes del contacto: dónde estoy y hacia dónde
 * voy, sin prometer proyectos que todavía no existen.
 */
export function Now() {
  const { t } = useLang();

  return (
    <section
      id="now"
      aria-label={t.nav.sections.now}
      className="relative z-10 border-t border-ink/10 bg-ivory-dim px-5 py-28 sm:px-8 lg:px-14 lg:pr-32 lg:py-40"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        <header>
          <Reveal>
            <p className="label text-ember">{t.now.label}</p>
          </Reveal>
          <h2 className="font-display mt-4 text-[clamp(2.4rem,7vw,6rem)]">
            <MaskedLines lines={[t.now.title]} />
          </h2>
        </header>

        <div className="flex flex-col gap-8 lg:pt-6">
          {t.now.body.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="flex gap-5 text-lg leading-relaxed text-ink/75 sm:text-xl">
                <span aria-hidden="true" className="label mt-2.5 shrink-0 text-ember">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-balance">{paragraph}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
