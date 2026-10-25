"use client";

import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "motion/react";
import { useEffect } from "react";

/**
 * Normalised pointer position (−0.5 … 0.5 on each axis), smoothed with a spring.
 * Stays at 0 on touch devices and with reduced motion.
 */
export function usePointerParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY, reduceMotion]);

  return { x, y };
}
