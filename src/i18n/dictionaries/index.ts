import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { es } from "./es";

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = { en, es };

/** Replaces `{key}` placeholders: format("Hi {name}", { name: "Aiko" }). */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
}
