"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Carousel from "@/components/ui/Carousel";
import Button from "@/components/ui/Button";
import { REVIEWS, RESTAURANT_INFO } from "@/lib/constants";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} stelle su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-amber-400" : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Recensioni() {
  const slides = REVIEWS.map((review) => (
    <div
      key={review.id}
      className="mx-auto max-w-2xl px-4 text-center"
    >
      {/* Quote icon */}
      <svg
        className="mx-auto mb-4 h-10 w-10 text-sage/30"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.114 11 15c0 2.21-1.79 4-4 4-1.2 0-2.121-.447-2.417-1.679zm9.584 0C13.136 16.227 12.583 15 12.583 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.174 11.69 20.583 13.114 20.583 15c0 2.21-1.79 4-4 4-1.2 0-2.121-.447-2.417-1.679z" />
      </svg>

      <StarRating rating={review.rating} />

      <p className="mt-4 text-base italic leading-relaxed text-brown md:text-lg">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="mt-4">
        <p className="font-semibold text-olive">{review.name}</p>
        <p className="text-sm text-brown-light">{review.date}</p>
      </div>
    </div>
  ));

  return (
    <section id="recensioni" className="bg-beige/50 py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Cosa Dicono di Noi"
            subtitle="Le parole dei nostri clienti sono il nostro miglior biglietto da visita."
            centered
          />
        </ScrollReveal>

        {/* Rating in evidenza */}
        <ScrollReveal delay={0.15}>
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-md">
              <span className="text-3xl font-bold text-olive">
                {RESTAURANT_INFO.rating} ★
              </span>
              <div className="text-left text-sm">
                <p className="font-medium text-brown">
                  {RESTAURANT_INFO.reviewCount} recensioni su Google
                </p>
                <a
                  href={RESTAURANT_INFO.googleMapsReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-dark underline hover:text-olive"
                >
                  Leggi tutte le recensioni
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel recensioni */}
        <ScrollReveal delay={0.3}>
          <Carousel items={slides} autoPlayInterval={6000} />
        </ScrollReveal>

        {/* CTA recensione */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <p className="mb-4 text-brown-light">
              Hai visitato Suraja Cafè Vegan? Lascia una recensione!
            </p>
            <Button
              variant="outline"
              href={RESTAURANT_INFO.googleMapsReviewUrl}
            >
              Scrivi una Recensione
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
