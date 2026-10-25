"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { images } from "@/data/images";
import { easeExpo, heroTimeline } from "@/lib/animations";
import { Chopsticks } from "./Chopsticks";

interface HeroCompositionProps {
  /** Spring-smoothed pointer position, −0.5 … 0.5. */
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  /** Hero scroll-out progress, 0 … 1. */
  exit: MotionValue<number>;
}

/**
 * Plate + chopsticks + nigiri, authored on an 840 × 760 box (design/izumi.pen)
 * whose width scales with the viewport. Every layer has three wrappers:
 * parallax (pointer + scroll) → entrance → idle float.
 */
export function HeroComposition({ pointer, exit }: HeroCompositionProps) {
  const plateX = useTransform(pointer.x, (v) => v * 14);
  const plateY = useTransform(() => pointer.y.get() * 8 + exit.get() * 140);
  const sticksX = useTransform(pointer.x, (v) => v * 26);
  const sticksY = useTransform(() => pointer.y.get() * 14 + exit.get() * 60);
  const sticksRotate = useTransform(exit, [0, 1], [0, 6]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[47%] aspect-[840/760] w-[120vw] -translate-x-1/2 md:top-[46%] md:w-[min(80vw,62svh)] lg:top-[44.4%] lg:w-[min(58vw,93svh,840px)]"
      aria-hidden
    >
      {/* Plate — rises from below the viewport */}
      <motion.div className="absolute left-0 top-[15.79%] w-full" style={{ x: plateX, y: plateY }}>
        <motion.div
          initial={{ y: "75%", rotate: -10, opacity: 0 }}
          animate={{ y: "0%", rotate: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: easeExpo, delay: heroTimeline.plate, opacity: { duration: 0.6, delay: heroTimeline.plate } }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: heroTimeline.plate + 1.5 }}
          >
            <Image src={images.heroPlate} alt="" priority quality={95} sizes="(min-width: 768px) 58vw, 120vw" className="h-auto w-full" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Chopsticks lifting the nigiri — slide up along their own axis */}
      <motion.div
        className="absolute inset-0 origin-[75%_100%]"
        style={{ x: sticksX, y: sticksY, rotate: sticksRotate }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ x: "24%", y: "78%", opacity: 0 }}
          animate={{ x: "0%", y: "0%", opacity: 1 }}
          transition={{ duration: 1.4, ease: easeExpo, delay: heroTimeline.chopsticks, opacity: { duration: 0.4, delay: heroTimeline.chopsticks } }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{ y: [0, -5, 0], rotate: [0, -0.4, 0] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: heroTimeline.chopsticks + 1.6 }}
          >
            <Chopsticks className="absolute inset-0 size-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]" />

            {/* Soft contact shadow under the fish */}
            <motion.div
              className="absolute left-[30.95%] top-[18.42%] h-[5.3%] w-[38.1%] rounded-[50%] bg-black/70 blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: heroTimeline.chopsticks + 0.9 }}
            />

            {/* Nigiri — tiny settle as the chopsticks stop */}
            <motion.div
              className="absolute left-[26.19%] top-0 w-[47.62%]"
              initial={{ y: -18, rotate: -3 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 9, delay: heroTimeline.chopsticks + 0.95 }}
            >
              <Image
                src={images.heroNigiri}
                alt=""
                priority
                quality={95}
                sizes="(min-width: 768px) 28vw, 58vw"
                className="h-auto w-full drop-shadow-[0_24px_30px_rgb(0_0_0/0.55)]"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
