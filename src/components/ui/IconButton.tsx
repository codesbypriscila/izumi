import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "size-8", md: "size-11", lg: "size-13" } as const;
const iconSizes = { sm: "size-3", md: "size-4", lg: "size-4.5" } as const;

/** Circular outlined button (book arrows, stepper, social). */
export function IconButton({ icon: Icon, label, size = "md", className, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper transition-[background-color,border-color,transform,opacity] duration-300 ease-expo hover:border-paper/70 hover:bg-paper/5 active:scale-95 disabled:pointer-events-none disabled:opacity-30",
        sizes[size],
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className={iconSizes[size]} strokeWidth={1.75} />
    </button>
  );
}
