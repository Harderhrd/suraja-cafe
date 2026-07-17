"use client";

import { useState, useEffect, useCallback } from "react";

type Reservation = {
  id: number;
  name: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
  status: "confermata" | "cancellata";
  created_at: string;
};

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filterDate, setFilterDate] = useState(getTodayISO());
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const [adminToken, setAdminToken] = useState("");

  // Recupera token salvato
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setAdminToken(saved);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `${username}:${password}`;
    // Validiamo facendo una chiamata di prova
    fetch(`/api/booking/list`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setAdminToken(token);
          sessionStorage.setItem("admin_token", token);
          setIsLoggedIn(true);
          setLoginError("");
        } else {
          setLoginError("Credenziali non valide");
        }
      })
      .catch(() => setLoginError("Errore di connessione"));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminToken("");
    sessionStorage.removeItem("admin_token");
    setReservations([]);
  };

  const loadReservations = useCallback(async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);

      const res = await fetch(`/api/booking/list?${params}`, {
        headers: { authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations);
      }
    } catch {
      console.error("Errore caricamento prenotazioni");
    } finally {
      setLoading(false);
    }
  }, [adminToken, filterDate]);

  useEffect(() => {
    if (isLoggedIn) loadReservations();
  }, [isLoggedIn, loadReservations]);

  const handleCancel = async (id: number) => {
    if (!confirm("Annullare questa prenotazione?")) return;
    setCancellingId(id);
    try {
      const res = await fetch("/api/booking/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        loadReservations();
      }
    } catch {
      console.error("Errore cancellazione");
    } finally {
      setCancellingId(null);
    }
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-olive">Admin Suraja Cafè</h1>
            <p className="mt-1 text-sm text-brown-light">Accedi per gestire le prenotazioni</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-brown">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-brown">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm outline-none focus:border-sage focus:ring-2 focus:ring-sage/20"
              />
            </div>
            {loginError && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-sage py-3 font-medium text-white transition-colors hover:bg-sage-dark"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  const totalGuests = reservations
    .filter((r) => r.status === "confermata")
    .reduce((sum, r) => sum + r.guests, 0);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header admin */}
      <header className="border-b border-sage/10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-olive">Dashboard Prenotazioni</h1>
            <p className="text-xs text-brown-light">Suraja Cafè Vegan — Arcore</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-sage/30 px-4 py-2 text-sm text-brown transition-colors hover:bg-sage/10"
          >
            Esci
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Filtri e riepilogo */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-brown">Filtra per data:</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-xl border border-sage/20 px-4 py-2 text-sm outline-none focus:border-sage"
            />
            <button
              onClick={loadReservations}
              className="rounded-full bg-sage/10 px-4 py-2 text-sm font-medium text-sage-dark transition-colors hover:bg-sage/20"
            >
              Aggiorna
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-brown-light">
              Prenotazioni: <strong className="text-brown">{reservations.length}</strong>
            </span>
            <span className="text-brown-light">
              Coperti: <strong className="text-olive">{totalGuests}</strong>
              <span className="text-brown-light"> / 30</span>
            </span>
          </div>
        </div>

        {/* Tabella */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-8 w-8 animate-spin text-sage" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
            <p className="text-brown-light">Nessuna prenotazione per questa data</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sage/10 bg-sage/5">
                    <th className="px-4 py-3 text-left font-semibold text-olive">Ora</th>
                    <th className="px-4 py-3 text-left font-semibold text-olive">Nome</th>
                    <th className="px-4 py-3 text-left font-semibold text-olive">Telefono</th>
                    <th className="px-4 py-3 text-center font-semibold text-olive">Ospiti</th>
                    <th className="px-4 py-3 text-left font-semibold text-olive">Allergie</th>
                    <th className="px-4 py-3 text-center font-semibold text-olive">Stato</th>
                    <th className="px-4 py-3 text-center font-semibold text-olive">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((res) => (
                    <tr key={res.id} className="border-b border-sage/5 transition-colors hover:bg-sage/5">
                      <td className="px-4 py-3 font-medium text-brown">{res.booking_time}</td>
                      <td className="px-4 py-3 text-brown">{res.name}</td>
                      <td className="px-4 py-3 text-brown-light">
                        <a href={`tel:${res.phone}`} className="hover:text-sage-dark">
                          {res.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center text-brown">{res.guests}</td>
                      <td className="px-4 py-3">
                        {res.allergies ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            {res.allergies}
                          </span>
                        ) : (
                          <span className="text-brown-light/60">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {res.status === "confermata" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Confermata
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                            Cancellata
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {res.status === "confermata" && (
                          <button
                            onClick={() => handleCancel(res.id)}
                            disabled={cancellingId === res.id}
                            className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {cancellingId === res.id ? "..." : "Annulla"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
