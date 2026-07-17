"use client";

import { motion, useReducedMotion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

// Unsplash: foto reali di cibo vegano e interni
const GALLERY_WITH_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", alt: "Insalata vegana fresca", aspect: "aspect-[4/3]" },
  { id: 2, src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80", alt: "Piatto vegano colorato", aspect: "aspect-[3/4]" },
  { id: 3, src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80", alt: "Interno del locale accogliente", aspect: "aspect-[4/3]" },
  { id: 4, src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", alt: "Dolci vegani artigianali", aspect: "aspect-[3/4]" },
  { id: 5, src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80", alt: "Colazione vegana", aspect: "aspect-[4/3]" },
  { id: 6, src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", alt: "Piatto vegetale gourmet", aspect: "aspect-[4/3]" },
];

export default function Galleria() {
  const prefersReduced = useReducedMotion();

  const containerVariants = prefersReduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.15,
          },
        },
      };

  const itemVariants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, scale: 0.85, y: 30 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: "easeOut" as const,
          },
        },
      };

  return (
    <section id="galleria" className="bg-cream py-20 px-4">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <SectionHeading
            title="Galleria"
            subtitle="Scorri le immagini per scoprire l'atmosfera unica di Suraja Cafè Vegan."
            centered
          />
        </ScrollReveal>

        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {GALLERY_WITH_IMAGES.map((image) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              className={`group relative overflow-hidden rounded-2xl shadow-md ${image.aspect}`}
            >
              {/* Immagine reale */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${image.src})` }}
                aria-hidden="true"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

              {/* Didascalia */}
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-medium text-white drop-shadow-lg">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
