"use client";

import { ArrowDownRight, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Button } from "@/components/ui/Button";
import { omakase } from "@/data/site";
import { usePointerParallax } from "@/hooks/usePointerParallax";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo, heroTimeline } from "@/lib/animations";
import { HeroComposition } from "./HeroComposition";
import { Wordmark } from "./Wordmark";

const uiIn = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: easeExpo, delay: heroTimeline.ui + delay },
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { dict } = useI18n();
  const t = dict.hero;
  const scrollTo = useScrollTo();
  const pointer = usePointerParallax();
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(exit, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      aria-label={t.aria}
      className="grain relative isolate h-svh min-h-[660px] overflow-hidden bg-ink md:min-h-[720px]"
    >
      {/* Red glow curtain */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_80%,rgb(122_10_28/0.85)_0%,rgb(58_6_16/0.65)_35%,transparent_75%)] max-md:bg-[radial-gradient(110%_55%_at_50%_82%,rgb(122_10_28/0.85)_0%,rgb(58_6_16/0.65)_40%,transparent_80%)]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: easeExpo, delay: heroTimeline.glow }}
      />

      <Wordmark pointerX={pointer.x} exit={exit} />
      <HeroComposition pointer={pointer} exit={exit} />

      {/* Headline */}
      <motion.div
        className="absolute inset-x-5 top-[7.5rem] flex flex-col items-center gap-2.5 text-center md:top-[max(7.25rem,13.5%)]"
        style={{ opacity: contentOpacity }}
      >
        <motion.p
          className="label-caps text-[0.625rem] font-medium tracking-[0.35em] text-muted md:text-[0.6875rem]"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.35em" }}
          transition={{ duration: 1.6, ease: easeExpo, delay: heroTimeline.headline }}
        >
          {t.eyebrow[0]} <span className="text-red">·</span> <span className="max-md:hidden">{t.eyebrow[1]} <span className="text-red">·</span> </span>{t.eyebrow[2]}
        </motion.p>
        <MaskText
          as="h1"
          trigger="mount"
          delay={heroTimeline.headline + 0.1}
          lines={t.headline}
          className="font-display text-[2.25rem] italic leading-[1.05] text-paper md:text-[2.875rem]"
        />
      </motion.div>

      {/* Left note */}
      <motion.div {...uiIn(0)} className="absolute bottom-[15%] left-16 hidden w-64 flex-col gap-4 xl:flex">
        <span aria-hidden className="h-px w-10 bg-red" />
        <p className="font-display text-[1.625rem] leading-[1.1] text-paper">
          {t.mastersTitle[0]}
          <br />
          {t.mastersTitle[1]}
        </p>
        <button
          type="button"
          onClick={() => scrollTo("about")}
          className="group flex w-fit items-center gap-3 text-[0.8125rem] text-paper-dim transition-colors hover:text-paper"
        >
          {t.ourStory}
          <span className="grid size-[34px] place-items-center rounded-full border border-paper/35 transition-[background-color,border-color] duration-300 group-hover:border-red group-hover:bg-red">
            <ArrowRight aria-hidden className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </button>
      </motion.div>

      {/* Right note */}
      <motion.div {...uiIn(0.1)} className="absolute bottom-[16%] right-16 hidden w-60 flex-col gap-3.5 xl:flex">
        <p className="font-display text-[4rem] leading-[0.9] text-red-glow">{omakase.courses}</p>
        <p className="text-[0.8125rem] leading-relaxed text-paper-dim">
          {t.coursesCaption[0]}
          <br />
          {t.coursesCaption[1]}
        </p>
      </motion.div>

      {/* Vertical Japanese line */}
      <motion.div {...uiIn(0.2)} className="absolute left-24 top-[24%] hidden flex-col items-center gap-4.5 xl:flex" aria-hidden>
        <span className="font-jp text-base leading-[1.7] text-muted [writing-mode:vertical-rl]">源から一貫</span>
        <span className="h-20 w-px bg-line" />
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        {...uiIn(0.3)}
        type="button"
        onClick={() => scrollTo("about")}
        className="absolute right-[4.5rem] top-[33%] hidden flex-col items-center gap-3.5 xl:flex"
        aria-label={t.scrollAria}
      >
        <span className="label-caps text-[0.625rem] font-medium text-muted [writing-mode:vertical-rl]">{t.scroll}</span>
        <span className="relative h-24 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-red to-transparent"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
          />
        </span>
      </motion.button>

      {/* CTA */}
      <motion.div {...uiIn(0.15)} className="absolute inset-x-0 bottom-[12%] flex justify-center md:bottom-[6.5%]">
        <Button icon={ArrowDownRight} onClick={() => scrollTo("menu")}>
          {t.cta}
        </Button>
      </motion.div>
    </section>
  );
}
