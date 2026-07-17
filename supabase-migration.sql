-- ============================================
-- SUPABASE MIGRATION — Suraja Cafè Vegan
-- Esegui questo SQL nel Supabase SQL Editor
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================

-- Tabella prenotazioni
CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 20),
  allergies TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'confermata' CHECK (status IN ('confermata', 'cancellata')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indice per lookup veloci su date e status
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations (booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations (status);

-- Abilita Row Level Security (opzionale, per sicurezza extra)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere (per check disponibilità)
CREATE POLICY "Chiunque può leggere le prenotazioni" 
  ON reservations FOR SELECT 
  USING (true);

-- Policy: tutti possono inserire (per il form prenotazioni)
CREATE POLICY "Chiunque può creare prenotazioni" 
  ON reservations FOR INSERT 
  WITH CHECK (true);

-- Policy: solo admin può modificare/cancellare
CREATE POLICY "Solo admin può aggiornare" 
  ON reservations FOR UPDATE 
  USING (false);
