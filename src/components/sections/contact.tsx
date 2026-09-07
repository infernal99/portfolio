"use client";

import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { PROFILE } from "@/lib/content";
import { MaskedLines, Reveal } from "@/components/motion-primitives";

interface Channel {
  key: string;
  label: string;
  value: string;
  note?: string;
  href: string;
  external: boolean;
}

/** Cierre. Un bloque a pantalla completa, tipografía al máximo y cuatro salidas. */
export function Contact() {
  const { t } = useLang();
  const reduced = useReducedMotion();

  const channels: Channel[] = [
    {
      key: "email",
      label: t.contact.emailLabel,
      value: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
      external: false,
    },
    {
      key: "linkedin",
      label: t.contact.linkedinLabel,
      value: "ian-monfil-odena",
      href: PROFILE.linkedin,
      external: true,
    },
    {
      key: "github",
      label: t.contact.githubLabel,
      value: PROFILE.githubHandle,
      note: t.contact.githubNote,
      href: PROFILE.github,
      external: true,
    },
    {
      key: "studio",
      label: t.contact.studioLabel,
      value: "velhouraempyre.vercel.app",
      note: t.contact.studioNote,
      href: PROFILE.studio,
      external: true,
    },
  ];

  return (
    <footer
      id="contact"
      aria-label={t.nav.sections.contact}
      className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink px-5 pb-8 pt-28 text-ivory sm:px-8 lg:px-14"
    >
      <div>
        <Reveal>
          <p className="label text-ember">{t.contact.label}</p>
        </Reveal>

        <h2 className="font-display mt-6 text-[clamp(3rem,12vw,11rem)] leading-[0.9]">
          <MaskedLines lines={[t.contact.title]} stagger={0.1} />
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-[42ch] text-lg text-ivory/60 sm:text-xl">
            {t.contact.intro}
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-px border-t border-ivory/15 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((c, i) => (
          <motion.li
            key={c.key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <a
              href={c.href}
              {...(c.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex h-full flex-col justify-between gap-6 border-b border-ivory/15 py-7 pr-6 transition-colors hover:bg-ivory/[0.04] sm:border-b-0 sm:pl-6 sm:first:pl-0"
            >
              <span className="label text-ivory/40 transition-colors group-hover:text-ember">
                {c.label}
              </span>
              <span>
                <span className="block break-words text-lg transition-transform duration-300 group-hover:translate-x-1 sm:text-xl">
                  {c.value}
                </span>
                {c.note && (
                  <span className="mt-1 block text-sm text-ivory/40">{c.note}</span>
                )}
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-ivory/15 pt-6">
        <p className="label text-ivory/40">{t.contact.footer} · 2026</p>
        <a
          href="#hero"
          className="label text-ivory/40 transition-colors hover:text-ember"
        >
          {t.a11y.toTop} ↑
        </a>
      </div>
    </footer>
  );
}
