"use client";

import { useCallback, useState, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLang } from "@/components/lang-provider";
import { PROFILE } from "@/lib/content";
import { MaskedLines, Reveal } from "@/components/motion-primitives";
import { ContactDialog } from "@/components/contact-dialog";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  VelhouraIcon,
} from "@/components/brand-icons";

interface Channel {
  key: string;
  label: string;
  value: string;
  note?: string;
  icon: ComponentType<{ className?: string }>;
  /** Sin href, el canal abre el formulario en lugar de navegar. */
  href?: string;
}

/** Cierre. Un bloque a pantalla completa, tipografía al máximo y cuatro salidas. */
export function Contact() {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const channels: Channel[] = [
    {
      key: "email",
      label: t.contact.emailLabel,
      value: PROFILE.email,
      note: t.contact.form.heading,
      icon: MailIcon,
    },
    {
      key: "linkedin",
      label: t.contact.linkedinLabel,
      value: "Ian Monfil Odena",
      icon: LinkedInIcon,
      href: PROFILE.linkedin,
    },
    {
      key: "github",
      label: t.contact.githubLabel,
      value: PROFILE.githubHandle,
      note: t.contact.githubNote,
      icon: GitHubIcon,
      href: PROFILE.github,
    },
    {
      key: "studio",
      label: t.contact.studioLabel,
      value: "velhouraempyre.vercel.app",
      note: t.contact.studioNote,
      icon: VelhouraIcon,
      href: PROFILE.studio,
    },
  ];

  return (
    <footer
      id="contact"
      data-saturated
      aria-label={t.nav.sections.contact}
      className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden bg-gradient-to-br from-azure via-azure to-teal px-5 pb-12 pt-28 text-paper sm:px-8 lg:px-14 lg:pr-32"
    >
      {/* La meta: aquí acaba el recorrido. */}
      <div className="checker absolute inset-x-0 top-0" aria-hidden="true" />

      <div>
        <Reveal>
          <p className="label text-volt">{t.contact.label}</p>
        </Reveal>

        <h2 className="font-display mt-6 text-[clamp(3rem,calc((100vw-2.5rem)/5.8),15rem)] leading-[0.86] sm:text-[clamp(3rem,calc((100vw-4rem)/5.8),15rem)] lg:text-[clamp(3rem,calc((100vw-11.5rem)/5.8),15rem)]">
          <MaskedLines lines={[t.contact.title]} stagger={0.1} />
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-[42ch] text-xl font-medium text-paper/90 sm:text-2xl">
            {t.contact.intro}
          </p>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel, i) => (
          <motion.li
            key={channel.key}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <ChannelButton
              channel={channel}
              onOpenForm={() => setDialogOpen(true)}
            />
          </motion.li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-paper/30 pt-6">
        <p className="label text-paper/85">{t.contact.footer} · 2026</p>
        <a
          href="#hero"
          className="label text-paper/85 transition-colors hover:text-volt"
        >
          {t.a11y.toTop} ↑
        </a>
      </div>

      <ContactDialog open={dialogOpen} onClose={closeDialog} />
    </footer>
  );
}

/**
 * Un canal de contacto. Es un enlace o un botón según a dónde lleve, pero se
 * dibuja igual: mismo marco, mismo logo, misma respuesta al pasar por encima.
 */
function ChannelButton({
  channel,
  onOpenForm,
}: {
  channel: Channel;
  onOpenForm: () => void;
}) {
  const Icon = channel.icon;

  const content = (
    <>
      <span className="flex items-center justify-between gap-4">
        <Icon className="text-paper transition-colors group-hover:text-volt" />
        <span
          aria-hidden="true"
          className="text-lg text-paper/80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-volt"
        >
          {channel.href ? "↗" : "→"}
        </span>
      </span>

      <span className="mt-6 block">
        <span className="block font-mono text-base uppercase tracking-[0.16em] text-paper transition-colors group-hover:text-volt sm:text-lg">
          {channel.label}
        </span>
        <span className="mt-2 block break-words text-sm text-paper/95">
          {channel.value}
        </span>
        {channel.note && (
          <span className="mt-1 block text-sm text-paper/80">{channel.note}</span>
        )}
      </span>
    </>
  );

  const shape =
    "group flex h-full w-full flex-col rounded-xl border border-paper/40 bg-paper/[0.08] px-6 py-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-volt hover:bg-paper/[0.16]";

  if (!channel.href) {
    return (
      <button type="button" onClick={onOpenForm} className={shape}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      className={shape}
    >
      {content}
    </a>
  );
}
