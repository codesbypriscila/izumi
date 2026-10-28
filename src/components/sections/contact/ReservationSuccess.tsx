"use client";

import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { format } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";

interface ReservationSuccessProps {
  open: boolean;
  onClose: () => void;
  name: string;
  email: string;
  /** Pre-formatted "date · seating · guests" line. */
  summary: string;
  reference: string;
}

const subscribe = () => () => {};

/** Confirmation dialog shown after a (simulated) successful reservation. */
export function ReservationSuccess({ open, onClose, name, email, summary, reference }: ReservationSuccessProps) {
  const lenis = useLenis();
  const { dict } = useI18n();
  const t = dict.form.success;
  // Portal target only exists in the browser; render nothing during SSR/hydration.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/85 p-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-success-title"
            className="paper relative flex w-full max-w-md flex-col items-center gap-4 rounded-[4px] px-6 py-12 text-center text-ink md:px-10"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.6, ease: easeExpo }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              title={t.close}
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-sumi transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X aria-hidden className="size-4" strokeWidth={1.75} />
            </button>
            <motion.span
              className="grid size-14 place-items-center rounded-full bg-red text-paper"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.2 }}
            >
              <Check aria-hidden className="size-6" />
            </motion.span>
            <p className="label-caps text-[0.625rem] font-bold text-red">{t.kicker}</p>
            <h3 id="reservation-success-title" className="font-display text-4xl italic">
              {format(t.title, { name })}
            </h3>
            <p className="text-sm leading-relaxed text-sumi">
              {summary}
              <br />
              {format(t.confirmation, { email })}
            </p>
            <p className="label-caps text-[0.625rem] font-bold text-red">
              {t.reference} · {reference}
            </p>
            <Button type="button" size="md" icon={null} onClick={onClose} autoFocus className="mt-2">
              {t.close}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
