"use client";

import { RESTAURANT_INFO } from "@/lib/constants";
import { getDayName } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MapEmbed from "@/components/ui/MapEmbed";
import ContactForm from "@/components/ui/ContactForm";
import Button from "@/components/ui/Button";

function OrariTable() {
  const today = getDayName();

  return (
    <div className="overflow-hidden rounded-xl border border-sage/20">
      <table className="w-full text-sm" aria-label="Orari di apertura">
        <thead>
          <tr className="bg-sage/10">
            <th scope="col" className="px-4 py-3 text-left font-semibold text-olive">
              Giorno
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold text-olive">
              Orario
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(RESTAURANT_INFO.hours).map(([day, hours]) => (
            <tr
              key={day}
              className={`border-t border-sage/10 transition-colors ${
                day === today
                  ? "bg-sage/10 font-semibold text-olive"
                  : "text-brown hover:bg-cream"
              }`}
              aria-current={day === today ? "true" : undefined}
            >
              <td className="px-4 py-3">
                {day === today ? (
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sage-dark" aria-hidden="true" />
                    {day}
                  </span>
                ) : (
                  day
                )}
              </td>
              <td className="px-4 py-3 text-right">{hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Address */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-olive">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-brown">Indirizzo</h3>
          <p className="mt-1 text-sm text-brown-light">
            {RESTAURANT_INFO.address}
          </p>
          <Button
            variant="ghost"
            href={RESTAURANT_INFO.googleMapsUrl}
            className="mt-1 !p-0 text-sm text-sage-dark underline"
          >
            Apri su Google Maps
          </Button>
        </div>
      </div>

      {/* Phone */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-olive">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-brown">Telefono</h3>
          <a
            href={`tel:${RESTAURANT_INFO.phoneClean}`}
            className="mt-1 block text-sm text-sage-dark underline hover:text-olive"
          >
            {RESTAURANT_INFO.phone}
          </a>
        </div>
      </div>

      {/* Hours */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-olive">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="mb-3 font-semibold text-brown">Orari</h3>
          <OrariTable />
        </div>
      </div>
    </div>
  );
}

export default function Contatti() {
  return (
    <section id="contatti" className="bg-cream py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Contattaci"
            subtitle="Prenota un tavolo, scrivici o passa a trovarci. Siamo qui per te."
            centered
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal direction="left">
            <ContactInfo />
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">
              <h3 className="mb-6 text-xl font-bold text-olive">
                Scrivici un Messaggio
              </h3>
              <ContactForm />
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="mt-16">
            <MapEmbed />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
