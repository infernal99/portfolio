"use server";

import { PROFILE } from "@/lib/content";

/**
 * Envío del formulario de contacto.
 *
 * Devuelve códigos, nunca frases: el sitio es bilingüe y el texto que ve el
 * visitante sale del diccionario del cliente, no de aquí.
 */
export type ContactCode =
  | "ok"
  | "invalid_name"
  | "invalid_email"
  | "invalid_message"
  | "not_configured"
  | "send_failed";

export interface ContactState {
  code: ContactCode | null;
}

const MAX = { name: 100, email: 200, message: 4000 };

/** Suficiente para descartar erratas evidentes; la verdad la dice el rebote. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Campo trampa: invisible para una persona, irresistible para un bot. Si
  // viene relleno respondemos "ok" sin enviar nada, para no darle pistas.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { code: "ok" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2 || name.length > MAX.name) return { code: "invalid_name" };
  if (!EMAIL.test(email) || email.length > MAX.email) {
    return { code: "invalid_email" };
  }
  if (message.length < 10 || message.length > MAX.message) {
    return { code: "invalid_message" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin clave no se envía nada. Decirlo en claro es mejor que fingir que
    // el mensaje ha salido y perderlo en silencio.
    console.error(
      "[contacto] Falta RESEND_API_KEY: el mensaje no se ha enviado.",
    );
    return { code: "not_configured" };
  }

  const to = process.env.CONTACT_TO_EMAIL ?? PROFILE.email;
  // onboarding@resend.dev funciona sin verificar dominio, pero solo puede
  // escribir a la dirección dueña de la cuenta de Resend.
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Portfolio <${from}>`,
        to: [to],
        // Responder al correo lleva directamente a quien escribió.
        reply_to: email,
        subject: `Portfolio — mensaje de ${name}`,
        text: `${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error(
        `[contacto] Resend respondió ${response.status}: ${await response.text()}`,
      );
      return { code: "send_failed" };
    }

    return { code: "ok" };
  } catch (error) {
    console.error("[contacto] No se ha podido contactar con Resend:", error);
    return { code: "send_failed" };
  }
}
