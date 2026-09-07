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
      aria-label={t.nav.sections.contact}
      className="relative z-10 flex min-h-[100svh] flex-col justify-between overflow-hidden bg-ink px-5 pb-8 pt-28 text-ivory sm:px-8 lg:px-14 lg:pr-32"
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

      <div className="mt-14 flex flex-wrap items-end justify-between gap-4 border-t border-ivory/15 pt-6">
        <p className="label text-ivory/40">{t.contact.footer} · 2026</p>
        <a
          href="#hero"
          className="label text-ivory/40 transition-colors hover:text-ember"
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
        <Icon className="text-ivory/85 transition-colors group-hover:text-ember" />
        <span
          aria-hidden="true"
          className="text-lg text-ivory/45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-ember"
        >
          {channel.href ? "↗" : "→"}
        </span>
      </span>

      <span className="mt-6 block">
        <span className="block font-mono text-base uppercase tracking-[0.16em] text-ivory transition-colors group-hover:text-ember sm:text-lg">
          {channel.label}
        </span>
        <span className="mt-2 block break-words text-sm text-ivory/70">
          {channel.value}
        </span>
        {channel.note && (
          <span className="mt-1 block text-sm text-ivory/50">{channel.note}</span>
        )}
      </span>
    </>
  );

  const shape =
    "group flex h-full w-full flex-col rounded-xl border border-ivory/20 bg-ivory/[0.03] px-6 py-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-ember/60 hover:bg-ivory/[0.07]";

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
