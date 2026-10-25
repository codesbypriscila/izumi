import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { localeTags, locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [localeTags[l], `${site.url}/${l}`]));

  return locales.map((l) => ({
    url: `${site.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
