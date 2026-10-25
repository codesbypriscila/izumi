import { ArrowRight, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon | null;
  /** Small red dot before the label (ghost "Book a Table" style). */
  dot?: boolean;
  children: ReactNode;
}

const base =
  "group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden rounded-full font-sans font-semibold tracking-wide transition-[transform,box-shadow,background-color,border-color] duration-500 ease-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-70";

const variants: Record<Variant, string> = {
  primary:
    "bg-red text-paper shadow-[0_16px_40px_-12px_rgb(200_16_46/0.6)] hover:shadow-[0_18px_48px_-10px_rgb(226_52_63/0.75)]",
  ghost: "border border-paper/40 text-paper hover:border-paper/80",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[0.8125rem]",
  lg: "px-8 py-4.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "lg",
  icon: Icon = ArrowRight,
  dot = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {/* Hover fill sweep */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -translate-x-[101%] rounded-full transition-transform duration-700 ease-expo group-hover:translate-x-0",
          variant === "primary" ? "bg-red-glow" : "bg-paper/10",
        )}
      />
      {dot && <span aria-hidden className="relative size-1.5 rounded-full bg-red" />}
      <span className="relative">{children}</span>
      {Icon && (
        <Icon
          aria-hidden
          className="relative size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}
