"use client";

import { useEffect, useRef } from "react";
import { ContactForm } from "@/components/contact-form";
import { useLang } from "@/components/lang-provider";

/**
 * El formulario en una ventana modal.
 *
 * Usa el `<dialog>` nativo a propósito: el navegador ya sabe atrapar el foco,
 * cerrar con Escape y marcar el resto de la página como inerte. Reimplementar
 * eso a mano es de donde salen los modales inaccesibles.
 */
export function ContactDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLang();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // El Escape se atiende aquí, no dejando que el navegador cierre el diálogo
  // por su cuenta: si se cerrara solo, el estado de React seguiría creyéndolo
  // abierto, no se ejecutaría la limpieza y el `body` se quedaba sin scroll.
  // El estado de React es la única fuente de verdad; el diálogo lo obedece.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Con el modal abierto, el fondo no debe desplazarse.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-dialog-title"
      className="contact-dialog w-[min(38rem,calc(100vw-2rem))] rounded-xl border border-ivory/20 bg-ink p-0 text-ivory backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      // El cierre nativo por Escape se cancela: cerramos por estado, arriba.
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      // Clic en el fondo: el propio dialog ocupa toda la ventana, así que un
      // clic cuyo destino sea él mismo cae fuera del contenido.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="flex items-start justify-between gap-6 border-b border-ivory/15 px-6 py-5 sm:px-8">
        <h2
          id="contact-dialog-title"
          className="font-mono text-base uppercase tracking-[0.16em] text-ivory sm:text-lg"
        >
          {t.contact.form.heading}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.nav.close}
          className="-mr-2 -mt-1 rounded-md px-2 py-1 text-2xl leading-none text-ivory/60 transition-colors hover:text-ember"
        >
          ×
        </button>
      </div>

      <div className="px-6 py-7 sm:px-8">
        <ContactForm showHeading={false} />
      </div>
    </dialog>
  );
}
