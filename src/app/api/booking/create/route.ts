import { NextRequest, NextResponse } from "next/server";
import { checkAvailability, createReservation } from "@/lib/db";

// Numero WhatsApp del proprietario (fisso)
const OWNER_PHONE = "393917429980";

// CallMeBot API key dalle env (opzionale — salta se non configurata)
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY || "";

async function sendWhatsAppNotification(reservation: {
  name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
}) {
  if (!CALLMEBOT_APIKEY) {
    console.log("WhatsApp notification skipped — CALLMEBOT_APIKEY not configured");
    return;
  }

  const message = `🌱 *Nuova Prenotazione Suraja Cafè!*
👤 *Nome:* ${reservation.name}
👥 *Ospiti:* ${reservation.guests}
📅 *Data:* ${reservation.booking_date} alle ore ${reservation.booking_time}
📞 *Contatto:* ${reservation.phone}
⚠️ *Note/Allergie:* ${reservation.allergies || "Nessuna"}`;

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${OWNER_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_APIKEY}`;
    
    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error("WhatsApp send failed:", await response.text());
    } else {
      console.log("WhatsApp notification sent successfully");
    }
  } catch (error) {
    console.error("WhatsApp notification error:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, booking_date, booking_time, guests, allergies } = body;

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
          error: `Ci dispiace, i posti per questa fascia oraria sono esauriti. Scegli un altro orario o un altro giorno.`,
          remaining: availability.remaining,
        },
        { status: 409 }
      );
    }

    // Crea prenotazione
    const reservation = createReservation({
      name: name.trim(),
      phone: phone.trim(),
      booking_date,
      booking_time,
      guests: numGuests,
      allergies: allergies?.trim() || "",
    });

    // Invia notifica WhatsApp in background (non bloccante)
    sendWhatsAppNotification(reservation).catch(console.error);

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
