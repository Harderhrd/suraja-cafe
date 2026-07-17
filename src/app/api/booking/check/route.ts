import { NextRequest, NextResponse } from "next/server";
import { checkAvailability } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const guests = parseInt(searchParams.get("guests") || "1", 10);

    if (!date || !time) {
      return NextResponse.json(
        { error: "Parametri mancanti: date, time" },
        { status: 400 }
      );
    }

    const result = checkAvailability(date, time, guests);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Errore check disponibilità:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}
