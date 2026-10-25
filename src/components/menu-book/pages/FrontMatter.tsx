import { chapterPageIndex, menuChapters } from "@/data/menu";
import { cn } from "@/lib/cn";
import { useBook } from "./BookContext";
import { PaperPage } from "./PaperPage";

export function WelcomePage({ folio }: { folio?: number }) {
  const { compact, dict } = useBook();
  const t = dict.book;

  return (
    <PaperPage folio={folio} side="left">
      <p className="label-caps text-[0.625rem] text-red">{t.welcomeLabel}</p>
      <h3 className={cn("mt-4 font-display leading-[0.95] text-ink", compact ? "text-[34px]" : "text-[48px]")}>
        {t.welcomeTitle[0]}
        <br />
        <em className="text-red">{t.welcomeTitle[1]}</em>
      </h3>
      <p className={cn("mt-5 leading-relaxed text-sumi", compact ? "text-[12px]" : "text-[14px]")}>{t.welcomeText}</p>
      <div className="mt-auto flex items-end justify-between pb-2">
        <div>
          <p className="font-display text-xl italic text-ink">Haruki Sato</p>
          <p className="text-[11px] tracking-wide text-sumi">{t.chefRole}</p>
        </div>
        {/* Hanko seal */}
        <span aria-hidden className="grid size-12 rotate-[-6deg] place-items-center rounded-[3px] border-2 border-red font-jp text-xl font-bold text-red/90">
          泉
        </span>
      </div>
    </PaperPage>
  );
}

export function ContentsPage({ folio }: { folio?: number }) {
  const { compact, dict, goToChapter } = useBook();

  return (
    <PaperPage folio={folio} side="right">
      <div className="flex items-baseline justify-between">
        <p className="label-caps text-[0.625rem] text-ink">{dict.book.contents}</p>
        <p className="font-display text-[15px] italic text-sumi">{dict.book.contentsNote}</p>
      </div>
      <ol className={cn("flex flex-1 flex-col justify-center", compact ? "gap-2.5" : "gap-4")}>
        {menuChapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              type="button"
              data-no-flip
              onClick={() => goToChapter(chapter.id)}
              className="group flex w-full items-baseline gap-3 text-left"
            >
              <span className="w-7 font-display text-sm italic text-red">{chapter.numeral}</span>
              <span className={cn("font-display text-ink transition-colors group-hover:text-red", compact ? "text-[20px]" : "text-[26px]")}>
                {dict.chapters[chapter.id].title}
              </span>
              <span className="font-jp text-[11px] text-red/80">{chapter.jp}</span>
              <span aria-hidden className="mb-1.5 h-px flex-1 border-b border-dotted border-ink/30" />
              <span className="font-display text-base text-sumi">{String(chapterPageIndex[chapter.id]).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ol>
    </PaperPage>
  );
}
