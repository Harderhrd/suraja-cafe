import { getSupabase } from "./supabase";

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
  const supabase = getSupabase();
  const { data: confirmed, error } = await supabase
    .from("reservations")
    .select("guests")
    .eq("booking_date", date)
    .eq("booking_time", time)
    .eq("status", "confermata");

  if (error) {
    console.error("Errore checkAvailability:", error);
    // Fallback: permetti comunque la prenotazione
    return { available: true, remaining: MAX_CAPACITY };
  }

  const currentOccupancy = (confirmed || []).reduce(
    (sum: number, r: { guests: number }) => sum + r.guests,
    0
  );
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
  const supabase = getSupabase();
  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      guests: data.guests,
      allergies: data.allergies,
      status: "confermata",
    })
    .select()
    .single();

  if (error) {
    console.error("Errore createReservation:", error);
    throw new Error("Errore durante la creazione della prenotazione");
  }

  return reservation as Reservation;
}

export async function getReservations(filters?: {
  date?: string;
  status?: string;
}): Promise<Reservation[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("reservations")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false });

  if (filters?.date) {
    query = query.eq("booking_date", filters.date);
  }
  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Errore getReservations:", error);
    return [];
  }

  return (data || []) as Reservation[];
}

export async function cancelReservation(id: number): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("reservations")
    .update({ status: "cancellata" })
    .eq("id", id);

  if (error) {
    console.error("Errore cancelReservation:", error);
    return false;
  }

  return true;
}
