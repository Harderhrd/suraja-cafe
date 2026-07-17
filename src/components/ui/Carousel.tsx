"use client";

import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type CarouselProps = {
  items: ReactNode[];
  autoPlayInterval?: number;
};

export default function Carousel({
  items,
  autoPlayInterval = 5000,
}: CarouselProps) {
  const prefersReduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragDirection, setDragDirection] = useState<1 | -1>(1);

  const totalItems = items.length;

  // Auto-play con pausa al hover
  useEffect(() => {
    if (isPaused || totalItems <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
      setDragDirection(1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPaused, totalItems, autoPlayInterval]);

  const goTo = useCallback(
    (index: number) => {
      setDragDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const goNext = useCallback(() => {
    setDragDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const goPrev = useCallback(() => {
    setDragDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -50) {
        goNext();
      } else if (info.offset.x > 50) {
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === "ArrowRight") {
        goNext();
      }
    },
    [goNext, goPrev]
  );

  if (totalItems === 0) return null;

  return (
    <div
      className="relative mx-auto w-full max-w-2xl"
      role="region"
      aria-label="Carosello di recensioni"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Card area */}
      <div className="overflow-hidden rounded-2xl">
        {prefersReduced ? (
          <div>{items[currentIndex]}</div>
        ) : (
          <AnimatePresence mode="wait" custom={dragDirection}>
            <motion.div
              key={currentIndex}
              custom={dragDirection}
              variants={{
                enter: (direction: number) => ({
                  x: direction > 0 ? 300 : -300,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (direction: number) => ({
                  x: direction > 0 ? -300 : 300,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="cursor-grab active:cursor-grabbing"
            >
              {items[currentIndex]}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Frecce di navigazione */}
      {totalItems > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-sage/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            aria-label="Recensione precedente"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-brown"
              aria-hidden="true"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2.5 shadow-md transition-colors hover:bg-sage/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            aria-label="Recensione successiva"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-brown"
              aria-hidden="true"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {totalItems > 1 && (
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Seleziona recensione"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Vai alla recensione ${index + 1}`}
              className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
                index === currentIndex
                  ? "w-8 bg-sage"
                  : "w-2.5 bg-sage/30 hover:bg-sage/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
