"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCallback, useState, type ReactNode, type MouseEvent } from "react";

type Card3DProps = {
  children: ReactNode;
  className?: string;
};

export default function Card3D({ children, className = "" }: Card3DProps) {
  const prefersReducedMotion = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Limita rotazione a ±5 gradi
      const rotateXValue = Math.max(-5, Math.min(5, (-mouseY / rect.height) * 10));
      const rotateYValue = Math.max(-5, Math.min(5, (mouseX / rect.width) * 10));

      setRotateX(rotateXValue);
      setRotateY(rotateYValue);
    },
    [prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  // Se l'utente preferisce movimento ridotto, mostra senza effetto 3D
  if (prefersReducedMotion) {
    return (
      <div
        className={`rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`rounded-2xl bg-white shadow-md ${className}`}
      style={{ perspective: 1000 }}
      animate={{
        rotateX,
        rotateY,
        boxShadow:
          rotateX !== 0 || rotateY !== 0
            ? "0 20px 40px rgba(0, 0, 0, 0.12)"
            : "0 4px 6px rgba(0, 0, 0, 0.06)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
