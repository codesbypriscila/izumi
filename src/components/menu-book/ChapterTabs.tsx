"use client";

import { motion } from "motion/react";
import { menuChapters } from "@/data/menu";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";
import type { MenuChapterId } from "@/types/menu";

interface ChapterTabsProps {
  active: MenuChapterId | null;
  onSelect: (id: MenuChapterId) => void;
}

/** Jump-to-chapter pills. The active pill is a shared-layout highlight. */
export function ChapterTabs({ active, onSelect }: ChapterTabsProps) {
  const { dict } = useI18n();

  return (
    <div
      className="-mx-5 flex max-w-[100vw] gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label={dict.book.chaptersAria}
      data-lenis-prevent
    >
      {menuChapters.map((chapter) => {
        const selected = chapter.id === active;
        return (
          <button
            key={chapter.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(chapter.id)}
            className={cn(
              "relative shrink-0 rounded-full border px-5 py-2.5 text-[0.8125rem] font-semibold transition-colors duration-300",
              selected ? "border-paper text-ink" : "border-paper/20 text-paper-dim hover:border-paper/60 hover:text-paper",
            )}
          >
            {selected && (
              <motion.span
                layoutId="chapter-pill"
                className="absolute inset-0 rounded-full bg-paper"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative">{dict.chapters[chapter.id].tab}</span>
          </button>
        );
      })}
    </div>
  );
}
