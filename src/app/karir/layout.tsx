import type { Metadata } from "next";
import { csvToArray, getSeoSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings("karir");
  const keywords = csvToArray(seo.keywords);
  return {
    title: seo.title,
    description: seo.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

export default function KarirLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
