"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { easeExpo, heroTimeline } from "@/lib/animations";

const LETTERS = ["I", "Z", "U", "M", "I"] as const;

interface WordmarkProps {
  pointerX: MotionValue<number>;
  exit: MotionValue<number>;
}

/** Giant red IZUMI behind the plate. Letters rise and un-blur one by one. */
export function Wordmark({ pointerX, exit }: WordmarkProps) {
  const x = useTransform(pointerX, (v) => v * -16);
  const scale = useTransform(exit, [0, 1], [1, 1.15]);
  const opacity = useTransform(exit, [0, 0.8], [1, 0.15]);

  return (
    <motion.p
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[27.5%] flex select-none justify-center font-display font-semibold leading-[0.82] tracking-[0.06em] text-[27.5vw] md:top-[26.2%] md:text-[min(18.75vw,30svh,270px)]"
      style={{ x, scale, opacity }}
    >
      {LETTERS.map((letter, i) => (
        <motion.span
          key={i}
          className="text-gradient-red inline-block pb-[0.06em]"
          initial={{ y: 60, opacity: 0, filter: "blur(14px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, ease: easeExpo, delay: heroTimeline.wordmark + i * 0.07 }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.p>
  );
}
