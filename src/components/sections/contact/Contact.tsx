"use client";

import { Clock4, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { images } from "@/data/images";
import { contact } from "@/data/site";
import { useI18n } from "@/i18n/I18nProvider";
import { fadeUp } from "@/lib/animations";
import { ReservationForm } from "./ReservationForm";

type InfoKey = "address" | "hours" | "reservations" | "email";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const { dict } = useI18n();
  const t = dict.contact;
  const info: { icon: LucideIcon; key: InfoKey; value: string; href?: string }[] = [
    { icon: MapPin, key: "address", value: contact.address, href: contact.mapsHref },
    { icon: Clock4, key: "hours", value: t.hours },
    { icon: Phone, key: "reservations", value: contact.phone, href: contact.phoneHref },
    { icon: Mail, key: "email", value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative grid bg-ink lg:min-h-[880px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:grid-cols-[560px_minmax(0,1fr)]">
      {/* Info panel over photograph */}
      <div className="relative flex flex-col justify-end gap-8 overflow-hidden px-5 pb-12 pt-56 md:px-16 md:pb-20 lg:px-12 lg:pt-20 xl:px-16">
        <motion.div className="absolute inset-0" style={{ scale: zoom }} aria-hidden>
          <Image src={images.omakaseSpread} alt="" fill quality={85} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" placeholder="blur" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-ink/40 to-ink/95 to-60% lg:to-75%" />

        <div className="relative flex flex-col gap-6 md:gap-10">
          <Reveal>
            <SectionLabel index="04" label={t.label} tone="light" />
          </Reveal>
          <MaskText
            id="contact-title"
            lines={t.title}
            className="font-display text-[2.75rem] leading-none text-paper md:text-[4rem]"
          />
          <ul className="flex flex-col gap-4 md:gap-5">
            {info.map(({ icon: Icon, key, value, href }, i) => (
              <motion.li
                key={key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                custom={0.1 + i * 0.08}
                className="flex items-start gap-4 border-b border-paper/15 pb-4"
              >
                  <Icon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-red-glow" strokeWidth={1.75} />
                  <div className="flex flex-col gap-1">
                    <span className="label-caps text-[0.625rem] text-muted max-md:hidden">{t.info[key]}</span>
                    {href ? (
                      <a href={href} className="text-[0.9375rem] text-paper transition-colors hover:text-red-glow" target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {value}
                      </a>
                    ) : (
                      <span className="text-[0.9375rem] text-paper">{value}</span>
                    )}
                  </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reservation form */}
      <div className="flex flex-col gap-8 bg-ink-2 px-5 py-12 md:px-16 md:py-24 lg:px-12 xl:pl-24 xl:pr-[7.5rem]">
        <Reveal className="flex flex-col gap-2.5">
          <h3 className="font-display text-[1.875rem] italic text-paper md:text-[2.5rem]">{t.formTitle}</h3>
          <p className="text-sm text-muted">{t.formSub}</p>
        </Reveal>
        <Reveal delay={0.1} amount={0.15}>
          <ReservationForm />
        </Reveal>
      </div>
    </section>
  );
}
