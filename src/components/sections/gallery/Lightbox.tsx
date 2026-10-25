"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import { useEffect } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";
import type { GalleryImage } from "@/types/site";

interface LightboxProps {
  items: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const lenis = useLenis();
  const { dict } = useI18n();
  const t = dict.gallery;
  const item = index === null ? null : items[index];
  const open = item !== null && item !== undefined;

  useEffect(() => {
    if (!open || index === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, index, items.length, lenis, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t.photos[item.id].title}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-ink/95 p-5 backdrop-blur-md md:p-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.div
            layoutId={`gallery-${item.id}`}
            className="relative aspect-[3/2] w-full max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.7, ease: easeExpo }}
          >
            <Image src={item.src} alt={t.photos[item.id].alt} fill quality={90} sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" placeholder="blur" />
          </motion.div>
          <div className="flex w-full max-w-5xl items-center justify-between gap-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <p className="label-caps text-red-glow">{t.photos[item.id].kicker}</p>
              <p className="font-display text-2xl italic text-paper md:text-3xl">{t.photos[item.id].title}</p>
            </div>
            <div className="flex gap-2.5">
              <IconButton icon={ArrowLeft} label={t.prev} onClick={() => onNavigate((index - 1 + items.length) % items.length)} />
              <IconButton icon={ArrowRight} label={t.next} onClick={() => onNavigate((index + 1) % items.length)} />
              <IconButton icon={X} label={t.close} onClick={onClose} autoFocus />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
