"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { easeExpo } from "@/lib/animations";
import { cn } from "@/lib/cn";

interface ClipRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Curtain reveal: the frame unveils with clip-path while the content settles from
 * 1.15× scale. The viewport is observed on an unclipped wrapper, because a fully
 * clipped element never reports as intersecting.
 */
export function ClipReveal({ children, className, delay = 0 }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.3, ease: easeExpo, delay }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: easeExpo, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
