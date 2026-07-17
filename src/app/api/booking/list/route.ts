import { NextRequest, NextResponse } from "next/server";
import { getReservations } from "@/lib/db";

// Semplice validazione admin tramite header
function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

  // Formato atteso: "Bearer admin:password123"
  try {
    const token = authHeader.replace("Bearer ", "").trim();
    const [username, password] = token.split(":");

    return (
      username === (process.env.ADMIN_USERNAME || "admin") &&
      password === (process.env.ADMIN_PASSWORD || "admin123")
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    const status = searchParams.get("status") || undefined;

    const reservations = getReservations({ date, status });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error("Errore lista prenotazioni:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
