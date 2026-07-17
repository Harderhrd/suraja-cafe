import { NextRequest, NextResponse } from "next/server";
import { cancelReservation } from "@/lib/db";

function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return false;

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

export async function POST(request: NextRequest) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "ID prenotazione mancante o non valido" },
        { status: 400 }
      );
    }

    const ok = cancelReservation(id);

    if (!ok) {
      return NextResponse.json(
        { error: "Prenotazione non trovata" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore cancellazione prenotazione:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
