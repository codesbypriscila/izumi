"use client";

import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { MenuBook } from "@/components/menu-book/MenuBook";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { omakase } from "@/data/site";
import { format } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";

export function Menu() {
  const { dict } = useI18n();
  const t = dict.menu;

  return (
    <section
      id="menu"
      aria-label={t.aria}
      className="relative overflow-hidden bg-ink bg-[radial-gradient(60%_50%_at_50%_58%,rgb(58_6_16/0.6),transparent_75%)] px-5 py-24 md:px-10 md:py-36"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10 md:gap-14">
        <header className="flex flex-col items-center gap-5 text-center">
          <Reveal>
            <SectionLabel index="02" label={t.label} />
          </Reveal>
          <MaskText lines={[t.title]} className="hidden font-display text-[4.75rem] leading-none text-paper md:block" />
          <MaskText lines={t.titleLines} className="font-display text-[2.875rem] leading-none text-paper md:hidden" />
          <Reveal delay={0.15}>
            <p className="max-w-md text-[0.9375rem] text-muted">{t.sub}</p>
          </Reveal>
        </header>

        <MenuBook />

        <Reveal delay={0.1}>
          <p className="text-center font-display text-lg italic text-paper-dim">
            {format(t.note, { courses: omakase.courses, price: omakase.price })}
            <span className="max-sm:block">
              <span className="max-sm:hidden"> — </span>
              {format(t.pairing, { price: omakase.pairing })}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
