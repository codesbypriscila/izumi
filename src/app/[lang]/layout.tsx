import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Noto_Serif_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { SkipLink } from "@/components/layout/SkipLink";
import { Providers } from "@/components/providers/Providers";
import { site } from "@/data/site";
import { hasLocale, localeTags, locales } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { I18nProvider } from "@/i18n/I18nProvider";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  weight: ["400", "700"],
  variable: "--font-noto-jp",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = dictionaries[lang];

  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: `%s · ${site.name}` },
    description: meta.description,
    keywords: ["omakase", "sushi", "Japanese restaurant", "restaurante japonés", "Ginza", "Tokyo", "IZUMI"],
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])), "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      title: meta.title,
      description: meta.description,
      siteName: site.name,
      locale: localeTags[lang].replace("-", "_"),
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0909",
  colorScheme: "dark",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${cormorant.variable} ${manrope.variable} ${notoSerifJp.variable}`}>
      <body>
        <I18nProvider initialLocale={lang}>
          <SkipLink />
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
