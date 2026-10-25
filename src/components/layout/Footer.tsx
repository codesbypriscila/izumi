"use client";

import { ArrowUpRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { contact, navLinks, site, socials } from "@/data/site";
import { useScrollTo } from "@/hooks/useScrollTo";
import { format } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import { easeExpo } from "@/lib/animations";

export function Footer() {
  const { dict } = useI18n();
  const t = dict.footer;
  const scrollTo = useScrollTo();
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink px-5 pb-8 pt-16 md:px-10 md:pb-10 md:pt-24 xl:px-[7.5rem]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 md:gap-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <Reveal className="flex flex-col gap-4">
            <Logo size="lg" />
            <p className="font-display text-lg italic text-muted">{format(t.tagline, { year: site.founded })}</p>
          </Reveal>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:gap-24">
            <Reveal delay={0.05}>
              <nav aria-label={dict.nav.footer} className="flex flex-col gap-3.5">
                <p className="label-caps text-[0.625rem] text-red-glow">{t.navigate}</p>
                {navLinks.map((id) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(id);
                    }}
                    className="w-fit text-sm text-paper-dim transition-colors hover:text-paper"
                  >
                    {dict.nav.links[id]}
                  </a>
                ))}
              </nav>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-3.5">
              <p className="label-caps text-[0.625rem] text-red-glow">{t.visit}</p>
              <address className="flex flex-col gap-3.5 text-sm not-italic text-paper-dim">
                <span>{contact.addressShort}</span>
                <span>{dict.contact.hoursShort}</span>
                <a href={contact.phoneHref} className="transition-colors hover:text-paper">
                  {contact.phone}
                </a>
              </address>
            </Reveal>
            <Reveal delay={0.15} className="col-span-2 flex flex-col gap-3.5 md:col-span-1">
              <p className="label-caps text-[0.625rem] text-red-glow">{t.follow}</p>
              <div className="flex gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.network}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid size-[42px] place-items-center rounded-full border border-paper/20 text-paper transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-red hover:bg-red"
                  >
                    <SocialIcon network={s.network} className="size-4" />
                  </a>
                ))}
              </div>
              <form onSubmit={onSubscribe} className="mt-2 flex w-full max-w-[280px] items-center justify-between border-b border-paper/20 py-3 focus-within:border-red">
                <label htmlFor="newsletter" className="sr-only">
                  {t.newsletterLabel}
                </label>
                <input
                  id="newsletter"
                  type="email"
                  required
                  disabled={subscribed}
                  placeholder={subscribed ? t.newsletterThanks : t.newsletterPlaceholder}
                  className="min-w-0 flex-1 bg-transparent text-[0.8125rem] text-paper outline-none placeholder:text-muted"
                />
                <button type="submit" aria-label={t.subscribe} disabled={subscribed} className="text-paper transition-transform hover:-translate-y-0.5 hover:translate-x-0.5">
                  {subscribed ? <Check aria-hidden className="size-4 text-red-glow" /> : <ArrowUpRight aria-hidden className="size-4" />}
                </button>
              </form>
            </Reveal>
          </div>
        </div>

        <motion.p
          aria-hidden
          className="text-gradient-ghost select-none pl-[0.13em] text-center font-display text-[24vw] font-semibold leading-[0.8] tracking-[0.13em] lg:text-[18.75rem]"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: easeExpo }}
        >
          IZUMI
        </motion.p>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">{format(t.copyright, { year: site.founded })}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-xs">
            <LanguageSwitch />
            <a href="#" className="text-muted transition-colors hover:text-paper">
              {t.privacy}
            </a>
            <a href="#" className="text-muted transition-colors hover:text-paper">
              {t.terms}
            </a>
            <button type="button" onClick={() => scrollTo("top")} className="text-paper transition-colors hover:text-red-glow">
              {t.backToTop}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
