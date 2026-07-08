"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, CheckCircle2, ChevronRight, ArrowRight, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface Product {
  name: string;
  category: string;
  desc: string;
  uses: string[];
  image: string;
}

interface KatalogClientProps {
  products: Product[];
  waNumber: string;
  banner: {
    badge: string;
    title: string;
    titleStyle: string;
    description: string;
    bgImage: string;
  };
}

function parseStyleString(styleStr: string): React.CSSProperties {
  const styleObj: Record<string, string> = {};
  if (!styleStr) return styleObj;
  
  styleStr.split(";").forEach((declaration) => {
    const colonIndex = declaration.indexOf(":");
    if (colonIndex === -1) return;
    const property = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();
    if (property && value) {
      // Convert CSS kebab-case properties to camelCase (e.g. font-size -> fontSize)
      const camelProperty = property.replace(/-./g, (c) => c[1].toUpperCase());
      styleObj[camelProperty] = value;
    }
  });
  
  return styleObj;
}

export default function KatalogClient({ products, waNumber, banner }: KatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["Semua", "Kain Majun", "Alat Pelindung"];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uses.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const customTitleStyle = parseStyleString(banner.titleStyle);

  return (
    <div className="min-h-screen bg-zinc-55/40 dark:bg-zinc-950 flex flex-col">
      <SiteNavbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-zinc-900 py-10 sm:py-16 lg:py-20 text-white dark:bg-zinc-950">
        {banner.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${banner.bgImage})` }}
          />
        )}
        <div className={`absolute inset-0 ${banner.bgImage ? "bg-zinc-950/80" : "bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-60"}`} />
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-[10px] sm:text-xs font-semibold text-primary backdrop-blur-sm">
            {banner.badge}
          </span>
          <h1
            className="mt-3 text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-none"
            style={customTitleStyle}
            dangerouslySetInnerHTML={{ __html: banner.title }}
          />
          <p
            className="mt-3 text-xs xs:text-sm sm:text-base text-zinc-300 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: banner.description }}
          />
        </div>
      </section>

      {/* Catalog Search & Filter Controls */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Controls Bar */}
          <div className="mt-2 flex flex-row items-center gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm mb-6 sm:mb-10">
            {/* Search Input */}
            <div className="relative flex-[1.6] sm:flex-1">
              <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Cari kain majun, APD, atau kegunaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all dark:text-white"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative flex-1 sm:min-w-[200px] max-w-[140px] sm:max-w-none">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-7 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Dynamic Grid Results */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-3 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
                return (
                  <div key={p.name} className="flex w-full">
                    {/* Unified responsive card with top spotlight image */}
                    <div className="flex flex-col w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1 group">
                      {/* Image Frame (Spotlight) */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3.5 right-3.5">
                          <span className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-3.5 py-1 text-[10px] sm:text-xs font-semibold text-white shadow-sm border border-emerald-400/20">
                            Ready Stock
                          </span>
                        </div>
                      </div>

                      {/* Metadata Content */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary">
                            {p.category}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 flex-1">
                          {p.desc.length > 90 ? (
                            <>
                              {p.desc.substring(0, 90)}...{" "}
                              <Link
                                href={`/produk/${slug}`}
                                className="text-primary hover:underline font-semibold inline-flex items-center gap-0.5"
                              >
                                Baca selengkapnya
                              </Link>
                            </>
                          ) : (
                            p.desc
                          )}
                        </p>
                        
                        {/* Uses Tag List */}
                        <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/85">
                          <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-mono">
                            Cocok untuk:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {p.uses.slice(0, 3).map((use) => (
                              <span
                                key={use}
                                className="inline-flex items-center gap-1 rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-[9px] sm:text-[10px] text-zinc-650 dark:text-zinc-350 border border-zinc-200/50 dark:border-zinc-700/60"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                {use}
                              </span>
                            ))}
                            {p.uses.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                                +{p.uses.length - 3} lainnya
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Button Panel */}
                        <div className="mt-5 flex items-center gap-2.5 border-t border-zinc-100 dark:border-zinc-800/85 pt-3.5">
                          <Button asChild size="sm" variant="outline" className="flex-1 gap-1.5 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs py-1.5 h-9 font-bold">
                            <Link href={`/produk/${slug}`}>
                              Detail <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" className="flex-1 gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs py-1.5 h-9 font-bold shadow-sm shadow-primary/10">
                            <a href={`https://wa.me/${waNumber}?text=Halo, saya mau tanya soal ${p.name}`} target="_blank" rel="noopener noreferrer">
                              Tanya Harga
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900 shadow-sm">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Tidak ada produk yang cocok dengan pencarian Anda.</p>
              <button
                onClick={() => {
                  setSelectedCategory("Semua");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold text-primary hover:underline font-mono"
              >
                Reset Pencarian & Filter
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
