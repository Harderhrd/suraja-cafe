"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Chi Siamo", href: "#chi-siamo" },
  { label: "Menu", href: "#menu" },
  { label: "Galleria", href: "#galleria" },
  { label: "Recensioni", href: "#recensioni" },
  { label: "Contatti", href: "#contatti" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chiude il menu mobile al resize verso desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Blocca scroll quando menu mobile aperto
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = () => {
    setIsMobileOpen(false);
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-booking"));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-lg backdrop-blur-sm"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <a
          href="#"
          className={`text-xl font-bold transition-colors md:text-2xl ${
            isScrolled ? "text-olive hover:text-sage-dark" : "text-white hover:text-sage-light"
          }`}
          aria-label="Suraja Cafè Vegan — Torna all'inizio"
        >
          Suraja Cafè Vegan
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-sage-light ${
                isScrolled ? "text-brown" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant={isScrolled ? "primary" : "outline"}
            onClick={handleBookingClick}
            className="ml-2"
          >
            Prenota un Tavolo
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className={`flex items-center justify-center rounded-lg p-2 transition-colors md:hidden ${
            isScrolled ? "text-brown hover:text-olive" : "text-white/90 hover:text-sage-light"
          }`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileOpen ? "Chiudi menu" : "Apri menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-white/95 shadow-lg backdrop-blur-sm md:hidden"
            aria-label="Navigazione mobile"
          >
            <div className="flex flex-col gap-2 px-4 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="rounded-lg px-4 py-3 text-base font-medium text-brown transition-colors hover:bg-sage-light/20 hover:text-olive"
                >
                  {link.label}
                </a>
              ))}
              <Button variant="primary" onClick={handleBookingClick} className="mt-2">
                Prenota un Tavolo
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
