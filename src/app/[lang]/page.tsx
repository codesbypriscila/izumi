import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/contact/Contact";
import { Gallery } from "@/components/sections/gallery/Gallery";
import { Hero } from "@/components/sections/hero/Hero";
import { Menu } from "@/components/sections/Menu";
import { contact, site } from "@/data/site";
import { hasLocale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description: dictionaries[lang].meta.description,
    inLanguage: lang,
    servesCuisine: ["Japanese", "Sushi", "Omakase"],
    priceRange: "$$$$",
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "1-4-7 Ginza",
      addressLocality: "Chūō, Tokyo",
      postalCode: "104-0061",
      addressCountry: "JP",
    },
    acceptsReservations: true,
    url: `${site.url}/${lang}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
