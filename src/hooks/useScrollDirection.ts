"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

interface ScrollState {
  /** True once the page has scrolled past `threshold`. */
  scrolled: boolean;
  /** True while the user scrolls down (used to hide the navbar). */
  hidden: boolean;
}

export function useScrollDirection(threshold = 80): ScrollState {
  const { scrollY } = useScroll();
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false });

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const scrolled = current > threshold;
    const hidden = scrolled && current > previous && current > threshold * 4;
    setState((s) => (s.scrolled === scrolled && s.hidden === hidden ? s : { scrolled, hidden }));
  });

  return state;
}
