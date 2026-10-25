"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/I18nProvider";
import type { MenuChapterId } from "@/types/menu";

export interface BookActions {
  /** Compact = single-page mobile layout (380px base instead of 520px). */
  compact: boolean;
  goToChapter: (id: MenuChapterId) => void;
  reserve: () => void;
}

export const BookContext = createContext<BookActions>({
  compact: false,
  goToChapter: () => {},
  reserve: () => {},
});

/** Book actions plus the active dictionary, for page components. */
export const useBook = (): BookActions & { dict: Dictionary } => ({ ...useContext(BookContext), dict: useI18n().dict });

/** Base (unscaled) edge length of a square page, in px. */
export const PAGE_BASE = { regular: 520, compact: 380 } as const;
