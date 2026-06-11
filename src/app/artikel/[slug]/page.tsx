import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await prisma.article.findUnique({ where: { slug, isPublished: true } });
    if (!article) return { title: "Artikel Tidak Ditemukan" };
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: "article",
        publishedTime: article.publishedAt?.toISOString(),
      },
    };
  } catch {
    return { title: "Artikel" };
  }
}

const PLACEHOLDER_ARTICLES: Record<string, { title: string; category: string; publishedAt: string; content: string; excerpt: string }> = {
  "kain-majun-katun-lap-oli": {
    title: "Mengapa Kain Majun Katun Paling Baik untuk Lap Oli?",
    category: "Tips Industri",
    publishedAt: "2025-01-15T00:00:00Z",
    excerpt: "Katun memiliki daya serap 25x lebih tinggi dari serat sintetis.",
    content: `<h2>Mengapa Katun Unggul untuk Menyerap Oli?</h2>
<p>Serat katun (kapas) memiliki struktur mikro yang sangat porous — penuh dengan rongga kecil yang mampu menyerap cairan 25 kali lebih efektif dibandingkan serat sintetis seperti polyester atau nilon.</p>
<p>Ketika majun katun digunakan untuk membersihkan oli atau pelumas mesin, serat-seratnya secara aktif menarik dan menjebak cairan di dalam strukturnya. Hasilnya, permukaan yang dibersihkan menjadi benar-benar kering tanpa smearing (noda sisa).</p>
<h2>Perbandingan Daya Serap</h2>
<ul>
<li><strong>Katun (Cotton)</strong>: Daya serap 800–1200% dari beratnya sendiri</li>
<li><strong>Polyester</strong>: Daya serap 100–200% dari beratnya sendiri</li>
<li><strong>Rayon/Viscose</strong>: Daya serap 400–600%, tapi mudah sobek saat basah</li>
</ul>
<h2>Cocok untuk Industri Apa?</h2>
<p>Majun katun putih atau warna sangat direkomendasikan untuk bengkel otomotif, pabrik manufaktur, perawatan mesin kapal, dan fasilitas produksi yang berurusan dengan oli, pelumas, dan cairan mesin.</p>`,
  },
};

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  let article = null;
  try {
    article = await prisma.article.findUnique({ where: { slug, isPublished: true } });
  } catch {}

  // Fallback to placeholder
  const placeholder = PLACEHOLDER_ARTICLES[slug];
  if (!article && !placeholder) notFound();

  const title = article?.title ?? placeholder?.title ?? "";
  const category = article?.category ?? placeholder?.category ?? "";
  const publishedAt = article?.publishedAt ? article.publishedAt.toISOString() : placeholder?.publishedAt ?? null;
  const content = article?.content ?? placeholder?.content ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: publishedAt,
    author: { "@type": "Organization", name: "CV. SIDARMA MAJUN" },
    publisher: { "@type": "Organization", name: "CV. SIDARMA MAJUN" },
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteNavbar />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            <Tag className="h-3 w-3" /> {category}
          </span>
          {publishedAt && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="h-3 w-3" />
              {new Date(publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl leading-tight">{title}</h1>

        <div className="mt-4 flex items-center gap-2 border-t border-b border-zinc-200/60 py-4">
          <div className="h-8 w-8 rounded-full bg-zinc-950 flex items-center justify-center text-white text-xs font-bold">SD</div>
          <div>
            <p className="text-sm font-medium text-zinc-950">CV. SIDARMA MAJUN</p>
            <p className="text-xs text-zinc-400">Distributor Kain Majun Terpercaya</p>
          </div>
        </div>

        <div
          className="prose prose-zinc mt-8 max-w-none prose-headings:font-semibold prose-h2:text-xl prose-p:text-zinc-600 prose-li:text-zinc-600"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-zinc-950">Tertarik dengan produk kami?</p>
          <p className="mt-1 text-sm text-zinc-500">Dapatkan penawaran harga terbaik kain majun langsung dari distributor.</p>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
            Chat WhatsApp Sekarang
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
