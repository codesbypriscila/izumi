import { cn } from "@/lib/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const kanji = { sm: "text-[1.75rem]", md: "text-[2.5rem]", lg: "text-[3.5rem]" } as const;
const word = {
  sm: "font-sans text-[0.6875rem] font-semibold tracking-[0.45em]",
  md: "font-sans text-[0.8125rem] font-semibold tracking-[0.45em]",
  lg: "font-display text-[2.75rem] tracking-[0.22em]",
} as const;

/** 泉 kanji mark + IZUMI logotype. */
export function Logo({ size = "md", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3.5", className)}>
      <span aria-hidden className={cn("font-jp font-bold leading-none text-red", kanji[size])}>
        泉
      </span>
      <span className={cn("leading-none text-paper", word[size])}>IZUMI</span>
    </span>
  );
}
