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
const ITEMS_PER_PAGE = 6;
 
export default function ArtikelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  useEffect(() => {
    fetch("/api/articles", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data);
          setFiltered(data);
        }
      })
      .catch(() => {});
  }, []);
 
  useEffect(() => {
    let result = articles;
    if (activeCategory !== "Semua") result = result.filter((a) => a.category === activeCategory);
    if (query) result = result.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.excerpt.toLowerCase().includes(query.toLowerCase()));
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((a) => a.publishedAt && new Date(a.publishedAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((a) => a.publishedAt && new Date(a.publishedAt) <= end);
    }
    
    setFiltered(result);
    setCurrentPage(1); // Reset page on filter change
  }, [query, activeCategory, startDate, endDate, articles]);
 
  const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";
 
  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
 
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SiteNavbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-655 dark:text-zinc-300">
            <BookOpen className="h-3 w-3" /> Artikel & Blog
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-white">
            Pusat Edukasi Kain Majun
          </h1>
          <p className="mt-3 text-xs sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Tips, panduan, dan wawasan seputar industri kain majun, cleaning service, dan kebutuhan tekstil industri.
          </p>
        </div>
 
        {/* Search & Filter */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <Input className="pl-9 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white" placeholder="Cari artikel..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          {/* Wrap category chips naturally instead of scroll slider */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors border shrink-0 ${
                  activeCategory === cat 
                    ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-50 dark:text-zinc-955 dark:border-zinc-50" 
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
 
        {/* Date Filter Bar */}
        <div className="mb-6 sm:mb-8 flex flex-row flex-wrap items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-2.5 rounded-xl sm:rounded-2xl shadow-sm text-xs max-w-2xl">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-zinc-500 shrink-0">Dari:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:border-primary focus:outline-none dark:text-white"
            />
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-zinc-500 shrink-0">Sampai:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:border-primary focus:outline-none dark:text-white"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-[10px] font-bold text-red-500 dark:text-red-455 hover:underline ml-auto shrink-0"
            >
              Hapus Filter Tanggal
            </button>
          )}
        </div>
 
        {/* Article Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-400 dark:text-zinc-600">
            <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p className="text-sm font-medium mb-2">Belum ada artikel ditemukan.</p>
            {(query || activeCategory !== "Semua" || startDate || endDate) && (
              <button
                onClick={() => {
                  setActiveCategory("Semua");
                  setQuery("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="mt-1 text-xs font-bold text-primary hover:underline font-mono"
              >
                Reset Pencarian & Filter
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedArticles.map((a, i) => (
                <div key={a.id} className="flex w-full">
                  {/* Desktop/Tablet Card Layout */}
                  <Link href={`/artikel/${a.slug}`}
                    className="hidden sm:flex flex-col w-full rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
                    <div className="mb-4 flex h-40 items-center justify-center overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-750">
                      {a.thumbnail ? (
                        <img src={a.thumbnail} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <BookOpen className="h-10 w-10 text-zinc-300 dark:text-zinc-750" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs rounded-full dark:bg-zinc-800 dark:text-zinc-355">{a.category}</Badge>
                      {a.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-550"><Clock className="h-3 w-3" />{formatDate(a.publishedAt)}</span>
                      )}
                    </div>
                    <h2 className="text-base font-extrabold text-zinc-955 dark:text-zinc-50 group-hover:text-primary transition-colors line-clamp-2 leading-snug">{a.title}</h2>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 flex-1">{a.excerpt}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">
                      Baca selengkapnya <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
 
                  {/* Mobile Card Layout */}
                  <Link href={`/artikel/${a.slug}`}
                    className="flex sm:hidden items-center gap-3 p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm w-full group">
                    {/* Left: Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-750 flex items-center justify-center">
                      {a.thumbnail ? (
                        <img src={a.thumbnail} alt={a.title} className="h-full w-full object-cover" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-zinc-300 dark:text-zinc-700" />
                      )}
                    </div>
                    {/* Right: Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-[8px] px-1.5 py-0.5 rounded-full dark:bg-zinc-850 dark:text-zinc-450">{a.category}</Badge>
                          {a.publishedAt && (
                            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-mono">{formatDate(a.publishedAt)}</span>
                          )}
                        </div>
                        <h2 className="text-xs font-bold text-zinc-955 dark:text-zinc-50 leading-snug line-clamp-2 mt-1 group-hover:text-primary transition-colors">{a.title}</h2>
                        <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-455 line-clamp-1">{a.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-primary">
                        Baca selengkapnya <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
 
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed shadow-sm"
                >
                  Sebelumnya
                </button>
                <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-450">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:cursor-not-allowed shadow-sm"
                >
                  Berikutnya
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
