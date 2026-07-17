"use client";

import { motion } from "motion/react";
import type { ReactNode, MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-sage text-white hover:bg-sage-dark focus-visible:ring-sage",
  secondary: "bg-olive text-white hover:bg-olive/90 focus-visible:ring-olive",
  outline:
    "border-2 border-sage text-sage hover:bg-sage/10 focus-visible:ring-sage",
  ghost:
    "text-sage bg-transparent hover:bg-sage/10 focus-visible:ring-sage",
};

export default function Button({
  children,
  variant = "primary",
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const motionProps = {
    whileHover: disabled ? undefined : { scale: 1.05 },
    whileTap: disabled ? undefined : { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
