import type { Metadata } from "next";
import "./globals.css";
import {
  buildThemeCss,
  csvToArray,
  getGlobalSeo,
  getThemeSettings,
} from "@/lib/site-settings";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sidarmamajun.com";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getGlobalSeo();

  const canonical = seo.canonical?.trim() || BASE_URL;
  const ogImage = seo.ogImage?.trim() || "/og-image.png";
  const keywords = csvToArray(seo.keywords);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: seo.title,
      template: seo.titleTemplate || "%s | CV. SIDARMA MAJUN",
    },
    description: seo.description,
    keywords,
    authors: [{ name: "CV. SIDARMA MAJUN" }],
    creator: "CV. SIDARMA MAJUN",
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: BASE_URL,
      siteName: "CV. SIDARMA MAJUN",
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "CV. SIDARMA MAJUN" }],
    },
    twitter: {
      card: "summary_large_image",
      site: seo.twitterHandle || undefined,
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: { canonical },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tokens = await getThemeSettings();
  const themeCss = buildThemeCss(tokens);
  const seo = await getGlobalSeo();
  const themeColor = seo.themeColor?.trim();

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {themeColor ? <meta name="theme-color" content={themeColor} /> : null}
      </head>
      <body suppressHydrationWarning className="min-h-screen font-sans flex flex-col">
        {/* Dynamic theme tokens — override Tailwind v4 CSS variables.
            Diletakkan di awal <body> dengan suppressHydrationWarning agar
            tidak konflik dengan browser extension yang menyuntikkan style ke <head>. */}
        <style
          id="majun-dynamic-theme"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
        {children}
      </body>
    </html>
  );
}
