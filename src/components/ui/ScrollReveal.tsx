"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right";

type ScrollRevealProps = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
};

const directionVariants: Record<Direction, { initial: Record<string, number>; animate: Record<string, number> }> = {
  up: {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  down: {
    initial: { y: -60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  },
  left: {
    initial: { x: -60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
  right: {
    initial: { x: 60, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variant = directionVariants[direction];

  // Se l'utente preferisce movimento ridotto, mostra il contenuto senza animazione
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={variant.initial}
      whileInView={variant.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
