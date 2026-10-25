import { memo } from "react";
import type { BookPage } from "@/types/menu";
import { ChapterPage, ItemsPage } from "./ChapterPages";
import { BackCoverPage, CoverPage } from "./CoverPages";
import { PairingPage, ReservePage } from "./EndMatter";
import { ContentsPage, WelcomePage } from "./FrontMatter";

/** Renders one square page of the book by its content kind. */
export const BookPageView = memo(function BookPageView({ page }: { page: BookPage }) {
  const { content, folio } = page;

  switch (content.kind) {
    case "cover":
      return <CoverPage />;
    case "back-cover":
      return <BackCoverPage />;
    case "welcome":
      return <WelcomePage folio={folio} />;
    case "contents":
      return <ContentsPage folio={folio} />;
    case "chapter":
      return <ChapterPage chapter={content.chapter} folio={folio} />;
    case "items":
      return <ItemsPage chapter={content.chapter} folio={folio} />;
    case "pairing":
      return <PairingPage folio={folio} />;
    case "reserve":
      return <ReservePage />;
  }
});

/** Plain paper — the reverse of a single page on the mobile book. */
export function BlankPage() {
  return <div className="paper size-full" />;
}
