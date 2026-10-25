"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { CountUp } from "@/components/motion/CountUp";
import { MaskText } from "@/components/motion/MaskText";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { aboutStats, principles } from "@/data/about";
import { images } from "@/data/images";
import { useI18n } from "@/i18n/I18nProvider";
import { fadeUp } from "@/lib/animations";

export function About() {
  const { dict } = useI18n();
  const t = dict.about;

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-ink py-24 md:py-40">
      {/* Watermark kanji */}
      <Parallax distance={120} aria-hidden className="pointer-events-none absolute -left-16 -top-10 select-none">
        <span className="font-jp text-[clamp(22rem,57vw,51rem)] font-bold leading-none text-white/[0.025]">泉</span>
      </Parallax>

      <div className="relative mx-auto grid max-w-[1200px] gap-16 px-5 md:px-10 lg:grid-cols-2 lg:gap-14 xl:grid-cols-[minmax(0,520px)_1fr] xl:px-0">
        {/* Story column sits above the photographs so they never cover the copy */}
        {/* Story */}
        <div className="relative z-10 flex flex-col gap-7 md:gap-9 lg:pt-10">
          <Reveal>
            <SectionLabel index="01" label={t.label} />
          </Reveal>
          <MaskText
            id="about-title"
            lines={t.title}
            className="font-display text-[2.75rem] leading-none text-paper xs:text-[2.875rem] md:text-[4.25rem] md:leading-[0.98] xl:text-[4.75rem]"
          />
          <Reveal delay={0.1}>
            <p className="text-base leading-[1.7] text-paper-dim md:text-[1.0625rem]">
              {t.lead}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[0.9375rem] leading-[1.75] text-muted">
              {t.body}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <dl className="grid grid-cols-3 border-t border-line pt-7">
              {aboutStats.map((stat) => (
                <div key={stat.id} className="flex flex-col-reverse gap-1.5">
                  <dt className="text-[0.6875rem] tracking-wide text-muted md:text-xs">{t.stats[stat.id].label}</dt>
                  <dd className="font-display text-4xl leading-none text-paper md:text-5xl">
                    <CountUp to={stat.value} suffix={t.stats[stat.id].suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Photograph + floating nigiri cut-out — two parallax speeds */}
        <div className="relative h-[480px] sm:h-[640px] lg:h-[860px]">
          <Parallax distance={50} className="absolute right-0 top-0 h-[400px] w-[86%] sm:h-[560px] lg:h-[640px] lg:w-full xl:h-[700px] xl:w-[560px]">
            <div className="relative size-full overflow-hidden">
              <Image
                src={images.interiorMoss}
                alt={t.chefAlt}
                fill
                quality={90}
                sizes="(min-width: 1024px) 560px, 86vw"
                className="object-cover object-[68%_50%]"
                placeholder="blur"
              />
              <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </Parallax>
          <Parallax
            distance={-90}
            className="pointer-events-none absolute bottom-0 left-0 w-[68%] sm:w-[52%] lg:bottom-auto lg:left-0 lg:top-[500px] lg:w-[300px] xl:-left-8 xl:top-[560px] xl:w-[380px]"
          >
            {/* Soft red glow + contact shadow give the cut-out depth */}
            <div aria-hidden className="absolute inset-x-[8%] bottom-[-4%] h-[38%] rounded-[50%] bg-red-deep/50 blur-3xl" />
            <div aria-hidden className="absolute inset-x-[14%] bottom-[2%] h-[10%] rounded-[50%] bg-black/80 blur-lg" />
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            >
              <Image
                src={images.aboutNigiri}
                alt={t.nigiriAlt}
                quality={95}
                sizes="(min-width: 1024px) 380px, 68vw"
                className="relative h-auto w-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.7)]"
              />
            </motion.div>
          </Parallax>
          <Reveal delay={0.2} className="absolute bottom-0 right-0 hidden flex-col items-end gap-1.5 text-right lg:bottom-[40px] lg:right-0 lg:flex">
            <p className="label-caps text-paper">{t.chefName}</p>
            <p className="text-[0.8125rem] text-muted">{t.chefRole}</p>
          </Reveal>
        </div>
      </div>

      {/* Philosophy */}
      <ul className="relative mx-auto mt-20 grid max-w-[1200px] gap-0 px-5 md:mt-16 md:px-10 lg:grid-cols-3 lg:gap-10 xl:px-0">
        {principles.map((p, i) => (
          <motion.li
            key={p.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            custom={i * 0.12}
            className="flex items-center gap-4 border-t border-line py-5 lg:items-start lg:gap-5 lg:pt-6"
          >
              <span className="w-14 shrink-0 font-jp text-xl text-red md:w-auto md:text-[1.75rem]">{p.jp}</span>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <h3 className="font-display text-[1.375rem] italic text-paper md:text-2xl">
                  <span className="max-lg:hidden">{p.numeral} · </span>
                  {p.title}
                </h3>
                <p className="text-[0.8125rem] leading-relaxed text-muted md:text-sm">{t.principles[p.id]}</p>
              </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
