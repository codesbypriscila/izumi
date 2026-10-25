import type { StaticImageData } from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";

export type MenuChapterId = keyof Dictionary["chapters"];
export type MenuItemId = keyof Dictionary["items"];

/** Language-agnostic dish data; name and description live in the dictionaries. */
export interface MenuItem {
  id: MenuItemId;
  /** Japanese name, rendered in the accent typeface. */
  jp: string;
  price: string;
  image: StaticImageData;
}

export interface MenuChapter {
  id: MenuChapterId;
  /** Roman numeral shown on the chapter page, e.g. "I". */
  numeral: string;
  jp: string;
  cover: StaticImageData;
  items: MenuItem[];
}

/** A single 1:1 page of the menu book. */
export type BookPageContent =
  | { kind: "cover" }
  | { kind: "back-cover" }
  | { kind: "welcome" }
  | { kind: "contents" }
  | { kind: "chapter"; chapter: MenuChapter }
  | { kind: "items"; chapter: MenuChapter }
  | { kind: "pairing" }
  | { kind: "reserve" };

export interface BookPage {
  id: string;
  content: BookPageContent;
  /** Printed page number; undefined for covers. */
  folio?: number;
}
