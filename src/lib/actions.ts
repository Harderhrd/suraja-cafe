"use server";

import type { ContactFormState } from "@/types";
import { headers } from "next/headers";

// Rate limiting semplice (in-memory)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minuto
const RATE_LIMIT_MAX = 5; // max 5 richieste/minuto per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function createContact(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Rate limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return {
      success: false,
      message: "Troppe richieste. Riprova tra qualche minuto.",
    };
  }

  // Simula un delay per testing UI
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = formData.get("name")?.toString().trim().slice(0, 100) || "";
  const email = formData.get("email")?.toString().trim().slice(0, 254) || "";
  const message = formData.get("message")?.toString().trim().slice(0, 5000) || "";

  // Validazione base
  const errors: Record<string, string[]> = {};

  if (!name) errors.name = ["Il nome è obbligatorio"];
  if (!email) errors.email = ["L'email è obbligatoria"];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = ["Inserisci un'email valida"];
  if (!message) errors.message = ["Il messaggio è obbligatorio"];
  else if (message.length < 10)
    errors.message = ["Il messaggio deve essere di almeno 10 caratteri"];

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Correggi gli errori nel form.",
      errors,
    };
  }

  // Invia email al proprietario tramite Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const OWNER_EMAIL = process.env.OWNER_EMAIL || "dipalmagabriele2@gmail.com";
  const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: `Suraja Cafè <${FROM_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: `📩 Nuovo messaggio da ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF8F5; border-radius: 16px;">
            <div style="background: linear-gradient(135deg, #9DC88D, #6B8E23); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">📩 Nuovo Messaggio</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Suraja Cafè Vegan — Arcore</p>
            </div>
            <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; width: 120px;">Nome</td><td style="padding: 8px 0; color: #5C4033;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Email</td><td style="padding: 8px 0; color: #5C4033;"><a href="mailto:${email}" style="color: #7DAF6B;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; vertical-align: top;">Messaggio</td><td style="padding: 8px 0; color: #5C4033;">${message}</td></tr>
              </table>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Errore invio email contatto:", error);
    }
  }

  return {
    success: true,
    message: "Grazie per averci contattato! Ti risponderemo al più presto.",
  };
}
