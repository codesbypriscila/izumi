"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";

interface BookControlsProps {
  label: string;
  ratio: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function BookControls({ label, ratio, canPrev, canNext, onPrev, onNext }: BookControlsProps) {
  const { dict } = useI18n();

  return (
    <div className="flex w-full max-w-md items-center justify-between gap-6 sm:w-auto sm:justify-center sm:gap-7">
      <IconButton icon={ArrowLeft} label={dict.book.prev} size="lg" onClick={onPrev} disabled={!canPrev} />
      <div className="flex flex-col items-center gap-2.5">
        <p className="font-display text-[1.0625rem] tracking-[0.12em] text-paper tabular-nums" aria-live="polite">
          {label}
        </p>
        <div className="relative h-0.5 w-36 overflow-hidden bg-line sm:w-56">
          <motion.span
            className="absolute inset-y-0 left-0 w-full origin-left bg-red"
            animate={{ scaleX: Math.max(0.04, ratio) }}
            transition={{ duration: 0.8, ease: easeExpo }}
          />
        </div>
      </div>
      <IconButton icon={ArrowRight} label={dict.book.next} size="lg" onClick={onNext} disabled={!canNext} />
    </div>
  );
}
