import { contact } from "@/data/site";
import { cn } from "@/lib/cn";
import { useBook } from "./BookContext";

const lacquer =
  "bg-[#141111] bg-[linear-gradient(135deg,rgb(255_255_255/0.07)_0%,transparent_45%),radial-gradient(120%_80%_at_80%_100%,rgb(122_10_28/0.35),transparent_60%)]";

export function CoverPage() {
  const { compact, dict } = useBook();

  return (
    <div className={cn("relative flex size-full flex-col items-center justify-center gap-5 text-center", lacquer)}>
      <span aria-hidden className="absolute inset-3 rounded-[2px] border border-red/30" />
      <span aria-hidden className="absolute inset-[18px] rounded-[2px] border border-gold/15" />
      <span aria-hidden className={cn("font-jp font-bold leading-none text-red drop-shadow-[0_8px_30px_rgb(200_16_46/0.45)]", compact ? "text-[88px]" : "text-[120px]")}>
        泉
      </span>
      <span className={cn("font-display tracking-[0.5em] text-paper", compact ? "pl-[0.5em] text-2xl" : "pl-[0.5em] text-[30px]")}>IZUMI</span>
      <span aria-hidden className="h-px w-10 bg-gold" />
      <span className="label-caps font-medium text-muted">{dict.book.coverSubtitle}</span>
      <span className="label-caps absolute bottom-8 text-[0.5625rem] text-paper/40">{dict.book.coverHint}</span>
    </div>
  );
}

export function BackCoverPage() {
  const { dict } = useBook();

  return (
    <div className={cn("relative flex size-full flex-col items-center justify-center gap-4 text-center", lacquer)}>
      <span aria-hidden className="absolute inset-3 rounded-[2px] border border-red/30" />
      <span aria-hidden className="font-jp text-5xl font-bold text-red">
        泉
      </span>
      <span className="font-display text-2xl italic text-paper">{dict.book.backThanks}</span>
      <span className="font-jp text-xs tracking-[0.3em] text-muted">ご馳走様でした</span>
      <span aria-hidden className="h-px w-10 bg-gold" />
      <span className="max-w-[70%] text-xs leading-relaxed text-paper-dim">{contact.address}</span>
    </div>
  );
}
