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

  // TODO: In futuro integrare invio email o salvataggio DB
  if (process.env.NODE_ENV === "development") {
    console.log("Nuovo contatto:", { name, email, message });
  }

  return {
    success: true,
    message: "Grazie per averci contattato! Ti risponderemo al più presto.",
  };
}
