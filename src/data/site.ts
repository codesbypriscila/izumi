import type { SectionId, SocialLink } from "@/types/site";

export const site = {
  name: "IZUMI",
  kanji: "泉",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  founded: 2026,
} as const;

/** Section order; labels come from `dict.nav.links`. */
export const navLinks: readonly SectionId[] = ["home", "about", "menu", "gallery", "contact"];

export const contact = {
  address: "1-4-7 Ginza, Chūō · Tokyo 104-0061",
  addressShort: "1-4-7 Ginza, Tokyo",
  phone: "+81 3 5555 0418",
  phoneHref: "tel:+81355550418",
  email: "counter@izumi.jp",
  mapsHref: "https://maps.google.com/?q=Ginza+Tokyo",
} as const;

export const socials: SocialLink[] = [
  { network: "instagram", label: "Instagram", href: "https://instagram.com" },
  { network: "facebook", label: "Facebook", href: "https://facebook.com" },
  { network: "x", label: "X (Twitter)", href: "https://x.com" },
  { network: "youtube", label: "YouTube", href: "https://youtube.com" },
];

export const seatings = [
  { time: "18:00", available: true },
  { time: "20:30", available: true },
  { time: "22:00", available: false },
] as const;

export const omakase = {
  courses: 18,
  price: "$185",
  pairing: "+$90",
} as const;
