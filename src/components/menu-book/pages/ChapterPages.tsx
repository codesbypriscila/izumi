import Image from "next/image";
import { cn } from "@/lib/cn";
import type { MenuChapter, MenuItem } from "@/types/menu";
import { useBook } from "./BookContext";
import { PaperPage } from "./PaperPage";

/** Left page of a chapter spread: full-bleed photograph with title. */
export function ChapterPage({ chapter, folio }: { chapter: MenuChapter; folio?: number }) {
  const { compact, dict } = useBook();
  const t = dict.chapters[chapter.id];

  return (
    <div className="relative size-full overflow-hidden bg-ink">
      <Image
        src={chapter.cover}
        alt=""
        fill
        quality={90}
        sizes="(min-width: 1024px) 520px, 90vw"
        className="object-cover"
        placeholder="blur"
        draggable={false}
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-ink/0 from-30% via-ink/45 via-60% to-ink/95" />
      {folio !== undefined && (
        <span className="absolute left-9 top-8 font-display text-base text-paper-dim">{String(folio).padStart(2, "0")}</span>
      )}
      <div className={cn("absolute inset-x-0 bottom-0 flex flex-col gap-1.5", compact ? "p-6" : "p-11")}>
        <p className="label-caps text-red-glow">
          {dict.book.chapter} {chapter.numeral}
        </p>
        <h3 className="flex items-end gap-4">
          <span className={cn("font-display italic leading-none text-paper", compact ? "text-[38px]" : "text-[50px]")}>{t.title}</span>
          <span className={cn("font-jp text-red", compact ? "text-[22px]" : "text-[30px]")}>{chapter.jp}</span>
        </h3>
        <p className={cn("max-w-[90%] leading-relaxed text-paper-dim", compact ? "text-[12px]" : "text-[13px]")}>{t.note}</p>
      </div>
    </div>
  );
}

function MenuItemRow({ item }: { item: MenuItem }) {
  const { compact, dict } = useBook();
  const t = dict.items[item.id];

  return (
    <li className={cn("flex items-start border-b border-ink/12", compact ? "gap-3 pb-2" : "gap-4 pb-3.5")}>
      <span className={cn("relative shrink-0 overflow-hidden rounded-full bg-ink", compact ? "size-10" : "size-13")}>
        <Image src={item.image} alt="" fill sizes="56px" quality={85} className="object-cover" draggable={false} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-2">
          <span className={cn("shrink-0 font-display font-semibold leading-tight text-ink", compact ? "text-[17px]" : "text-[21px]")}>
            {t.name}
          </span>
          <span className="mb-[3px] shrink-0 font-jp text-[10px] text-red">{item.jp}</span>
          <span aria-hidden className="mb-[6px] h-px min-w-3 flex-1 bg-ink/20" />
          <span className={cn("shrink-0 font-display font-semibold text-ink", compact ? "text-[17px]" : "text-[20px]")}>
            {item.price}
          </span>
        </div>
        <p className={cn("truncate text-sumi", compact ? "text-[11px]" : "text-[12px] leading-normal")}>{t.description}</p>
      </div>
    </li>
  );
}

/** Right page of a chapter spread: the dishes. */
export function ItemsPage({ chapter, folio }: { chapter: MenuChapter; folio?: number }) {
  const { compact, dict } = useBook();
  const t = dict.chapters[chapter.id];

  return (
    <PaperPage folio={folio} side="right">
      <div className="flex items-center justify-between pb-1.5">
        <p className="label-caps text-[0.625rem] font-bold text-ink">{t.heading}</p>
        <p className="font-display text-[15px] italic text-sumi">{t.unit}</p>
      </div>
      <ul className={cn("flex flex-1 flex-col justify-between", compact ? "gap-1.5 pt-1" : "gap-3 pt-2")}>
        {chapter.items.map((item) => (
          <MenuItemRow key={item.id} item={item} />
        ))}
      </ul>
    </PaperPage>
  );
}
