import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { csvToArray, getSeoSettings } from "@/lib/site-settings";
import JualBongkaranClient from "./JualBongkaranClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sidarmamajun.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings("jualBongkaran");
  const keywords = csvToArray(seo.keywords);
  return {
    title: seo.title,
    description: seo.description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: seo.canonical?.trim() || `${BASE_URL}/jual-bongkaran` },
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

async function getLandingData() {
  try {
    const settings = await prisma.landingSetting.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });
    return settings.reduce((acc, s) => {
      if (!acc[s.section]) acc[s.section] = {};
      acc[s.section][s.key] = s.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);
  } catch {
    return {};
  }
}

export default async function JualBongkaranPage() {
  const data = await getLandingData();
  return <JualBongkaranClient data={data} />;
}
