"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { PROJECTS, type Project } from "@/lib/content";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

/**
 * Proyectos. Cada pieza ocupa la pantalla entera y se queda fija mientras la
 * siguiente se desliza por encima: las cuatro se leen como un mazo de cartas,
 * no como una cuadrícula.
 */
export function Work() {
  const { t } = useLang();

  return (
    <section id="work" aria-label={t.nav.sections.work} className="relative bg-ivory">
      <header className="px-5 pb-16 pt-28 sm:px-8 lg:px-14 lg:pt-36">
        <Reveal>
          <p className="label text-ember">{t.work.label}</p>
        </Reveal>
        <h2 className="font-display mt-4 max-w-[12ch] text-[clamp(2.6rem,8vw,7rem)]">
          <MaskedLines lines={[t.work.title]} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-[48ch] text-lg text-ink/60">{t.work.intro}</p>
        </Reveal>
      </header>

      <div>
        {PROJECTS.map((project, i) => (
          <ProjectPanel key={project.id} project={project} position={i} />
        ))}
      </div>
    </section>
  );
}

function ProjectPanel({ project, position }: { project: Project; position: number }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const copy = t.work.projects[project.id];
  const featured = project.featured;

  const dark = featured;

  return (
    <article
      className={`sticky top-0 flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-20 sm:px-8 lg:px-14 ${
        dark ? "bg-ink text-ivory" : "bg-ivory-dim text-ink"
      }`}
      style={{ zIndex: position + 1 }}
    >
      <div className="mx-auto grid w-full max-w-[100rem] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        {/* Texto */}
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span
              className="label"
              style={{ color: dark ? project.accent : undefined }}
            >
              {project.index}
            </span>
            <StatusTag status={project.status} dark={dark} />
            {featured && (
              <span className="label text-ember">{t.work.featured}</span>
            )}
            <span className={`label ${dark ? "text-ivory/40" : "text-ink/40"}`}>
              {project.year}
            </span>
          </div>

          <h3
            className="font-display mt-5"
            style={{
              fontSize: featured
                ? "clamp(2.8rem, 7.5vw, 6.5rem)"
                : "clamp(2.4rem, 6vw, 5.25rem)",
            }}
          >
            <MaskedLines lines={[project.name]} />
          </h3>

          <p
            className={`mt-4 max-w-[30ch] text-xl leading-snug sm:text-2xl ${
              dark ? "text-ivory/80" : "text-ink/80"
            }`}
          >
            {copy.tagline}
          </p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className={`label ${dark ? "text-ivory/40" : "text-ink/40"}`}>
                {t.work.role}
              </dt>
              <dd className={`mt-2 text-sm ${dark ? "text-ivory/75" : "text-ink/75"}`}>
                {copy.role}
              </dd>
            </div>
            <div>
              <dt className={`label ${dark ? "text-ivory/40" : "text-ink/40"}`}>
                {t.work.problem}
              </dt>
              <dd
                className={`mt-2 text-sm leading-relaxed ${
                  dark ? "text-ivory/75" : "text-ink/75"
                }`}
              >
                {copy.problem}
              </dd>
            </div>
          </dl>

          <p
            className={`mt-6 max-w-[58ch] text-sm leading-relaxed ${
              dark ? "text-ivory/60" : "text-ink/60"
            }`}
          >
            {copy.description}
          </p>

          <div className="mt-7">
            <p className={`label ${dark ? "text-ivory/40" : "text-ink/40"}`}>
              {t.work.stack}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    dark
                      ? "border-ivory/20 text-ivory/70"
                      : "border-ink/15 text-ink/70"
                  }`}
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group mt-9 inline-flex items-center gap-3 border-b pb-1 text-sm transition-colors ${
              dark
                ? "border-ivory/30 text-ivory hover:border-ember hover:text-ember"
                : "border-ink/30 text-ink hover:border-ember hover:text-ember"
            }`}
          >
            <span className="label">{t.work.visit}</span>
            <span className="font-mono text-xs opacity-60">{project.domain}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>

        {/* Captura del sitio real, dentro de un marco de navegador. */}
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div
              className={`overflow-hidden rounded-xl border shadow-2xl transition-transform duration-500 group-hover:-translate-y-1.5 ${
                dark ? "border-ivory/15 shadow-black/40" : "border-ink/10 shadow-ink/10"
              }`}
            >
              <div
                className={`flex items-center gap-2 px-4 py-3 ${
                  dark ? "bg-ink-soft" : "bg-sand"
                }`}
              >
                <span className="flex gap-1.5" aria-hidden="true">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className={`h-2 w-2 rounded-full ${
                        dark ? "bg-ivory/25" : "bg-ink/20"
                      }`}
                    />
                  ))}
                </span>
                <span
                  className={`ml-2 truncate font-mono text-[11px] ${
                    dark ? "text-ivory/45" : "text-ink/45"
                  }`}
                >
                  {project.domain}
                </span>
              </div>

              <div className="relative aspect-16/10 w-full overflow-hidden bg-white">
                <Image
                  src={`/projects/${project.id}.webp`}
                  alt={`${t.work.preview} ${project.name}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  // La primera pieza entra en el primer pantallazo de la
                  // sección; el resto puede esperar a acercarse.
                  priority={position === 0}
                />
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </article>
  );
}

function StatusTag({ status, dark }: { status: Project["status"]; dark: boolean }) {
  const { t } = useLang();
  const live = status === "live";
  return (
    <span className="label inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${live ? "bg-ember" : "bg-clay"}`}
      />
      <span className={dark ? "text-ivory/70" : "text-ink/70"}>
        {t.work.status[status]}
      </span>
    </span>
  );
}
