import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  tone?: "red" | "paper";
}

/** Pill toggle — chapter tabs (paper) and seating times (red). */
export function Chip({ selected, tone = "red", disabled, className, children, ...props }: ChipProps) {
  const active = tone === "red" ? "border-red bg-red text-paper" : "border-paper bg-paper text-ink";

  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      className={cn(
        "shrink-0 rounded-full border px-5 py-2.5 font-sans text-[0.8125rem] font-semibold transition-[background-color,border-color,color,transform] duration-300 ease-expo active:scale-95",
        selected ? active : "border-paper/20 text-paper-dim hover:border-paper/60 hover:text-paper",
        disabled && "cursor-not-allowed line-through opacity-40 hover:border-paper/20 hover:text-paper-dim",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
