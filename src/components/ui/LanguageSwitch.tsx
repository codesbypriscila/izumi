"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { locales } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/cn";

/** EN | ES segmented toggle with a sliding highlight. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, dict, setLocale } = useI18n();
  const layoutId = useId();

  return (
    <div
      role="group"
      aria-label={dict.common.language}
      className={cn("relative flex items-center rounded-full border border-paper/20 p-0.5", className)}
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={active}
            aria-label={active ? undefined : dict.common.switchTo}
            onClick={() => !active && setLocale(l)}
            className={cn(
              "relative h-7 w-9 rounded-full text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
              active ? "text-ink" : "text-paper-dim hover:text-paper",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-paper"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <span className="relative">{l}</span>
          </button>
        );
      })}
    </div>
  );
}
