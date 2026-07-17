import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validazione
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Tutti i campi sono obbligatori" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email non valida" },
        { status: 400 }
      );
    }

    // TODO: In futuro integrare invio email o salvataggio DB
    if (process.env.NODE_ENV === "development") {
      console.log("API - Nuovo contatto:", { name, email, message });
    }

    return NextResponse.json({
      success: true,
      message: "Richiesta ricevuta con successo",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
