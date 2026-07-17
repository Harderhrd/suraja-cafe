"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// Fasce orarie
const TIME_SLOTS = {
  "Pranzo": ["12:00", "12:30", "13:00", "13:30", "14:00"],
  "Apericena / Cena": ["19:00", "19:30", "20:00", "20:30", "21:00"],
};

type FormData = {
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  allergies: string;
};

type Step = "form" | "checking" | "success" | "error";

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    booking_date: "",
    booking_time: "",
    guests: 2,
    allergies: "",
  });

  // Ascolta l'evento custom per aprire la modale
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-booking", handler);
    return () => window.removeEventListener("open-booking", handler);
  }, []);

  // Blocca scroll quando aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("form");
      setMessage("");
      setForm({ name: "", phone: "", email: "", booking_date: "", booking_time: "", guests: 2, allergies: "" });
    }, 300);
  }, []);

  const updateField = (field: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Verifica disponibilità quando cambia orario
  const checkSlot = useCallback(async (date: string, time: string, guests: number) => {
    if (!date || !time) return;
    try {
      const res = await fetch(
        `/api/booking/check?date=${date}&time=${time}&guests=${guests}`
      );
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.booking_date || !form.booking_time) {
      setMessage("Compila tutti i campi obbligatori");
      setStep("error");
      return;
    }

    setStep("checking");
    setMessage("");

    // Verifica disponibilità
    const availability = await checkSlot(form.booking_date, form.booking_time, form.guests);
    if (!availability || !availability.available) {
      setMessage(
        "Ci dispiace, i posti per questa fascia oraria sono esauriti. Scegli un altro orario o un altro giorno."
      );
      setStep("error");
      return;
    }

    // Crea prenotazione
    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessage(err.error || "Errore durante la prenotazione");
        setStep("error");
        return;
      }

      setStep("success");
    } catch {
      setMessage("Errore di connessione. Riprova più tardi.");
      setStep("error");
    }
  };

  // Calendario: genera i prossimi 30 giorni
  const getDateOptions = () => {
    const options: { value: string; label: string }[] = [];
    const today = new Date();
    const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
    const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const value = d.toISOString().split("T")[0];
      const label = `${dayNames[d.getDay()]} ${d.getDate()} ${monthNames[d.getMonth()]}`;
      options.push({ value, label });
    }
    return options;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop sfocato */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl"
            style={{ maxHeight: "90vh" }}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Prenota un tavolo"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-sage to-olive px-6 py-5 text-white">
              <h2 className="text-xl font-bold">Prenota un Tavolo</h2>
              <p className="mt-1 text-sm text-white/80">
                Suraja Cafè Vegan — Arcore
              </p>
              <button
                onClick={close}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
                aria-label="Chiudi"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body — scrollabile */}
            <div className="overflow-y-auto p-6">
              {step === "success" ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sage/20">
                    <svg className="h-8 w-8 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-olive">Prenotazione Confermata!</h3>
                  <p className="mt-2 text-sm text-brown-light">
                    Grazie {form.name}, la tua prenotazione per il {form.booking_date} alle {form.booking_time} è stata confermata.
                  </p>
                  <p className="mt-1 text-sm text-brown-light">
                    {form.guests} {form.guests === 1 ? "ospite" : "ospiti"} · Ti aspettiamo!
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-full bg-sage px-8 py-3 font-medium text-white transition-colors hover:bg-sage-dark"
                  >
                    Chiudi
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Nome e Cognome <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Il tuo nome"
                      className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  {/* Telefono */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Telefono <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+39 3XX XXX XXXX"
                      className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Email <span className="text-brown-light/50">(per ricevere conferma)</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="tua@email.com"
                      className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  {/* Data */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Data <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={form.booking_date}
                      onChange={(e) => {
                        updateField("booking_date", e.target.value);
                        updateField("booking_time", "");
                      }}
                      className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
                    >
                      <option value="">Seleziona una data</option>
                      {getDateOptions().map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ora + Ospiti */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        Ora <span className="text-red-400">*</span>
                      </label>
                      <select
                        required
                        value={form.booking_time}
                        onChange={(e) => updateField("booking_time", e.target.value)}
                        disabled={!form.booking_date}
                        className="w-full rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20 disabled:opacity-50"
                      >
                        <option value="">
                          {form.booking_date ? "Scegli ora" : "Prima la data"}
                        </option>
                        {Object.entries(TIME_SLOTS).map(([meal, slots]) => (
                          <optgroup key={meal} label={meal}>
                            {slots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        Ospiti
                      </label>
                      <div className="flex items-center gap-3 rounded-xl border border-sage/20 px-4 py-2.5">
                        <button
                          type="button"
                          onClick={() => updateField("guests", Math.max(1, form.guests - 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/10 text-sm font-bold text-sage-dark transition-colors hover:bg-sage/20"
                          aria-label="Riduci ospiti"
                        >
                          -
                        </button>
                        <span className="min-w-[2ch] text-center text-sm font-bold text-brown">
                          {form.guests}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateField("guests", Math.min(20, form.guests + 1))}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-sage/10 text-sm font-bold text-sage-dark transition-colors hover:bg-sage/20"
                          aria-label="Aumenta ospiti"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Allergie */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Allergie / Esigenze Alimentari
                    </label>
                    <textarea
                      value={form.allergies}
                      onChange={(e) => updateField("allergies", e.target.value)}
                      placeholder="Es. allergia al glutine, preferenze alimentari..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-sage/20 px-4 py-2.5 text-sm text-brown placeholder-brown-light/50 outline-none transition-colors focus:border-sage focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  {/* Messaggio errore */}
                  {step === "error" && message && (
                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      {message}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={step === "checking"}
                    className="w-full rounded-full bg-sage py-3 font-medium text-white transition-colors hover:bg-sage-dark disabled:cursor-wait disabled:opacity-70"
                  >
                    {step === "checking" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Verifica disponibilità...
                      </span>
                    ) : (
                      "Prenota Ora"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
