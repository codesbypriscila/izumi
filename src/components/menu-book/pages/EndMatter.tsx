import { ArrowRight } from "lucide-react";
import { omakase } from "@/data/site";
import { cn } from "@/lib/cn";
import { useBook } from "./BookContext";
import { PaperPage } from "./PaperPage";

export function PairingPage({ folio }: { folio?: number }) {
  const { compact, dict } = useBook();
  const t = dict.book;
  const rows = [
    [t.pairingRows.omakase, omakase.price],
    [t.pairingRows.sake, omakase.pairing],
    [t.pairingRows.wine, "+$120"],
    [t.pairingRows.supplement, "+$40"],
  ] as const;

  return (
    <PaperPage folio={folio} side="left">
      <p className="label-caps text-[0.625rem] text-red">{t.pairingLabel}</p>
      <div className="mt-3 flex items-end gap-4">
        <span className={cn("font-display leading-[0.8] text-red", compact ? "text-[72px]" : "text-[104px]")}>{omakase.courses}</span>
        <span className={cn("pb-1 font-display italic leading-tight text-ink", compact ? "text-[20px]" : "text-[26px]")}>
          {t.pairingTitle[0]}
          <br />
          {t.pairingTitle[1]}
        </span>
      </div>
      <ul className={cn("mt-auto flex flex-col", compact ? "gap-2" : "gap-3.5")}>
        {rows.map(([label, price]) => (
          <li key={label} className="flex items-end gap-2 border-b border-ink/12 pb-2">
            <span className={cn("text-ink", compact ? "text-[12px]" : "text-[14px]")}>{label}</span>
            <span aria-hidden className="mb-1 h-px flex-1 border-b border-dotted border-ink/25" />
            <span className="font-display text-lg font-semibold text-ink">{price}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-sumi">{t.pairingFootnote}</p>
    </PaperPage>
  );
}

export function ReservePage() {
  const { compact, dict, reserve } = useBook();
  const t = dict.book;

  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-5 overflow-hidden bg-red-deep bg-[radial-gradient(90%_70%_at_50%_30%,rgb(226_52_63/0.55),transparent_70%)] p-10 text-center">
      <span aria-hidden className="absolute -bottom-16 -right-10 font-jp text-[260px] font-bold leading-none text-ink/15">
        席
      </span>
      <p className="label-caps relative text-paper/70">{t.reserveLabel}</p>
      <p className={cn("relative font-display italic leading-[0.95] text-paper", compact ? "text-[36px]" : "text-[46px]")}>
        {t.reserveTitle[0]}
        <br />
        {t.reserveTitle[1]}
      </p>
      <button
        type="button"
        data-no-flip
        onClick={reserve}
        className="group relative inline-flex items-center gap-3 rounded-full bg-paper px-7 py-3.5 text-[13px] font-semibold text-ink transition-transform duration-300 hover:scale-[1.03] active:scale-95"
      >
        {t.reserveCta}
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
