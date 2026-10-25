"use client";

import { Menu as MenuIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo, heroTimeline } from "@/lib/animations";
import { cn } from "@/lib/cn";
import type { SectionId } from "@/types/site";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { dict } = useI18n();
  const { scrolled, hidden } = useScrollDirection(80);
  const active = useActiveSection(navLinks);
  const scrollTo = useScrollTo();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: SectionId) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: hidden && !menuOpen ? -120 : 0 }}
        transition={{ duration: 0.8, ease: easeExpo, opacity: { duration: 1, delay: heroTimeline.ui - 0.2 } }}
      >
        <nav
          aria-label={dict.nav.main}
          className={cn(
            "flex w-full items-center justify-between transition-[max-width,padding,background-color,border-color,box-shadow] duration-700 ease-expo",
            "rounded-full border",
            scrolled
              ? "max-w-[1040px] border-paper/10 bg-ink-2/75 py-2 pl-5 pr-2 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl"
              : "max-w-[1440px] border-transparent bg-transparent px-2 py-3 md:px-10 md:py-5",
          )}
        >
          <button type="button" onClick={() => go("home")} aria-label={dict.nav.backToTopLogo} className="shrink-0">
            <Logo size={scrolled ? "sm" : "md"} className="max-md:hidden" />
            <Logo size="sm" className="md:hidden" />
          </button>

          <ul className="hidden items-center gap-9 lg:flex xl:gap-10">
            {navLinks.map((id) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(id);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative flex flex-col items-center gap-1.5 text-sm tracking-wide transition-colors duration-300",
                      isActive ? "text-paper" : "text-paper-dim hover:text-paper",
                    )}
                  >
                    {dict.nav.links[id]}
                    {/* Hairline draws on hover */}
                    <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-red transition-transform duration-500 ease-expo group-hover:scale-x-100" />
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute -bottom-3 size-1 rounded-full bg-red"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => go("contact")}
              className={cn(
                "group relative flex items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-full border text-sm font-medium transition-all duration-500 ease-expo",
                scrolled
                  ? "border-red bg-red px-5 py-2.5 text-paper hover:bg-red-glow"
                  : "border-paper/40 px-4 py-2 text-paper hover:border-paper md:px-6.5 md:py-3.5",
              )}
            >
              <span aria-hidden className={cn("size-1.5 rounded-full transition-colors", scrolled ? "bg-paper" : "bg-red")} />
              <span className="max-md:hidden">{dict.nav.bookTable}</span>
              <span className="md:hidden">{dict.nav.bookShort}</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-10 place-items-center rounded-full bg-paper/8 text-paper transition-colors hover:bg-paper/15 lg:hidden"
            >
              <MenuIcon aria-hidden className="size-4.5" strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={menuOpen} active={active} onClose={() => setMenuOpen(false)} onNavigate={go} />
    </>
  );
}
