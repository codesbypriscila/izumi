"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";
import { easeExpo } from "@/lib/animations";
import { cn } from "@/lib/cn";

interface MaskTextProps {
  lines: readonly string[];
  id?: string;
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** "mount" plays immediately (hero); "inView" waits for the viewport. */
  trigger?: "mount" | "inView";
}

/** Each line slides up from behind an invisible mask — editorial headline reveal. */
export function MaskText({
  lines,
  id,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  duration = 1.1,
  trigger = "inView",
}: MaskTextProps) {
  const play =
    trigger === "mount"
      ? { animate: "visible" }
      : { whileInView: "visible", viewport: { once: true, amount: 0.6 } };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      {/* Keyed by its text: a language switch remounts the lines so they re-reveal
          instead of mounting into an animation that already finished (and staying hidden). */}
      <motion.span key={lines.join("|")} aria-hidden className="block" initial="hidden" {...play}>
        {lines.map((line, i) => (
          <span key={line + i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
            <motion.span
              className={cn("block will-change-transform", lineClassName)}
              variants={{
                hidden: { y: "115%", rotate: 2 },
                visible: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration, ease: easeExpo, delay: delay + i * stagger },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
