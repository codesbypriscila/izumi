"use client";

import { Check, CircleAlert, type LucideIcon } from "lucide-react";
import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  valid?: boolean;
  icon?: LucideIcon;
}

/**
 * Underlined editorial input. States: default · focus (red label, 2px line grows
 * from the centre) · error · valid.
 */
export function Field({ label, error, valid, icon: Icon, className, id, ...props }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("group/field relative flex flex-col gap-2.5", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "label-caps text-[0.625rem] transition-colors duration-300",
          error ? "text-[#ff6b6b]" : "text-muted group-focus-within/field:text-red-glow",
        )}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "peer w-full border-0 border-b bg-transparent pb-3.5 pr-7 text-base text-paper outline-none placeholder:text-muted/60 [color-scheme:dark] focus-visible:outline-none",
            error ? "border-[#ff6b6b]" : valid ? "border-paper/60" : "border-paper/20",
          )}
          {...props}
        />
        {/* Focus line grows from the centre */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 scale-x-0 bg-red transition-transform duration-500 ease-expo peer-focus:scale-x-100"
        />
        <span aria-hidden className="pointer-events-none absolute right-0 top-0.5 text-muted">
          {error ? (
            <CircleAlert className="size-4 text-[#ff6b6b]" />
          ) : valid ? (
            <Check className="size-4 text-paper" />
          ) : Icon ? (
            <Icon className="size-4" strokeWidth={1.75} />
          ) : null}
        </span>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-[#ff6b6b]">
          {error}
        </p>
      )}
    </div>
  );
}
