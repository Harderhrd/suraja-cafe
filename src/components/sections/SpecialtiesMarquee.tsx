"use client";

import { useReducedMotion } from "motion/react";

const SPECIALTIES = [
  "100% Vegetale",
  "Dolci Artigianali",
  "Apericena Vegana",
  "Ingredienti Freschi",
  "Cucina Naturale",
  "Torte Fatte in Casa",
  "Piatti Senza Glutine",
  "Tisane & Caffè",
  "Colazione Vegana",
  "Menu Stagionale",
  "Cocktail Vegetali",
  "Prodotti Locali",
  "Dolci al Pistacchio",
  "Brunch Domenicale",
];

export default function SpecialtiesMarquee() {
  const prefersReduced = useReducedMotion();

  // Duplica per effetto continuo senza gap
  const items = [...SPECIALTIES, ...SPECIALTIES];

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-r from-sage-dark via-olive to-sage-dark py-4"
      aria-label="Specialità del locale"
    >
      <div className="flex whitespace-nowrap">
        <div
          className={`flex shrink-0 items-center gap-16 ${
            prefersReduced ? "" : "animate-marquee"
          }`}
        >
          {items.map ((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-4 text-sm font-medium tracking-wide text-white/90 md:text-base"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage-light" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
        {/* Second copy per loop senza interruzioni — stesso markup */}
        <div
          className={`flex shrink-0 items-center gap-16 ${
            prefersReduced ? "" : "animate-marquee"
          }`}
          aria-hidden="true"
        >
          {items.map ((item, index) => (
            <span
              key={`dup-${item}-${index}`}
              className="inline-flex items-center gap-4 text-sm font-medium tracking-wide text-white/90 md:text-base"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage-light" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
