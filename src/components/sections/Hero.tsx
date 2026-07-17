"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// Unsplash: cozy café/restaurant interior
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80";

type AnimConfig = {
  initial: Record<string, number>;
  animate: Record<string, number>;
  transition: Record<string, unknown>;
};

function useAnim(delay = 0): AnimConfig {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 50, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] },
  };
}

export default function Hero() {
  const prefersReduced = useReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!parallaxRef.current || prefersReduced) return;
    const translateY = Math.min(window.scrollY * 0.15, 40);
    parallaxRef.current.style.transform = `translateY(${translateY}px) scale(1.1)`;
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, prefersReduced]);

  const a0 = useAnim(0);
  const a2 = useAnim(0.2);
  const a35 = useAnim(0.35);
  const a45 = useAnim(0.45);
  const a6 = useAnim(0.6);

  return (
    <section
      className="relative flex min-h-screen items-start justify-center overflow-hidden md:items-center"
      aria-label="Hero"
    >
      {/* Background Image con Ken Burns */}
      <motion.div
        ref={parallaxRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          willChange: "transform",
        }}
        initial={prefersReduced ? {} : { scale: 1.05 }}
        animate={prefersReduced ? {} : { scale: 1.1 }}
        transition={{ duration: 8, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* Overlay sfumato */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(29, 29, 29, 0.75) 0%,
              rgba(29, 29, 29, 0.45) 50%,
              rgba(29, 29, 29, 0.85) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* Grain texture */}
      {!prefersReduced && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
      )}

      {/* Decorative gradient orbs */}
      {!prefersReduced && (
        <>
          <motion.span
            className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #9DC88D, transparent)" }}
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute -bottom-40 -right-40 h-[35rem] w-[35rem] rounded-full opacity-20 blur-[120px]"
            style={{ background: "radial-gradient(circle, #6B8E23, transparent)" }}
            animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full opacity-10 blur-[100px]"
            style={{ background: "radial-gradient(circle, #C5E3B8, transparent)" }}
            animate={{ y: [0, -50, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-28 text-center md:pt-0 lg:pt-0">
        {/* Badge */}
        <motion.div
          initial={a0.initial}
          animate={a0.animate}
          transition={a0.transition}
          className="mb-8 inline-block"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-white/80 backdrop-blur-sm sm:px-5 sm:py-2 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
            </span>
            Ristorante Vegano — Arcore, MB
          </span>
        </motion.div>

        <motion.h1
          initial={a2.initial}
          animate={a2.animate}
          transition={a2.transition}
          className="text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          Il gusto del
          <br />
          <span className="bg-gradient-to-r from-sage to-sage-light bg-clip-text text-transparent">
            benessere
          </span>
          , completamente vegan.
        </motion.h1>

        <motion.p
          initial={a35.initial}
          animate={a35.animate}
          transition={a35.transition}
          className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-xl"
        >
          Suraja Cafè Vegan — Via Roma, 4, Arcore
        </motion.p>

        {/* Rating pill */}
        <motion.div
          initial={a45.initial}
          animate={a45.animate}
          transition={a45.transition}
          className="mt-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
            <span className="text-amber-400">★★★★★</span>
            <span className="font-semibold text-white">4.6</span>
            <span className="text-white/50">·</span>
            <span>138 recensioni</span>
          </div>
        </motion.div>

        <motion.div
          initial={a6.initial}
          animate={a6.animate}
          transition={a6.transition}
          className="mt-10"
        >
          <motion.div
            animate={
              prefersReduced
                ? {}
                : {
                    boxShadow: [
                      "0 0 0 0 rgba(157, 200, 141, 0.4)",
                      "0 0 0 20px rgba(157, 200, 141, 0)",
                    ],
                  }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="inline-block rounded-full"
          >
            <Button
              variant="primary"
              href="#contatti"
              className="text-base shadow-xl md:text-lg"
            >
              Prenota un Tavolo
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
              Scopri di più
            </span>
            <svg
              className="h-5 w-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
