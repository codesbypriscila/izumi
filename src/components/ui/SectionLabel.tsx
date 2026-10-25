import { cn } from "@/lib/cn";

interface SectionLabelProps {
  index: string;
  label: string;
  className?: string;
  tone?: "muted" | "light";
}

/** "02 —— MENU · お品書き" eyebrow used at the top of every section. */
export function SectionLabel({ index, label, className, tone = "muted" }: SectionLabelProps) {
  return (
    <p className={cn("flex items-center gap-3.5", className)}>
      <span className="label-caps text-red">{index}</span>
      <span aria-hidden className={cn("h-px w-12", tone === "light" ? "bg-paper/30" : "bg-line")} />
      <span className={cn("label-caps font-medium", tone === "light" ? "text-paper-dim" : "text-muted")}>
        {label}
      </span>
    </p>
  );
}
