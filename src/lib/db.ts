import fs from "fs";
import path from "path";

// Directory scrivibile: /tmp su Vercel, ./data in locale
const DATA_DIR = process.env.VERCEL
  ? "/tmp/suraja-data"
  : path.join(process.cwd(), "data");

const DB_FILE = path.join(DATA_DIR, "reservations.json");

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
  status: "confermata" | "cancellata";
  created_at: string;
}

const MAX_CAPACITY = 30;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDb(): Reservation[] {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

function writeDb(data: Reservation[]) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

let nextId = 1;

function getNextId(reservations: Reservation[]): number {
  if (reservations.length === 0) return 1;
  return Math.max(...reservations.map((r) => r.id)) + 1;
}

export async function checkAvailability(
  date: string,
  time: string,
  guests: number
): Promise<{ available: boolean; remaining: number }> {
  const reservations = readDb();
  const confirmed = reservations.filter(
    (r) =>
      r.booking_date === date &&
      r.booking_time === time &&
      r.status === "confermata"
  );
  const currentOccupancy = confirmed.reduce((sum, r) => sum + r.guests, 0);
  const remaining = MAX_CAPACITY - currentOccupancy;

  return {
    available: remaining >= guests,
    remaining,
  };
}

export async function createReservation(data: {
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
}): Promise<Reservation> {
  const reservations = readDb();
  const id = getNextId(reservations);

  const reservation: Reservation = {
    id,
    name: data.name,
    phone: data.phone,
    email: data.email,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    guests: data.guests,
    allergies: data.allergies,
    status: "confermata",
    created_at: new Date().toISOString(),
  };

  reservations.push(reservation);
  writeDb(reservations);
  return reservation;
}

export async function getReservations(filters?: {
  date?: string;
  status?: string;
}): Promise<Reservation[]> {
  let reservations = readDb();

  if (filters?.date) {
    reservations = reservations.filter((r) => r.booking_date === filters.date);
  }
  if (filters?.status) {
    reservations = reservations.filter((r) => r.status === filters.status);
  }

  // Ordina per data e ora decrescenti
  reservations.sort((a, b) => {
    const dateCmp = b.booking_date.localeCompare(a.booking_date);
    if (dateCmp !== 0) return dateCmp;
    return b.booking_time.localeCompare(a.booking_time);
  });

  return reservations;
}

export async function cancelReservation(id: number): Promise<boolean> {
  const reservations = readDb();
  const idx = reservations.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  reservations[idx].status = "cancellata";
  writeDb(reservations);
  return true;
}
