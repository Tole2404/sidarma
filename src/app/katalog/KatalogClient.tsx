"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, CheckCircle2, ArrowRight, ShieldCheck, Truck, Phone } from "lucide-react";
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
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      <SiteNavbar />

      {/* Header Banner: Clean Industrial Layout */}
      <section className="relative border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 py-12 sm:py-16 lg:py-20 text-zinc-950 dark:text-white">
        {banner.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 dark:opacity-20"
            style={{ backgroundImage: `url(${banner.bgImage})` }}
          />
        )}
        <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
            {banner.badge || "KATALOG RESMI DISTRIBUTOR"}
          </div>
          <h1
            className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-zinc-950 dark:text-white"
            style={customTitleStyle}
            dangerouslySetInnerHTML={{ __html: banner.title || "Katalog Produk Kain Majun & APD Industri" }}
          />
          <p
            className="text-xs xs:text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{
              __html:
                banner.description ||
                "Pasokan kain lap majun katun lembaran tanpa jahit, jahit sambung, jahit tumpuk, dan sarung tangan kerja untuk kebutuhan pabrik manufaktur, perkapalan, dan bengkel.",
            }}
          />
        </div>
      </section>

      {/* Main Catalog Body */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari kain majun, sarung tangan, atau aplikasi mesin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative w-full sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full min-h-[44px] pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:border-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 px-1">
            <span>Ditemukan {filteredProducts.length} item material</span>
            <span>Kemasan: Bal Press 25 kg & 50 kg</span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => {
                const slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
                return (
                  <div
                    key={p.name}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-700 dark:border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold text-emerald-400">
                          Stok Ready
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                          {p.category}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white line-clamp-1">
                          {p.name}
                        </h2>
                        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">
                          {p.desc}
                        </p>

                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                          <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                            Cocok untuk Sektor:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {p.uses.slice(0, 3).map((use) => (
                              <span
                                key={use}
                                className="inline-flex items-center gap-1 rounded bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50"
                              >
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 dark:text-emerald-400" />
                                {use}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0">
                      <div className="flex items-center gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="flex-1 min-h-[44px] text-xs border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
                        >
                          <Link href={`/produk/${slug}`}>
                            Detail Spek <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 min-h-[44px] text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                        >
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo,%20kami%20ingin%20tanya%20harga%20dan%20stok%20untuk%20${encodeURIComponent(p.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Tanya Harga
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Tidak ada produk yang cocok dengan pencarian Anda.</p>
              <button
                onClick={() => {
                  setSelectedCategory("Semua");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-mono text-amber-600 dark:text-amber-500 hover:underline"
              >
                Reset Filter & Pencarian
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
