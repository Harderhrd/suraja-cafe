"use client";

import { motion, useReducedMotion } from "motion/react";
import Card3D from "@/components/ui/Card3D";
import type { MenuItem } from "@/types";

const MENU_IMAGES: Record<string, string> = {
  colazioni: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
  pranzi: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  apericena: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
  dolci: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
  bevande: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
};

interface MenuCardsProps {
  items: MenuItem[];
}

export default function MenuCards({ items }: MenuCardsProps) {
  const prefersReduced = useReducedMotion();

  const containerVariants = prefersReduced
    ? { hidden: {}, visible: {} }
    : {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
          },
        },
      };

  const cardVariants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : ({
        hidden: { opacity: 0, y: 60, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: "easeOut",
          },
        },
      } as const);

  return (
    <motion.div
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={cardVariants}>
          <Card3D className="group h-full overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
            {/* Image with hover zoom */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${MENU_IMAGES[item.id]})` }}
                aria-hidden="true"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Category badge */}
              <div className="absolute bottom-3 left-3">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {item.items.length} prodotti
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-olive">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brown-light">
                {item.description}
              </p>

              <ul className="mt-4 space-y-1.5">
                {item.items.map((subItem) => (
                  <li
                    key={subItem}
                    className="flex items-center gap-2 text-sm text-brown transition-colors group-hover:text-olive"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage transition-all duration-300 group-hover:scale-125" aria-hidden="true" />
                    {subItem}
                  </li>
                ))}
              </ul>
            </div>
          </Card3D>
        </motion.div>
      ))}
    </motion.div>
  );
}
