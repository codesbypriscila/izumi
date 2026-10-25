"use client";

import { Maximize2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { MaskText } from "@/components/motion/MaskText";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { gallery } from "@/data/gallery";
import { format } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import type { GalleryImage } from "@/types/site";
import { Lightbox } from "./Lightbox";

/** Grid placement per photo (desktop rows mirror design/izumi.pen). */
const LAYOUT: Record<string, string> = {
  room: "col-span-2 h-60 md:col-span-7 md:row-span-2 md:h-auto",
  platter: "h-[200px] md:col-span-5 md:h-[250px]",
  wagyu: "h-[200px] md:col-span-5 md:h-[250px]",
  plating: "h-[260px] md:col-span-3 md:h-[400px]",
  kaiseki: "h-[260px] md:col-span-6 md:h-[400px]",
  sashimi: "col-span-2 h-60 md:col-span-3 md:h-[400px]",
};

function Tile({ item, index, onOpen }: { item: GalleryImage; index: number; onOpen: (i: number) => void }) {
  const { dict } = useI18n();
  const t = dict.gallery.photos[item.id];

  return (
    <ClipReveal className={cn("group", LAYOUT[item.id])} delay={(index % 3) * 0.12}>
      <motion.button
        type="button"
        layoutId={`gallery-${item.id}`}
        onClick={() => onOpen(index)}
        className="absolute inset-0 block cursor-zoom-in overflow-hidden text-left"
        aria-label={format(dict.gallery.open, { title: t.title })}
      >
        <Image
          src={item.src}
          alt={t.alt}
          fill
          quality={90}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-expo group-hover:scale-[1.06]"
          placeholder="blur"
        />
        {/* Hover state: red scrim + caption */}
        <span
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-transparent from-20% to-red-deep/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="absolute inset-x-6 bottom-5 flex translate-y-3 items-end justify-between opacity-0 transition-[opacity,transform] duration-500 ease-expo group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          <span className="flex flex-col gap-1">
            <span className="label-caps text-[0.625rem] text-paper-dim">{t.kicker}</span>
            <span className="font-display text-2xl italic text-paper">{t.title}</span>
          </span>
          <Maximize2 aria-hidden className="size-4.5 text-paper" strokeWidth={1.75} />
        </span>
      </motion.button>
    </ClipReveal>
  );
}

export function Gallery() {
  const { dict } = useI18n();
  const t = dict.gallery;
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-ink pt-24 md:pt-36">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10 xl:px-0">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <Reveal>
              <SectionLabel index="03" label={t.label} />
            </Reveal>
            <MaskText
              id="gallery-title"
              lines={t.title}
              className="font-display text-[2.875rem] leading-none text-paper md:text-[4.75rem] md:leading-[0.98]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[380px] text-[0.9375rem] leading-[1.7] text-muted">
              {t.aside}
            </p>
          </Reveal>
        </header>

        <div className="mt-12 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-12 md:gap-5">
          {gallery.map((item, i) => (
            <Tile key={item.id} item={item} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <Marquee className="py-14 md:py-20" baseVelocity={-2}>
        {["OMAKASE", "泉", "SUSHI", "鮨", "SAKE", "酒", "IZUMI", "旬"].map((word, i) => (
          <span
            key={i}
            className={cn(
              "px-6 text-[3.5rem] leading-none md:px-12 md:text-[6rem]",
              /[A-Z]/.test(word) ? "font-display italic text-paper/10" : "font-jp text-red",
            )}
          >
            {word}
          </span>
        ))}
      </Marquee>

      <Lightbox items={gallery} index={open} onClose={close} onNavigate={setOpen} />
    </section>
  );
}
