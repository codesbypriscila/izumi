"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";
import type { SectionId } from "@/types/site";

/** Smooth-scrolls to a section, using Lenis when available. */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id: SectionId | "top") => {
      const target = id === "top" || id === "home" ? 0 : `#${id}`;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.6, offset: id === "menu" ? -40 : 0 });
        return;
      }
      if (typeof target === "number") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    },
    [lenis],
  );
}
