import type { Transition, Variants } from "motion/react";

/** "Expo-out" — the signature easing of the site. */
export const easeExpo = [0.22, 1, 0.36, 1] as const;
/** Symmetric ease for page turns and slow, deliberate moves. */
export const easeSilk = [0.65, 0, 0.35, 1] as const;

export const transitions = {
  reveal: { duration: 1.1, ease: easeExpo },
  quick: { duration: 0.45, ease: easeExpo },
  spring: { type: "spring", stiffness: 120, damping: 18 },
} satisfies Record<string, Transition>;

/** Timeline of the hero entrance, in seconds (see Motion Storyboard · A). */
export const heroTimeline = {
  glow: 0,
  headline: 0.3,
  wordmark: 0.6,
  plate: 0.9,
  chopsticks: 1.4,
  ui: 1.9,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...transitions.reveal, delay },
  }),
};

export const staggerChildren = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const maskLine: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: transitions.reveal },
};
