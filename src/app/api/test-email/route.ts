import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * GET /api/test-email
 * Endpoint di debug per testare la configurazione email.
 * Chiamalo dal browser: https://suraja-cafe.vercel.app/api/test-email
 */
export async function GET() {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
  const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const OWNER_EMAIL = process.env.OWNER_EMAIL || "dipalmagabriele2@gmail.com";

  const info = {
    apiKeyPresent: !!RESEND_API_KEY,
    apiKeyPrefix: RESEND_API_KEY ? RESEND_API_KEY.substring(0, 6) + "..." : "NONE",
    fromEmail: FROM_EMAIL,
    ownerEmail: OWNER_EMAIL,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  };

  // Se non c'è chiave, non provare nemmeno
  if (!RESEND_API_KEY) {
    return NextResponse.json({
      success: false,
      message: "RESEND_API_KEY non configurata",
      config: info,
    });
  }

  // Prova a inviare una email di test
  try {
    const resend = new Resend(RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `Suraja Cafè Test <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: "🔧 Test configurazione email",
      html: "<p>Se vedi questa email, Resend funziona correttamente! 🎉</p>",
    });

    return NextResponse.json({
      success: true,
      message: "Email di test inviata! Controlla la tua casella (anche spam)",
      config: info,
      result,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      success: false,
      message: "Errore durante l'invio email di test",
      error: errMsg,
      config: info,
    });
  }
}
