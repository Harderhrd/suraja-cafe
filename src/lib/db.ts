import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "reservations.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Crea la cartella data se non esiste
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      booking_date TEXT NOT NULL,
      booking_time TEXT NOT NULL,
      guests INTEGER NOT NULL CHECK(guests >= 1),
      allergies TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'confermata' CHECK(status IN ('confermata', 'cancellata')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

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

export function checkAvailability(
  date: string,
  time: string,
  guests: number
): { available: boolean; remaining: number } {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COALESCE(SUM(guests), 0) as total
       FROM reservations
       WHERE booking_date = ? AND booking_time = ? AND status = 'confermata'`
    )
    .get(date, time) as { total: number };

  const currentOccupancy = row.total;
  const remaining = MAX_CAPACITY - currentOccupancy;

  return {
    available: remaining >= guests,
    remaining,
  };
}

export function createReservation(data: {
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
}): Reservation {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO reservations (name, phone, email, booking_date, booking_time, guests, allergies)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    data.name,
    data.phone,
    data.email,
    data.booking_date,
    data.booking_time,
    data.guests,
    data.allergies
  );
  return db
    .prepare("SELECT * FROM reservations WHERE id = ?")
    .get(result.lastInsertRowid) as Reservation;
}

export function getReservations(filters?: {
  date?: string;
  status?: string;
}): Reservation[] {
  const db = getDb();
  let query = "SELECT * FROM reservations WHERE 1=1";
  const params: unknown[] = [];

  if (filters?.date) {
    query += " AND booking_date = ?";
    params.push(filters.date);
  }
  if (filters?.status) {
    query += " AND status = ?";
    params.push(filters.status);
  }

  query += " ORDER BY booking_date DESC, booking_time DESC";
  return db.prepare(query).all(...params) as Reservation[];
}

export function cancelReservation(id: number): boolean {
  const db = getDb();
  const result = db
    .prepare("UPDATE reservations SET status = 'cancellata' WHERE id = ?")
    .run(id);
  return result.changes > 0;
}
