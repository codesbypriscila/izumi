"use client";

import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "./IconButton";

interface StepperProps {
  label: string;
  addLabel: string;
  removeLabel: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

/** Guests counter: − 2 + with a rolling number. */
export function Stepper({ label, addLabel, removeLabel, value, min = 1, max = 8, onChange }: StepperProps) {
  return (
    <div className="flex flex-col gap-2.5" role="group" aria-label={label}>
      <span className="label-caps text-[0.625rem] text-muted">{label}</span>
      <div className="flex items-center justify-between border-b border-paper/20 pb-2.5">
        <IconButton icon={Minus} label={removeLabel} size="sm" type="button" disabled={value <= min} onClick={() => onChange(value - 1)} />
        <span className="relative h-7 w-8 overflow-hidden text-center font-display text-[1.375rem] leading-7 text-paper" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              className="absolute inset-0"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <IconButton icon={Plus} label={addLabel} size="sm" type="button" disabled={value >= max} onClick={() => onChange(value + 1)} />
      </div>
    </div>
  );
}
