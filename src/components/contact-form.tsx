"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { sendContact, type ContactState } from "@/app/actions";
import { useLang } from "@/components/lang-provider";
import { PROFILE } from "@/lib/content";

const INITIAL: ContactState = { code: null };

export function ContactForm({ showHeading = true }: { showHeading?: boolean }) {
  const { t } = useLang();
  const copy = t.contact.form;
  const [state, action] = useActionState(sendContact, INITIAL);
  const ids = useId();

  const sent = state.code === "ok";
  const error = state.code && state.code !== "ok" ? state.code : null;
  // Si el envío falla o no está configurado, el visitante no se queda sin
  // salida: se le ofrece el correo directo en el mismo sitio.
  const offerFallback =
    error === "not_configured" || error === "send_failed";

  const field =
    "mt-2 w-full rounded-md border border-ivory/25 bg-ivory/[0.04] px-4 py-3 text-ivory placeholder:text-ivory/35 transition-colors focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember";

  return (
    <div>
      {showHeading && (
        <h3 className="font-mono text-base uppercase tracking-[0.16em] text-ivory/75 sm:text-lg">
          {copy.heading}
        </h3>
      )}
      <p className="max-w-[46ch] text-sm text-ivory/60">{copy.intro}</p>

      <form action={action} className="mt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${ids}-name`} className="label text-ivory/60">
              {copy.name}
            </label>
            <input
              id={`${ids}-name`}
              name="name"
              type="text"
              required
              maxLength={100}
              autoComplete="name"
              className={field}
            />
          </div>
          <div>
            <label htmlFor={`${ids}-email`} className="label text-ivory/60">
              {copy.email}
            </label>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              className={field}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor={`${ids}-message`} className="label text-ivory/60">
            {copy.message}
          </label>
          <textarea
            id={`${ids}-message`}
            name="message"
            required
            minLength={10}
            maxLength={4000}
            rows={5}
            className={`${field} resize-y`}
          />
        </div>

        {/* Campo trampa para bots. Fuera de la vista y fuera del foco, nunca
            oculto con display:none: eso lo delata. */}
        <div aria-hidden="true" className="absolute left-[-9999px] opacity-0">
          <label htmlFor={`${ids}-company`}>Company</label>
          <input
            id={`${ids}-company`}
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <SubmitButton label={copy.send} pending={copy.sending} />

          {/* aria-live: quien use lector de pantalla se entera del resultado
              sin tener que ir a buscarlo. */}
          <p aria-live="polite" className="text-sm">
            {sent && <span className="text-ember">{copy.ok}</span>}
            {error && (
              <span className="text-ivory/75">
                {copy.errors[error]}
                {offerFallback && (
                  <>
                    {" "}
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="underline decoration-ivory/40 underline-offset-4 transition-colors hover:text-ember hover:decoration-ember"
                    >
                      {PROFILE.email}
                    </a>
                  </>
                )}
              </span>
            )}
          </p>
        </div>
      </form>
    </div>
  );
}

function SubmitButton({ label, pending }: { label: string; pending: string }) {
  const status = useFormStatus();

  return (
    <button
      type="submit"
      disabled={status.pending}
      className="label rounded-full bg-ember px-7 py-3.5 text-ivory transition-opacity hover:opacity-85 disabled:opacity-60"
    >
      {status.pending ? pending : label}
    </button>
  );
}
