import initSqlJs, { type Database as SqlJsDatabase } from "sql.js";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(
  process.env.VERCEL ? "/tmp" : process.cwd(),
  "data",
  "reservations.db"
);

let db: SqlJsDatabase | null = null;
let initPromise: Promise<SqlJsDatabase> | null = null;

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs();

    // Crea la cartella data se non esiste
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Carica database esistente o creane uno nuovo
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    db.run("PRAGMA journal_mode = WAL");
    db.run("PRAGMA foreign_keys = ON");
    initSchema(db);
    saveDb();
    return db;
  })();

  return initPromise;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function initSchema(db: SqlJsDatabase) {
  db.run(`
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

export async function checkAvailability(
  date: string,
  time: string,
  guests: number
): Promise<{ available: boolean; remaining: number }> {
  const database = await getDb();
  const result = database.exec(
    `SELECT COALESCE(SUM(guests), 0) as total
     FROM reservations
     WHERE booking_date = ? AND booking_time = ? AND status = 'confermata'`,
    [date, time]
  );

  const currentOccupancy =
    result.length > 0 && result[0].values.length > 0
      ? Number(result[0].values[0][0])
      : 0;
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
  const database = await getDb();
  database.run(
    `INSERT INTO reservations (name, phone, email, booking_date, booking_time, guests, allergies)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.phone,
      data.email,
      data.booking_date,
      data.booking_time,
      data.guests,
      data.allergies,
    ]
  );
  saveDb();

  const result = database.exec(
    "SELECT * FROM reservations WHERE id = (SELECT last_insert_rowid())"
  );
  return rowToReservation(result[0]);
}

export async function getReservations(filters?: {
  date?: string;
  status?: string;
}): Promise<Reservation[]> {
  const database = await getDb();
  let query = "SELECT * FROM reservations WHERE 1=1";
  const params: (string | number)[] = [];

  if (filters?.date) {
    query += " AND booking_date = ?";
    params.push(filters.date);
  }
  if (filters?.status) {
    query += " AND status = ?";
    params.push(filters.status);
  }

  query += " ORDER BY booking_date DESC, booking_time DESC";
  const results = database.exec(query, params);
  return results.map((r) => rowToReservation(r));
}

export async function cancelReservation(id: number): Promise<boolean> {
  const database = await getDb();
  database.run("UPDATE reservations SET status = 'cancellata' WHERE id = ?", [
    id,
  ]);
  saveDb();

  const result = database.exec(
    "SELECT changes() as changed"
  );
  const changed =
    result.length > 0 && result[0].values.length > 0
      ? Number(result[0].values[0][0])
      : 0;
  return changed > 0;
}

function rowToReservation(row: {
  columns: string[];
  values: unknown[][];
}): Reservation {
  const cols = row.columns;
  const vals = row.values[0];
  return {
    id: vals[cols.indexOf("id")] as number,
    name: vals[cols.indexOf("name")] as string,
    phone: vals[cols.indexOf("phone")] as string,
    email: vals[cols.indexOf("email")] as string,
    booking_date: vals[cols.indexOf("booking_date")] as string,
    booking_time: vals[cols.indexOf("booking_time")] as string,
    guests: vals[cols.indexOf("guests")] as number,
    allergies: vals[cols.indexOf("allergies")] as string,
    status: vals[cols.indexOf("status")] as "confermata" | "cancellata",
    created_at: vals[cols.indexOf("created_at")] as string,
  };
}
