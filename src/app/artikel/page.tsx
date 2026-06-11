"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumbnail: string | null;
  publishedAt: string | null;
}

const PLACEHOLDER_ARTICLES: Article[] = [
  { id: "1", title: "Mengapa Kain Majun Katun Paling Baik untuk Lap Oli?", slug: "kain-majun-katun-lap-oli", excerpt: "Katun memiliki daya serap 25x lebih tinggi dari serat sintetis. Pelajari mengapa majun katun menjadi pilihan utama industri otomotif dan manufaktur.", category: "Tips Industri", thumbnail: null, publishedAt: "2025-01-15T00:00:00Z" },
  { id: "2", title: "Perbedaan Majun Jahit Sambung vs Majun Lembaran", slug: "majun-jahit-sambung-vs-lembaran", excerpt: "Bingung memilih antara majun jahit sambung atau lembaran? Kami uraikan perbedaan daya serap, harga, dan kecocokan penggunaan untuk kebutuhan bisnis Anda.", category: "Panduan Produk", thumbnail: null, publishedAt: "2025-01-10T00:00:00Z" },
  { id: "3", title: "Cara Merawat dan Mendaur Ulang Kain Majun Bekas Pakai", slug: "cara-daur-ulang-kain-majun", excerpt: "Kain majun bekas tidak harus langsung dibuang. Dengan teknik pencucian yang benar, majun bisa digunakan kembali hingga 5–8 kali dan mengurangi limbah tekstil.", category: "Lingkungan & ESG", thumbnail: null, publishedAt: "2025-01-05T00:00:00Z" },
];

const CATEGORIES = ["Semua", "Tips Industri", "Panduan Produk", "Lingkungan & ESG", "Blog"];

export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [filtered, setFiltered] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) { setArticles(data); setFiltered(data); } })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let result = articles;
    if (activeCategory !== "Semua") result = result.filter((a) => a.category === activeCategory);
    if (query) result = result.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.excerpt.toLowerCase().includes(query.toLowerCase()));
    setFiltered(result);
  }, [query, activeCategory, articles]);

  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SiteNavbar />

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
            <BookOpen className="h-3 w-3" /> Artikel & Blog
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">Pusat Edukasi Kain Majun</h1>
          <p className="mt-4 text-base text-zinc-500 max-w-xl mx-auto">Tips, panduan, dan wawasan seputar industri kain majun, cleaning service, dan kebutuhan tekstil industri.</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input className="pl-9" placeholder="Cari artikel..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors border ${activeCategory === cat ? "bg-zinc-950 text-white border-zinc-950" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>Belum ada artikel ditemukan.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a, i) => (
              <Link key={a.id} href={`/artikel/${a.slug}`}
                className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100">
                  <BookOpen className="h-10 w-10 text-zinc-300" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs rounded-full">{a.category}</Badge>
                  {a.publishedAt && (
                    <span className="flex items-center gap-1 text-xs text-zinc-400"><Clock className="h-3 w-3" />{formatDate(a.publishedAt)}</span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-700 transition-colors line-clamp-2">{a.title}</h2>
                <p className="mt-2 text-sm text-zinc-500 line-clamp-3 flex-1">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-zinc-700 group-hover:gap-2 transition-all">
                  Baca selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
