import { NextRequest, NextResponse } from "next/server";
import { checkAvailability, createReservation } from "@/lib/db";
import { sendConfirmationEmails } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, booking_date, booking_time, guests, allergies } = body;

    // Validazione campi obbligatori
    if (!name?.trim() || !phone?.trim() || !booking_date || !booking_time || !guests) {
      return NextResponse.json(
        { error: "Tutti i campi obbligatori devono essere compilati" },
        { status: 400 }
      );
    }

    // Validazione data: non può essere nel passato
    const today = new Date().toISOString().split("T")[0];
    if (booking_date < today) {
      return NextResponse.json(
        { error: "Non puoi prenotare per una data passata" },
        { status: 400 }
      );
    }

    // Validazione numero ospiti
    const numGuests = parseInt(guests, 10);
    if (numGuests < 1 || numGuests > 20) {
      return NextResponse.json(
        { error: "Numero di ospiti non valido (1-20)" },
        { status: 400 }
      );
    }

    // Verifica disponibilità — evita overbooking
    const availability = checkAvailability(booking_date, booking_time, numGuests);
    if (!availability.available) {
      return NextResponse.json(
        {
          error: "Ci dispiace, i posti per questa fascia oraria sono esauriti. Scegli un altro orario o un altro giorno.",
          remaining: availability.remaining,
        },
        { status: 409 }
      );
    }

    // Crea prenotazione
    const reservation = createReservation({
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || "",
      booking_date,
      booking_time,
      guests: numGuests,
      allergies: allergies?.trim() || "",
    });

    // Invia email di notifica (proprietario) e conferma (cliente) in background
    sendConfirmationEmails(reservation).catch(console.error);

    return NextResponse.json(
      { success: true, reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Errore creazione prenotazione:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
