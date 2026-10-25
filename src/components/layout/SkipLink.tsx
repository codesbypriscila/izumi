"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function SkipLink() {
  const { dict } = useI18n();

  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-100 -translate-y-24 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
    >
      {dict.common.skip}
    </a>
  );
}
