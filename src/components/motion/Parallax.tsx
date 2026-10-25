"use client";

import { motion, useScroll, useTransform, type HTMLMotionProps } from "motion/react";
import { useRef } from "react";

interface ParallaxProps extends HTMLMotionProps<"div"> {
  /** Max travel in px. Positive values make the layer lag behind the page. */
  distance?: number;
}

/** Translates its content along Y relative to the element's scroll progress. */
export function Parallax({ distance = 80, style, children, ...props }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ ...style, y }} {...props}>
      {children}
    </motion.div>
  );
}
