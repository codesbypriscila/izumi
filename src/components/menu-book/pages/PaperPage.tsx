import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useBook } from "./BookContext";

interface PaperPageProps {
  children: ReactNode;
  folio?: number;
  /** Which side of the spread the page sits on — drives the gutter shadow. */
  side: "left" | "right";
  className?: string;
}

/** Cream paper page with gutter shading, fibre texture and a folio row. */
export function PaperPage({ children, folio, side, className }: PaperPageProps) {
  const { compact } = useBook();

  return (
    <div className={cn("paper relative flex size-full flex-col text-ink", compact ? "px-5.5 pb-4 pt-5.5" : "px-11 pb-7 pt-9", className)}>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 w-[14%] from-ink/20 to-transparent",
          side === "right" ? "left-0 bg-linear-to-r" : "right-0 bg-linear-to-l",
        )}
      />
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
      {folio !== undefined && (
        <div className={cn("relative mt-auto flex items-center justify-between pt-2", side === "left" && "flex-row-reverse")}>
          <span aria-hidden className="font-jp text-sm text-red">
            泉
          </span>
          <span className="font-display text-base text-sumi">{String(folio).padStart(2, "0")}</span>
        </div>
      )}
    </div>
  );
}
