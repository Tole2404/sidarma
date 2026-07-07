import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await prisma.article.findFirst({ where: { slug, isPublished: true } });
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
    article = await prisma.article.findFirst({ where: { slug, isPublished: true } });
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
 
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        {/* Back link */}
        <Link href="/artikel" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-955 dark:hover:text-zinc-100 transition-colors mb-6 sm:mb-8 group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Kembali ke Artikel
        </Link>
 
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3.5 py-0.5 text-[10px] sm:text-xs font-semibold text-primary border border-primary/20">
            <Tag className="h-3 w-3" /> {category}
          </span>
          {publishedAt && (
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-zinc-400">
              <Calendar className="h-3 w-3" />
              {new Date(publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>
 
        {/* Title */}
        <h1 className="mt-4 text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50 leading-[1.2] sm:leading-[1.15]">{title}</h1>
 
        {/* Author details card */}
        <div className="mt-5 flex items-center gap-3 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/35 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white text-xs sm:text-sm font-extrabold shadow-sm">SD</div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-955 dark:text-zinc-50">CV. SIDARMA MAJUN</p>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-medium">Distributor Kain Majun Terpercaya</p>
          </div>
        </div>
 
        {/* Cover Image */}
        {article?.thumbnail && (
          <div className="my-6 sm:my-10 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md bg-zinc-100/50 dark:bg-zinc-900/30 flex items-center justify-center">
            <img src={article.thumbnail} alt={title} className="w-full h-auto max-h-[500px] object-contain" />
          </div>
        )}
 
        {/* Article Body */}
        <div
          className="prose prose-sm sm:prose-base prose-zinc dark:prose-invert mt-6 sm:mt-10 max-w-none prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-p:text-zinc-650 dark:prose-p:text-zinc-300 prose-li:text-zinc-650 dark:prose-li:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: content }}
        />
 
        {/* CTA Button Block */}
        <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-955 p-6 sm:p-12 text-center shadow-xl">
          {/* Ambient glow behind card */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
            <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">Tertarik dengan produk kami?</h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">Dapatkan penawaran harga terbaik kain majun berkualitas langsung dari distributor resmi.</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-950/40 h-9 sm:h-11">
              Chat WhatsApp Sekarang
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
