import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";

export type SectionId = keyof Dictionary["nav"]["links"];

export type SocialNetwork = "instagram" | "facebook" | "x" | "youtube";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  href: string;
}

export interface GalleryImage {
  id: keyof Dictionary["gallery"]["photos"];
  src: StaticImageData;
}
