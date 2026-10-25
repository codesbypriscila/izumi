export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie that remembers the visitor's explicit language choice. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** BCP 47 tags used for dates, Open Graph and hreflang. */
export const localeTags: Record<Locale, string> = { en: "en-US", es: "es-ES" };
