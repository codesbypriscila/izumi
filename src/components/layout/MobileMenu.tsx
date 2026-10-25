"use client";

import { X } from "lucide-react";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact, navLinks, socials } from "@/data/site";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { SectionId } from "@/types/site";

interface MobileMenuProps {
  open: boolean;
  active: SectionId;
  onClose: () => void;
  onNavigate: (id: SectionId) => void;
}

/** Full-screen overlay that expands as a circle from the burger button. */
export function MobileMenu({ open, active, onClose, onNavigate }: MobileMenuProps) {
  const { dict } = useI18n();
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, lenis, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.dialog}
          className="fixed inset-0 z-[60] flex flex-col bg-ink bg-[radial-gradient(90%_60%_at_100%_100%,rgb(122_10_28/0.7),transparent_70%)] px-6 pb-10 pt-6 lg:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.6rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 2.75rem) 2.6rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 2.75rem) 2.6rem)" }}
          transition={{ duration: 0.8, ease: easeExpo }}
        >
          <div className="flex items-center justify-between">
            <span aria-hidden className="font-jp text-[1.75rem] font-bold text-red">
              泉
            </span>
            <div className="flex items-center gap-3">
              <LanguageSwitch />
              <button
                type="button"
                onClick={onClose}
                aria-label={dict.nav.closeMenu}
                autoFocus
                className="grid size-10 place-items-center rounded-full bg-paper/10 text-paper"
              >
                <X aria-hidden className="size-4.5" />
              </button>
            </div>
          </div>

          <nav aria-label={dict.nav.mobile} className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col gap-3">
              {navLinks.map((id, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.7, ease: easeExpo, delay: 0.15 + i * 0.06 }}
                >
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(id);
                    }}
                    className="flex items-end gap-4"
                  >
                    <span className="pb-2 text-[0.6875rem] text-red">{String(i + 1).padStart(2, "0")}</span>
                    <span className={cn("font-display text-[3.25rem] leading-none", active === id ? "italic text-red-glow" : "text-paper")}>
                      {dict.nav.links[id]}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <motion.div
            className="flex flex-col gap-5 border-t border-paper/15 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-paper-dim">
              {contact.addressShort}
              <br />
              {dict.contact.hoursShort}
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.network}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-paper/25 text-paper"
                >
                  <SocialIcon network={s.network} className="size-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
