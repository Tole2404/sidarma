import type { Metadata } from "next";
import LandingClient from "./LandingClient";
import { csvToArray, getSeoSettings, getAllSettings } from "@/lib/site-settings";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sidarmamajun.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings("home");
  const canonical = seo.canonical?.trim() || BASE_URL;
  const keywords = csvToArray(seo.keywords);
  return {
    title: seo.title,
    description: seo.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical },
    openGraph: seo.ogTitle || seo.ogImage
      ? {
          title: seo.ogTitle || seo.title,
          description: seo.ogDescription || seo.description,
          images: seo.ogImage ? [seo.ogImage] : undefined,
        }
      : undefined,
  };
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "CV. SIDARMA MAJUN",
  description:
    "Distributor dan supplier kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, dan cleaning service.",
  url: BASE_URL,
  telephone: "+6281234567890",
  email: "sidarmamajun@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Industri Maju No. 18",
    addressLocality: "Bandung",
    addressRegion: "Jawa Barat",
    postalCode: "40000",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-6.9174639",
    longitude: "107.6191228",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "08:00", closes: "14:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "00:00", closes: "00:00" },
  ],
  sameAs: [
    "https://instagram.com/sidarmamajun",
    "https://facebook.com/sidarmamajun",
    "https://wa.me/6281234567890",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Katalog Kain Majun",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kain Majun Putih Lembaran", description: "Kain lap putih tanpa sambungan jahit, daya serap tinggi." } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kain Majun Jahit Sambung", description: "Perca dijahit memanjang, ekonomis dan berdaya serap optimal." } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Kain Majun Jahit Tumpuk", description: "Perca berlapis tebal, ideal untuk oli dan kotoran berat." } },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LandingPage() {
  const data = await getAllSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <LandingClient data={data} />
    </>
  );
}