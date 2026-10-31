"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Radar,
  Building2,
  Wrench,
  Factory,
  Printer,
  Hammer,
  Search,
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  UserPlus,
  RotateCw,
  Sparkles,
  Download,
  Filter,
  Check,
  Copy,
  Users,
  Layers,
  Star,
  SlidersHorizontal,
  X,
  Flame,
  Globe,
  Trash2,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { ProspectItem } from "@/app/api/prospects/search/route";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const SCRAPABLE_CATEGORIES = [
  { id: "building_materials", label: "Toko Bangunan & Material", icon: Hammer },
  { id: "automotive", label: "Bengkel & Karoseri Mobil", icon: Wrench },
  { id: "factory", label: "Pabrik Manufaktur Industri", icon: Factory },
  { id: "printing", label: "Percetakan & Sablon Offset", icon: Printer },
  { id: "fabrication", label: "Workshop Bubut & Fabrikasi", icon: Building2 },
];

const CITY_OPTIONS = [
  { id: "Jakarta Barat", label: "📍 Jakarta Barat (Glodok, Meruya, Daan Mogot, Palmerah)" },
  { id: "Jakarta Timur", label: "📍 Jakarta Timur (Pulogadung, Duren Sawit, Cakung)" },
  { id: "Jakarta Utara", label: "📍 Jakarta Utara (Tanjung Priok, Sunter, KBN Marunda)" },
  { id: "Jakarta Selatan", label: "📍 Jakarta Selatan (Pesanggrahan, Kebayoran, Pasar Minggu)" },
  { id: "Jakarta Pusat", label: "📍 Jakarta Pusat (Senen, Percetakan Negara, Benhil)" },
  { id: "DKI Jakarta", label: "🏢 DKI Jakarta (Semua Wilayah)" },
  { id: "Bekasi", label: "📍 Bekasi & Cikarang (Jababeka, MM2100)" },
  { id: "Tangerang", label: "📍 Tangerang & Banten" },
  { id: "Bandung", label: "📍 Bandung & Cimahi (Head Office DARMIN)" },
];

export default function ProspectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Live Scraping Metadata
  const [liveSearchQuery, setLiveSearchQuery] = useState<string>("");
  const [mapsLiveUrl, setMapsLiveUrl] = useState<string>("");

  // Scraper Multi-Filter Configuration
  const [selectedCategoriesToScrape, setSelectedCategoriesToScrape] = useState<string[]>([
    "building_materials",
    "automotive",
    "factory",
  ]);
  const [selectedCity, setSelectedCity] = useState("Jakarta Barat");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [limitPerCategory, setLimitPerCategory] = useState(4);
  const [appendMode, setAppendMode] = useState(true); // Akumulasi data scraping

  // Filter States on Scraped Results
  const [displayCategoryFilter, setDisplayCategoryFilter] = useState<string>("all");
  const [contactFilter, setContactFilter] = useState<"all" | "wa" | "landline" | "has_contact">("all");
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);
  const [minReviewsFilter, setMinReviewsFilter] = useState<number>(0);
  const [statusDbFilter, setStatusDbFilter] = useState<"all" | "unregistered" | "registered">("all");
  const [sortBy, setSortBy] = useState<"relevant" | "rating_desc" | "reviews_desc" | "name_asc">("relevant");
  const [tableFilterText, setTableFilterText] = useState("");

  // Scraped Prospects State
  const [prospects, setProspects] = useState<ProspectItem[]>([]);
  const [loadingProspects, setLoadingProspects] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [engineStats, setEngineStats] = useState<{ executionTimeMs?: number; engine?: string }>({});

  // Import State
  const [importing, setImporting] = useState(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // WhatsApp Template Modal
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [targetWaProspect, setTargetWaProspect] = useState<ProspectItem | null>(null);
  const [waTemplate, setWaTemplate] = useState(
    "Halo {storeName}, salam kenal dari CV. DARMIN MAJUN (Distributor Resmi Kain Majun Pabrik & Bengkel di Bandung).\n\nKami melihat tempat usaha Bapak/Ibu membutuhkan kain lap majun untuk operasional harian. Kami ingin menawarkan pasokan kain majun katun berkualitas tinggi (daya serap oli & air tinggi, bebas kancing/kawat) langsung dengan harga grosir produsen.\n\nApakah kami boleh kirimkan sampel gratis 2 kg dan daftar harga spesial untuk toko/bengkel Bapak/Ibu?"
  );
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/portal-admin");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/portal-admin");
      } finally {
        setLoadingUser(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal-admin");
    router.refresh();
  };

  // Toggle category in multi-scraper filter
  const toggleCategoryToScrape = (catId: string) => {
    setSelectedCategoriesToScrape((prev) => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev; // At least 1 category selected
        return prev.filter((c) => c !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const selectAllCategoriesToScrape = () => {
    if (selectedCategoriesToScrape.length === SCRAPABLE_CATEGORIES.length) {
      setSelectedCategoriesToScrape(["building_materials"]);
    } else {
      setSelectedCategoriesToScrape(SCRAPABLE_CATEGORIES.map((c) => c.id));
    }
  };

  // Run Live Multi-Scrape against Google Maps
  const runLiveMultiScrape = async () => {
    if (selectedCategoriesToScrape.length === 0) return;
    setLoadingProspects(true);
    setImportNotification(null);
    try {
      const params = new URLSearchParams({
        categories: selectedCategoriesToScrape.join(","),
        city: selectedCity,
        q: searchKeyword,
        limit: limitPerCategory.toString(),
      });

      const res = await fetch(`/api/prospects/search?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.prospects)) {
        setLiveSearchQuery(data.searchQuery || `${selectedCategoriesToScrape.length} Sektor di ${selectedCity}`);
        setMapsLiveUrl(data.mapsLiveUrl || "");
        setEngineStats({
          executionTimeMs: data.executionTimeMs,
          engine: data.engine || "Google Maps Live Multi-Scraper (Headless Chrome)",
        });

        if (appendMode) {
          // Merge newly scraped data with existing (avoiding duplicates by storeName)
          setProspects((prev) => {
            const existingNames = new Set(prev.map((p) => p.storeName.toLowerCase().trim()));
            const newUnique = data.prospects.filter(
              (p: ProspectItem) => !existingNames.has(p.storeName.toLowerCase().trim())
            );
            return [...prev, ...newUnique];
          });
        } else {
          // Replace with new scrape
          setProspects(data.prospects);
        }

        setSelectedIds(new Set());
      }
    } catch (err) {
      console.error("Gagal menjalankan live scraping:", err);
    } finally {
      setLoadingProspects(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!loadingUser) {
      runLiveMultiScrape();
    }
  }, [loadingUser]);

  // Compute Filtered & Sorted Prospects for Table
  const filteredProspects = useMemo(() => {
    let list = [...prospects];

    // Filter by Display Category
    if (displayCategoryFilter !== "all") {
      list = list.filter((p) => p.category === displayCategoryFilter);
    }

    // Filter by Contact Type
    if (contactFilter === "wa") {
      list = list.filter((p) => p.phone && (p.phone.startsWith("08") || p.phone.startsWith("+628")));
    } else if (contactFilter === "landline") {
      list = list.filter((p) => p.phone && (p.phone.startsWith("02") || p.phone.startsWith("(02")));
    } else if (contactFilter === "has_contact") {
      list = list.filter((p) => p.phone && !p.phone.toLowerCase().includes("tidak tercantum"));
    }

    // Filter by Min Rating
    if (minRatingFilter > 0) {
      list = list.filter((p) => (p.rating || 0) >= minRatingFilter);
    }

    // Filter by Min Reviews Count
    if (minReviewsFilter > 0) {
      list = list.filter((p) => (p.reviewsCount || 0) >= minReviewsFilter);
    }

    // Filter by DB Status
    if (statusDbFilter === "unregistered") {
      list = list.filter((p) => !p.isAlreadyCustomer);
    } else if (statusDbFilter === "registered") {
      list = list.filter((p) => p.isAlreadyCustomer);
    }

    // Filter by Table Filter Text (Instant Search)
    if (tableFilterText.trim()) {
      const q = tableFilterText.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.storeName.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.district && p.district.toLowerCase().includes(q)) ||
          p.phone.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "rating_desc") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "reviews_desc") {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === "name_asc") {
      list.sort((a, b) => a.storeName.localeCompare(b.storeName));
    }

    return list;
  }, [
    prospects,
    displayCategoryFilter,
    contactFilter,
    minRatingFilter,
    minReviewsFilter,
    statusDbFilter,
    tableFilterText,
    sortBy,
  ]);

  // Handle select all / deselect
  const toggleSelectAll = () => {
    const unregistered = filteredProspects.filter((p) => !p.isAlreadyCustomer);
    if (selectedIds.size === unregistered.length && unregistered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unregistered.map((p) => p.id)));
    }
  };

  const toggleSelectProspect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Handle Import selected prospects to Customer DB
  const handleImportSelected = async (targetItems?: ProspectItem[]) => {
    const itemsToImport = targetItems || filteredProspects.filter((p) => selectedIds.has(p.id));
    if (itemsToImport.length === 0) return;

    setImporting(true);
    try {
      const res = await fetch("/api/prospects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospects: itemsToImport }),
      });
      const data = await res.json();
      if (data.success) {
        setImportNotification(data.message);
        // Mark imported locally
        const importedNames = new Set(itemsToImport.map((i) => i.storeName.toLowerCase().trim()));
        setProspects((prev) =>
          prev.map((p) =>
            importedNames.has(p.storeName.toLowerCase().trim())
              ? { ...p, isAlreadyCustomer: true }
              : p
          )
        );
        setSelectedIds(new Set());
      } else {
        alert("Gagal impor: " + data.error);
      }
    } catch (e: any) {
      alert("Terjadi kesalahan sistem saat impor: " + e.message);
    } finally {
      setImporting(false);
    }
  };

  // Format WhatsApp Link
  const getWhatsAppUrl = (phone: string, storeName: string) => {
    const cleanNumber = phone.replace(/[^0-9]/g, "");
    const formattedNumber = cleanNumber.startsWith("0")
      ? "62" + cleanNumber.slice(1)
      : cleanNumber;
    const personalizedMsg = waTemplate.replace(/{storeName}/g, storeName);
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(personalizedMsg)}`;
  };

  // Reset in-table filters
  const resetTableFilters = () => {
    setDisplayCategoryFilter("all");
    setContactFilter("all");
    setMinRatingFilter(0);
    setMinReviewsFilter(0);
    setStatusDbFilter("all");
    setSortBy("relevant");
    setTableFilterText("");
  };

  // Clear all scraped prospects
  const clearAllProspects = () => {
    if (confirm("Hapus semua data hasil scraping dari tampilan tabel?")) {
      setProspects([]);
      setSelectedIds(new Set());
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    if (filteredProspects.length === 0) return;
    const headers = [
      "Nama Toko / Perusahaan",
      "Kategori",
      "Pemilik / Kontak",
      "No. Telepon / WA",
      "Alamat Lengkap",
      "Kota",
      "Estimasi Konsumsi Majun",
      "Rekomendasi Produk",
      "Status Database",
      "Google Maps URL",
    ];

    const rows = filteredProspects.map((p) => [
      `"${p.storeName}"`,
      `"${p.categoryLabel}"`,
      `"${p.ownerName || "-"}"`,
      `"${p.phone}"`,
      `"${p.address}"`,
      `"${p.city}"`,
      `"${p.estimatedConsumptionKg}"`,
      `"${p.recommendedMajun}"`,
      p.isAlreadyCustomer ? '"Sudah Terdaftar"' : '"Belum Terdaftar"',
      `"${p.googleMapsUrl || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `prospek_darmin_${selectedCity.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unregisteredCount = useMemo(
    () => filteredProspects.filter((p) => !p.isAlreadyCustomer).length,
    [filteredProspects]
  );

  const waAvailableCount = useMemo(
    () =>
      filteredProspects.filter(
        (p) => p.phone && (p.phone.startsWith("08") || p.phone.startsWith("+628"))
      ).length,
    [filteredProspects]
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="admin-main max-w-7xl">
        <div className="space-y-6">
          {/* Page Header */}
          <PageHeader
            title="Radar Prospek & Scraper B2B (Multi-Target Live)"
            description="Pindai beberapa sektor bisnis sekaligus (Toko Bangunan, Bengkel, Pabrik) secara live dari Google Maps. Saring dan kelola beberapa data scraping langsung di tabel."
          />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Total Hasil Scraping
                  </p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {prospects.length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Radar className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Ada WhatsApp (08..)
                  </p>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {waAvailableCount}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <MessageCircle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Siap Diimpor
                  </p>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {unregisteredCount}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <UserPlus className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    Sudah di Database
                  </p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {prospects.length - unregisteredCount}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center font-bold">
                  <Check className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Import Notification Banner */}
          {importNotification && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs font-semibold animate-in fade-in">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>{importNotification}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setImportNotification(null)}
                className="h-6 w-6 p-0 text-emerald-700"
              >
                ✕
              </Button>
            </div>
          )}

          {/* 1. Scraper Control Card: Filter Target yang Ingin Di-Scrape */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-cyan-600" />
                    Panel Filter Scraping Web (Pilih Target Data):
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Centang beberapa sektor sekaligus untuk memindai beragam jenis prospek secara bersamaan dari web.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllCategoriesToScrape}
                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 underline"
                  >
                    {selectedCategoriesToScrape.length === SCRAPABLE_CATEGORIES.length
                      ? "Pilih 1 Sektor Saja"
                      : "Centang Semua Sektor"}
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Category Checkboxes */}
              <div>
                <label className="text-[11px] font-bold text-zinc-500 mb-2 block uppercase tracking-wider">
                  Target Sektor Bisnis (Bisa Pilih Beberapa Sekaligus):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SCRAPABLE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isChecked = selectedCategoriesToScrape.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCategoryToScrape(cat.id)}
                        className={`cursor-pointer p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 select-none ${
                          isChecked
                            ? "bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 text-cyan-900 dark:text-cyan-200 shadow-sm"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500 pointer-events-none"
                        />
                        <Icon className={`h-4 w-4 ${isChecked ? "text-cyan-600" : "text-zinc-400"}`} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location, Keyword, & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {/* Wilayah Dropdown */}
                <div className="sm:col-span-4">
                  <label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                    Wilayah Target:
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full text-xs h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {CITY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specific Keyword Input */}
                <div className="sm:col-span-5">
                  <label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                    Kata Kunci Tambahan (Opsional):
                  </label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-2.5 text-zinc-400" />
                    <Input
                      placeholder="Contoh: Glodok, Daan Mogot, Senen, Pulogadung..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") runLiveMultiScrape();
                      }}
                      className="pl-9 h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                {/* Scrape Limit per Category */}
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-bold text-zinc-500 mb-1 block">
                    Jumlah per Sektor:
                  </label>
                  <select
                    value={limitPerCategory}
                    onChange={(e) => setLimitPerCategory(parseInt(e.target.value, 10))}
                    className="w-full text-xs h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1 font-medium"
                  >
                    <option value={3}>3 Tempat / Sektor</option>
                    <option value={5}>5 Tempat / Sektor</option>
                    <option value={8}>8 Tempat / Sektor</option>
                    <option value={10}>10 Tempat / Sektor</option>
                  </select>
                </div>
              </div>

              {/* Execution Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={appendMode}
                      onChange={(e) => setAppendMode(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>Gabungkan dengan hasil scraping sebelumnya (Akumulasi Data)</span>
                  </label>

                  {prospects.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAllProspects}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Kosongkan Tabel
                    </button>
                  )}
                </div>

                <Button
                  onClick={runLiveMultiScrape}
                  disabled={loadingProspects || selectedCategoriesToScrape.length === 0}
                  className="h-9 px-5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Globe className={`h-4 w-4 ${loadingProspects ? "animate-spin" : ""}`} />
                  {loadingProspects
                    ? "Sedang Memindai Google Maps Live..."
                    : `Mulai Scraping Live (${selectedCategoriesToScrape.length} Sektor)`}
                </Button>
              </div>

              {/* Live Web Scrape URL Banner */}
              {mapsLiveUrl && (
                <div className="flex items-center justify-between gap-2 text-xs bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 px-3 py-2 rounded-xl border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                    <span className="truncate">
                      Scrape Live Selesai: <strong>&ldquo;{liveSearchQuery}&rdquo;</strong>
                    </span>
                  </div>
                  <a
                    href={mapsLiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-700 dark:text-cyan-300 font-bold hover:underline flex items-center gap-1 whitespace-nowrap ml-2 text-[11px]"
                  >
                    Buka URL Sumber Google Maps ↗
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. In-Table Filter Bar: Filter Beberapa Data Hasil Scraping */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-indigo-600" />
                  Saring Beberapa Data Scraping di Tabel:
                </span>
                <button
                  type="button"
                  onClick={resetTableFilters}
                  className="text-[11px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
                >
                  Reset Filter Tabel
                </button>
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {/* 1. Saring Kategori */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Sektor / Kategori:
                  </label>
                  <select
                    value={displayCategoryFilter}
                    onChange={(e) => setDisplayCategoryFilter(e.target.value)}
                    className="w-full text-xs h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 font-medium"
                  >
                    <option value="all">Semua Sektor ({prospects.length})</option>
                    {SCRAPABLE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} ({prospects.filter((p) => p.category === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Filter Kontak */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Tipe Kontak:
                  </label>
                  <select
                    value={contactFilter}
                    onChange={(e) => setContactFilter(e.target.value as any)}
                    className="w-full text-xs h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 font-medium"
                  >
                    <option value="all">Semua Kontak</option>
                    <option value="wa">🟢 Hanya WhatsApp (08..)</option>
                    <option value="landline">☎️ Hanya Telepon Kantor (021..)</option>
                    <option value="has_contact">Semua yang Ada Nomor</option>
                  </select>
                </div>

                {/* 3. Filter Rating */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Rating Bintang:
                  </label>
                  <select
                    value={minRatingFilter}
                    onChange={(e) => setMinRatingFilter(parseFloat(e.target.value))}
                    className="w-full text-xs h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 font-medium"
                  >
                    <option value={0}>Semua Rating</option>
                    <option value={4.8}>⭐ 4.8+ (Bintang Terbaik)</option>
                    <option value={4.5}>⭐ 4.5+ (Sangat Bagus)</option>
                    <option value={4.0}>⭐ 4.0+ (Bagus)</option>
                  </select>
                </div>

                {/* 4. Filter Status Database */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Status Customer:
                  </label>
                  <select
                    value={statusDbFilter}
                    onChange={(e) => setStatusDbFilter(e.target.value as any)}
                    className="w-full text-xs h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 font-medium"
                  >
                    <option value="all">Semua Status</option>
                    <option value="unregistered">🆕 Belum Terdaftar (Prospek Baru)</option>
                    <option value="registered">✓ Sudah Customer</option>
                  </select>
                </div>

                {/* 5. Urutan */}
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    Urutkan:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full text-xs h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 font-medium"
                  >
                    <option value="relevant">Paling Relevan</option>
                    <option value="rating_desc">⭐ Rating Tertinggi</option>
                    <option value="reviews_desc">💬 Ulasan Terbanyak</option>
                    <option value="name_asc">🔤 Nama Usaha (A - Z)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Table Section */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardHeader className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs"
                >
                  {filteredProspects.length} dari {prospects.length} Ditampilkan
                </Badge>
                {engineStats.engine && (
                  <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-[10px] font-mono flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    {engineStats.engine}
                  </Badge>
                )}
                {engineStats.executionTimeMs && (
                  <span className="text-[10px] font-mono text-zinc-400">
                    ⏱️ {(engineStats.executionTimeMs / 1000).toFixed(1)}s
                  </span>
                )}
              </div>

              {/* Instant Search in Table & Export */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                  <Input
                    placeholder="Saring nama, jalan, HP..."
                    value={tableFilterText}
                    onChange={(e) => setTableFilterText(e.target.value)}
                    className="pl-8 h-8 text-xs rounded-lg border-zinc-200 dark:border-zinc-800"
                  />
                  {tableFilterText && (
                    <button
                      onClick={() => setTableFilterText("")}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-zinc-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCsv}
                  disabled={filteredProspects.length === 0}
                  className="h-8 text-xs font-bold rounded-lg border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>

                {selectedIds.size > 0 && (
                  <Button
                    size="sm"
                    disabled={importing}
                    onClick={() => handleImportSelected()}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 rounded-lg"
                  >
                    {importing ? "Memproses..." : `Impor (${selectedIds.size})`}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/70 dark:bg-zinc-900/50">
                      <TableHead className="w-10 text-center">
                        <input
                          type="checkbox"
                          checked={unregisteredCount > 0 && selectedIds.size === unregisteredCount}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          title="Pilih semua yang belum ada di database"
                        />
                      </TableHead>
                      <TableHead className="text-xs font-bold">Nama Usaha / Toko</TableHead>
                      <TableHead className="text-xs font-bold">Kategori & Estimasi Majun</TableHead>
                      <TableHead className="text-xs font-bold">Alamat & Lokasi</TableHead>
                      <TableHead className="text-xs font-bold">Kontak / Telepon</TableHead>
                      <TableHead className="text-xs font-bold text-center">Status DB</TableHead>
                      <TableHead className="text-xs font-bold text-right pr-4">Aksi Penjualan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingProspects ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16 text-zinc-400 text-xs">
                          <RotateCw className="h-7 w-7 animate-spin mx-auto mb-2 text-cyan-500" />
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                            Sedang memindai {selectedCategoriesToScrape.length} sektor Google Maps secara live...
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Mengambil data fisik toko bangunan, bengkel, & pabrik langsung dari web.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : filteredProspects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16 text-zinc-400 text-xs">
                          <Search className="h-8 w-8 mx-auto mb-2 text-zinc-300 dark:text-zinc-700" />
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                            Tidak ada data prospek yang cocok dengan kombinasi filter saat ini.
                          </p>
                          <p className="text-[11px] text-zinc-400 mt-1">
                            Coba klik tombol &quot;Reset Filter Tabel&quot; atau jalankan pemindaian baru di atas.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={resetTableFilters}
                            className="mt-3 text-xs"
                          >
                            Reset Filter Tabel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProspects.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                          <TableRow
                            key={item.id}
                            className={`transition-colors ${
                              isSelected
                                ? "bg-indigo-50/40 dark:bg-indigo-950/20"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                            }`}
                          >
                            {/* Checkbox */}
                            <TableCell className="text-center">
                              {!item.isAlreadyCustomer ? (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectProspect(item.id)}
                                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                              ) : (
                                <Check
                                  className="h-4 w-4 text-emerald-500 mx-auto"
                                  title="Sudah terdaftar di database"
                                />
                              )}
                            </TableCell>

                            {/* Store Name & Rating */}
                            <TableCell>
                              <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 flex-wrap">
                                <span>{item.storeName}</span>
                                {item.rating && (
                                  <span className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/20 flex items-center gap-0.5">
                                    ⭐ {item.rating} ({item.reviewsCount})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                                <span>
                                  PIC:{" "}
                                  <strong className="text-zinc-700 dark:text-zinc-300">
                                    {item.ownerName || "Staff Usaha"}
                                  </strong>
                                </span>
                                {item.source && (
                                  <span className="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-1.5 py-0.2 rounded border border-cyan-500/20">
                                    {item.source}
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            {/* Category & Majun Needs */}
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              >
                                {item.categoryLabel}
                              </Badge>
                              <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-bold mt-1">
                                Kebutuhan: {item.estimatedConsumptionKg}
                              </div>
                              <div
                                className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5"
                                title={item.recommendedMajun}
                              >
                                {item.recommendedMajun}
                              </div>
                            </TableCell>

                            {/* Address & City */}
                            <TableCell>
                              <div className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-1 max-w-sm">
                                {item.address}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                                <span className="font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-0.5">
                                  <MapPin className="h-3 w-3 text-rose-500" />
                                  {item.city} {item.district ? `(${item.district})` : ""}
                                </span>
                                {item.googleMapsUrl && (
                                  <a
                                    href={item.googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-600 hover:underline flex items-center gap-0.5"
                                  >
                                    Buka Peta <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                )}
                              </div>
                            </TableCell>

                            {/* Phone & Contact Type */}
                            <TableCell>
                              {(() => {
                                const rawPhone = item.phone || "";
                                const isMobile =
                                  rawPhone.startsWith("08") || rawPhone.startsWith("+628");
                                const isLandline =
                                  rawPhone.startsWith("02") || rawPhone.startsWith("(02");
                                const hasPhone = isMobile || isLandline;

                                return (
                                  <div>
                                    <div className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                                      <Phone
                                        className={`h-3 w-3 ${
                                          isMobile
                                            ? "text-emerald-500"
                                            : isLandline
                                            ? "text-blue-500"
                                            : "text-zinc-400"
                                        }`}
                                      />
                                      {hasPhone ? rawPhone : "Tidak Tercantum"}
                                    </div>
                                    <div
                                      className={`text-[10px] font-semibold mt-0.5 ${
                                        isMobile
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : isLandline
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-zinc-400"
                                      }`}
                                    >
                                      {isMobile
                                        ? "✓ WhatsApp / HP Aktif"
                                        : isLandline
                                        ? "☎️ Telepon Kantor / Toko"
                                        : "Cek di Google Maps"}
                                    </div>
                                  </div>
                                );
                              })()}
                            </TableCell>

                            {/* Status in DB */}
                            <TableCell className="text-center">
                              {item.isAlreadyCustomer ? (
                                <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 text-[10px]">
                                  Sudah Customer
                                </Badge>
                              ) : (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px]">
                                  Prospek Baru
                                </Badge>
                              )}
                            </TableCell>

                            {/* Action Buttons */}
                            <TableCell className="text-right pr-4">
                              <div className="flex items-center justify-end gap-1.5">
                                {(() => {
                                  const rawPhone = item.phone || "";
                                  const isMobile =
                                    rawPhone.startsWith("08") || rawPhone.startsWith("+628");
                                  const isLandline =
                                    rawPhone.startsWith("02") || rawPhone.startsWith("(02");

                                  if (isMobile) {
                                    return (
                                      <a
                                        href={getWhatsAppUrl(rawPhone, item.storeName)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition"
                                        title="Chat WhatsApp dengan Draf Penawaran Otomatis"
                                      >
                                        <MessageCircle className="h-3.5 w-3.5" />
                                        Chat WA
                                      </a>
                                    );
                                  } else if (isLandline) {
                                    const dialNumber = rawPhone.replace(/[^0-9]/g, "");
                                    return (
                                      <a
                                        href={`tel:${dialNumber}`}
                                        className="h-8 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition"
                                        title={`Telepon langsung kantor: ${rawPhone}`}
                                      >
                                        <Phone className="h-3.5 w-3.5" />
                                        Telepon
                                      </a>
                                    );
                                  } else {
                                    return (
                                      <a
                                        href={item.googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="h-8 px-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 transition"
                                        title="Buka profil usaha di Google Maps"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Maps
                                      </a>
                                    );
                                  }
                                })()}

                                {/* One Click Import */}
                                {!item.isAlreadyCustomer ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={importing}
                                    onClick={() => handleImportSelected([item])}
                                    className="h-8 text-xs border-indigo-400/50 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl"
                                    title="Impor toko ini ke tabel Customer"
                                  >
                                    <UserPlus className="h-3.5 w-3.5 mr-1" />
                                    Impor
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => router.push("/customers")}
                                    className="h-8 text-[11px] text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                                  >
                                    Buka Profil →
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
