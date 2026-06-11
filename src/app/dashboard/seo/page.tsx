"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, RefreshCw, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";

type SeoTokens = {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterHandle: string;
  canonical: string;
  themeColor: string;
};

type SeoApiResponse = {
  pages: string[];
  defaults: Record<string, SeoTokens>;
  stored: Record<string, Partial<SeoTokens>>;
};

const PAGE_LABELS: Record<string, { label: string; hint: string; preview: string }> = {
  default: {
    label: "Global / Root Layout",
    hint: "Dipakai sebagai fallback untuk semua halaman jika tidak punya override.",
    preview: "/",
  },
  home: { label: "Beranda", hint: "Halaman utama / landing page.", preview: "/" },
  artikel: { label: "Artikel & Blog", hint: "Halaman list artikel.", preview: "/artikel" },
  karir: { label: "Karir", hint: "Halaman lowongan kerja.", preview: "/karir" },
  kalkulator: { label: "Kalkulator", hint: "Halaman kalkulator harga.", preview: "/kalkulator" },
  jualBongkaran: {
    label: "Jual Bongkaran",
    hint: "Halaman khusus untuk konveksi yang ingin menjual bongkaran.",
    preview: "/jual-bongkaran",
  },
  lacak: { label: "Lacak Pesanan", hint: "Halaman tracking pesanan.", preview: "/lacak-pesanan" },
};

const FIELDS: { key: keyof SeoTokens; label: string; placeholder?: string; multiline?: boolean; help?: string; mono?: boolean }[] = [
  { key: "title", label: "Title", placeholder: "Judul tab browser & SERP", help: "Idealnya 50–60 karakter." },
  { key: "titleTemplate", label: "Title Template", placeholder: "%s | CV. SIDARMA MAJUN", help: "Hanya untuk root. Gunakan %s sebagai placeholder.", mono: true },
  { key: "description", label: "Meta Description", placeholder: "Deskripsi singkat untuk SERP", multiline: true, help: "Idealnya 140–160 karakter." },
  { key: "keywords", label: "Keywords (CSV)", placeholder: "kain majun, distributor, ...", help: "Pisahkan dengan koma." },
  { key: "ogTitle", label: "Open Graph Title", placeholder: "Untuk preview share di sosial media" },
  { key: "ogDescription", label: "Open Graph Description", placeholder: "Deskripsi untuk preview share", multiline: true },
  { key: "ogImage", label: "Open Graph Image URL", placeholder: "/og-image.png atau https://...", mono: true, help: "Rasio 1200×630, format PNG/JPG." },
  { key: "twitterHandle", label: "Twitter Site Handle", placeholder: "@username" },
  { key: "canonical", label: "Canonical URL", placeholder: "https://sidarmamajun.com/...", mono: true, help: "Kosongkan untuk auto." },
  { key: "themeColor", label: "Theme Color (browser)", placeholder: "#0d9488", mono: true, help: "Hanya untuk root. Warna address bar mobile." },
];

export default function SeoAdminPage() {
  const [data, setData] = useState<SeoApiResponse | null>(null);
  const [activePage, setActivePage] = useState<string>("default");
  const [draft, setDraft] = useState<SeoTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seo");
      if (!res.ok) throw new Error();
      const json: SeoApiResponse = await res.json();
      setData(json);
    } catch {
      setMessage({ type: "err", text: "Gagal memuat data SEO" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const merged = useMemo<SeoTokens | null>(() => {
    if (!data) return null;
    const def = data.defaults[activePage] ?? data.defaults.default;
    const stored = (data.stored[activePage] ?? {}) as Partial<SeoTokens>;
    return { ...def, ...stored } as SeoTokens;
  }, [data, activePage]);

  // Sync draft saat ganti page atau load ulang
  useEffect(() => {
    if (merged) setDraft(merged);
  }, [merged]);

  if (!loading && !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        Gagal memuat data SEO. Coba refresh.
      </div>
    );
  }

  const handleChange = (key: keyof SeoTokens, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setMessage(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: activePage, data: draft }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal menyimpan");
      }
      setMessage({ type: "ok", text: "SEO tersimpan." });
      await load();
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  };

  const isRoot = activePage === "default";
  const titlePreview = (draft?.title || "").slice(0, 65);
  const descPreview = (draft?.description || "").slice(0, 165);

  const pageList = data?.pages ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="SEO Website"
        description="Atur metadata SEO per halaman: title, description, keywords, Open Graph, dan canonical URL."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar list halaman */}
        <div className="w-full lg:w-72 shrink-0 space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Pilih Halaman
          </Label>
          <div className="rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
            {pageList.map((page) => {
              const meta = PAGE_LABELS[page] ?? { label: page, hint: "", preview: "/" };
              const isActive = activePage === page;
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{meta.label}</p>
                    <p
                      className={`truncate text-[11px] font-normal ${
                        isActive ? "text-zinc-300 dark:text-zinc-500" : "text-zinc-400"
                      }`}
                    >
                      {meta.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
            Field kosong otomatis fallback ke setting halaman <strong>Global</strong>.
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                  {PAGE_LABELS[activePage]?.label ?? activePage}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {PAGE_LABELS[activePage]?.hint ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {message ? (
                  <span
                    className={`text-xs font-medium ${
                      message.type === "ok" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {message.text}
                  </span>
                ) : null}
                <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="gap-2">
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button onClick={handleSave} disabled={saving || !draft} size="sm" className="gap-2">
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>

            {/* Live preview ala Google SERP */}
            <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Preview SERP
              </p>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Search className="h-3 w-3" />
                <span className="truncate">{draft?.canonical || PAGE_LABELS[activePage]?.preview}</span>
              </div>
              <p className="mt-1 truncate text-base font-medium text-blue-700 dark:text-blue-400">
                {titlePreview || <span className="text-zinc-400">(title belum diisi)</span>}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                {descPreview || <span className="text-zinc-400">(description belum diisi)</span>}
              </p>
            </div>

            {loading || !draft ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {FIELDS.filter((f) => {
                  // titleTemplate & themeColor hanya muncul di Global
                  if (!isRoot && (f.key === "titleTemplate" || f.key === "themeColor")) return false;
                  return true;
                }).map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <Label htmlFor={field.key} className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                        {field.label}
                      </Label>
                      {field.help ? (
                        <span className="text-[11px] text-zinc-400">{field.help}</span>
                      ) : null}
                    </div>
                    {field.multiline ? (
                      <textarea
                        id={field.key}
                        value={draft[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        rows={3}
                        placeholder={field.placeholder}
                        className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={draft[field.key] ?? ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className={field.mono ? "font-mono text-xs" : ""}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-sm text-zinc-500">
              Lihat halaman publik:{" "}
              <a
                href={PAGE_LABELS[activePage]?.preview ?? "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-950 hover:underline dark:text-zinc-100"
              >
                {PAGE_LABELS[activePage]?.preview ?? "/"} ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
