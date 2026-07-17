import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// In sviluppo/test, possiamo usare l'email di default di Resend
// In produzione, va verificato un dominio personalizzato
const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "info@surajacafe.it";

interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export async function sendConfirmationEmails(
  booking: BookingDetails
): Promise<{ ownerOk: boolean; clientOk: boolean }> {
  let ownerOk = false;
  let clientOk = false;

  if (!RESEND_API_KEY) {
    console.log("Email not sent — RESEND_API_KEY not configured");
    return { ownerOk, clientOk };
  }

  const resend = new Resend(RESEND_API_KEY);
  const dateFormatted = formatDate(booking.booking_date);

  try {
    // 1) Email al proprietario — notifica nuova prenotazione
    const ownerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF8F5; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #9DC88D, #6B8E23); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🌱 Nuova Prenotazione</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Suraja Cafè Vegan — Arcore</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; width: 120px;">Cliente</td><td style="padding: 8px 0; color: #5C4033;">${booking.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Telefono</td><td style="padding: 8px 0; color: #5C4033;"><a href="tel:${booking.phone}" style="color: #7DAF6B;">${booking.phone}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Data</td><td style="padding: 8px 0; color: #5C4033;">${dateFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Ora</td><td style="padding: 8px 0; color: #5C4033;">${booking.booking_time}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Ospiti</td><td style="padding: 8px 0; color: #5C4033;">${booking.guests}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; vertical-align: top;">Allergie / Note</td><td style="padding: 8px 0; color: #5C4033;">${booking.allergies || "Nessuna"}</td></tr>
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #A0897A;">
            <p>📋 Amministra le prenotazioni su <a href="https://surajacafe.vercel.app/admin" style="color: #7DAF6B;">Dashboard Admin</a></p>
          </div>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: `Suraja Cafè <${FROM_EMAIL}>`,
      to: OWNER_EMAIL,
      subject: `🌱 Nuova prenotazione — ${booking.name} (${booking.guests} ospiti)`,
      html: ownerHtml,
    });
    ownerOk = true;
    console.log("Owner email sent successfully");
  } catch (error) {
    console.error("Owner email error:", error);
  }

  try {
    // 2) Email al cliente — conferma prenotazione
    if (!booking.email) {
      console.log("Client email skipped — no email provided");
      clientOk = true; // non è un errore
    } else {
      const clientHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF8F5; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #9DC88D, #6B8E23); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 8px;">✅</div>
          <h1 style="color: white; margin: 0; font-size: 22px;">Prenotazione Confermata!</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">Suraja Cafè Vegan — Arcore</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px;">
          <p style="color: #5C4033; margin: 0 0 16px;">Ciao <strong>${booking.name}</strong>, ecco i dettagli della tua prenotazione:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; width: 120px;">Data</td><td style="padding: 8px 0; color: #5C4033;">${dateFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Ora</td><td style="padding: 8px 0; color: #5C4033;">${booking.booking_time}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600;">Ospiti</td><td style="padding: 8px 0; color: #5C4033;">${booking.guests}</td></tr>
            <tr><td style="padding: 8px 0; color: #5C4033; font-weight: 600; vertical-align: top;">Allergie / Note</td><td style="padding: 8px 0; color: #5C4033;">${booking.allergies || "Nessuna"}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F7F1E5; border-radius: 12px;">
            <p style="margin: 0; color: #5C4033; font-size: 14px;">
              📍 <strong>Indirizzo:</strong> Via Roma, 4, 20862 Arcore (MB)<br>
              📞 <strong>Telefono:</strong> 039 265 1629
            </p>
          </div>
          <p style="color: #A0897A; font-size: 12px; margin-top: 16px; text-align: center;">
            Se hai bisogno di modificare o annullare la prenotazione, chiamaci al 039 265 1629.
          </p>
          <p style="color: #A0897A; font-size: 12px; text-align: center; margin: 0;">
            Ti aspettiamo! 🌱
          </p>
        </div>
      </div>
    `;

      await resend.emails.send({
        from: `Suraja Cafè <${FROM_EMAIL}>`,
        to: booking.email,
        subject: `✅ Prenotazione confermata — Suraja Cafè Vegan, ${dateFormatted}`,
        html: clientHtml,
      });
      clientOk = true;
      console.log("Client email sent successfully");
    }
  } catch (error) {
    console.error("Client email error:", error);
  }

  return { ownerOk, clientOk };
}
