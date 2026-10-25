"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { fadeUp } from "@/lib/animations";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Portion of the element that must be visible before revealing. */
  amount?: number;
}

/** Fades and lifts its children into place when scrolled into view. */
export function Reveal({ delay = 0, amount = 0.3, children, ...props }: RevealProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      custom={delay}
      {...props}
    >
      {children}
    </motion.div>
  );
}
