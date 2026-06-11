"use client";

import { useState, useEffect } from "react";
import { Save, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";

interface LandingData {
  [section: string]: {
    [key: string]: string;
  };
}

const SECTIONS = [
  { value: "hero", label: "Hero Section" },
  { value: "stats", label: "Statistik" },
  { value: "about", label: "Tentang Kami" },
  { value: "order", label: "Cara Pemesanan" },
  { value: "cta", label: "CTA / Call to Action" },
  { value: "footer", label: "Footer" },
  { value: "maps", label: "Maps & Lokasi" },
  { value: "jual_bongkaran", label: "Jual Bongkaran (Konveksi)" },
];

const SECTION_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  hero: [
    { key: "badge", label: "Badge Text" },
    { key: "title", label: "Judul Utama" },
    { key: "subtitle", label: "Subtitle" },
    { key: "description", label: "Deskripsi" },
    { key: "trust1", label: "Trust Badge 1" },
    { key: "trust2", label: "Trust Badge 2" },
    { key: "wa_number", label: "Nomor WhatsApp (tanpa 62, misal: 8123456789)" },
  ],
  stats: [
    { key: "exp_years", label: "Tahun Pengalaman (misal: 5+)" },
    { key: "customers", label: "Jumlah Customer (misal: 100+)" },
    { key: "stock", label: "Stok Tersedia (misal: 10 Ton)" },
    { key: "response", label: "Waktu Respon (misal: 24 Jam)" },
  ],
  about: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Judul" },
    { key: "description", label: "Deskripsi" },
    { key: "trust1", label: "Keunggulan 1" },
    { key: "trust2", label: "Keunggulan 2" },
    { key: "trust3", label: "Keunggulan 3" },
    { key: "trust4", label: "Keunggulan 4" },
    { key: "trust5", label: "Keunggulan 5" },
    { key: "trust6", label: "Keunggulan 6" },
    { key: "address", label: "Alamat" },
    { key: "hours", label: "Jam Operasional" },
    { key: "phone", label: "Telepon" },
    { key: "stock", label: "Stok" },
  ],
  order: [
    { key: "step1_title", label: "Step 1 - Judul" },
    { key: "step1_desc", label: "Step 1 - Deskripsi" },
    { key: "step2_title", label: "Step 2 - Judul" },
    { key: "step2_desc", label: "Step 2 - Deskripsi" },
    { key: "step3_title", label: "Step 3 - Judul" },
    { key: "step3_desc", label: "Step 3 - Deskripsi" },
  ],
  cta: [
    { key: "title", label: "Judul" },
    { key: "subtitle", label: "Subtitle" },
    { key: "wa_number", label: "Nomor WhatsApp" },
  ],
  footer: [
    { key: "company_name", label: "Nama Perusahaan" },
    { key: "description", label: "Deskripsi" },
    { key: "wa_label", label: "Label WhatsApp" },
    { key: "wa_number", label: "Nomor WhatsApp" },
    { key: "email_label", label: "Label Email" },
    { key: "email", label: "Alamat Email" },
    { key: "address", label: "Alamat" },
    { key: "hours_weekday", label: "Jam weekday" },
    { key: "hours_saturday", label: "Jam Sabtu" },
    { key: "hours_sunday", label: "Jam Minggu" },
  ],
  maps: [
    { key: "embed_url", label: "Google Maps Embed URL" },
    { key: "maps_link", label: "Link Google Maps (buka di Maps app)" },
    { key: "location_name", label: "Nama Lokasi" },
    { key: "location_subtitle", label: "Subtitle Lokasi" },
  ],
  jual_bongkaran: [
    { key: "badge", label: "Badge (atas judul)" },
    { key: "title", label: "Judul Utama" },
    { key: "subtitle", label: "Subtitle" },
    { key: "description", label: "Deskripsi", multiline: true },
    { key: "wa_text", label: "Pesan WhatsApp Default", multiline: true },
  ],
};

export default function LandingCMS() {
  const [selectedSection, setSelectedSection] = useState("hero");
  const [data, setData] = useState<LandingData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/landing");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const sectionData = data[selectedSection] || {};
      const updates = Object.entries(sectionData).map(([key, value]) => ({
        section: selectedSection,
        key,
        value,
      }));

      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  function handleFieldChange(key: string, value: string) {
    setData((prev) => ({
      ...prev,
      [selectedSection]: {
        ...prev[selectedSection],
        [key]: value,
      },
    }));
    setSaved(false);
  }

  const currentFields = SECTION_FIELDS[selectedSection] || [];
  const currentData = data[selectedSection] || {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Landing Page CMS"
        description="Kelola konten landing page website"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Section selector */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Pilih Section
          </Label>
          <div className="rounded-lg border border-zinc-200 bg-white p-1">
            {SECTIONS.map((section) => (
              <button
                key={section.value}
                onClick={() => setSelectedSection(section.value)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  selectedSection === section.value
                    ? "bg-zinc-950 text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Edit form */}
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {SECTIONS.find((s) => s.value === selectedSection)?.label}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Edit konten untuk section ini
                </p>
              </div>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-sm text-emerald-600 font-medium">
                    Tersimpan ✓
                  </span>
                )}
                {error && (
                  <span className="text-sm text-rose-600 font-medium">
                    {error}
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {currentFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium text-zinc-700">
                      {field.label}
                    </Label>
                    {field.multiline ? (
                      <textarea
                        id={field.key}
                        value={currentData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={currentData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview link */}
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center">
            <p className="text-sm text-zinc-500">
              Lihat preview landing page:{" "}
              <a href="/" target="_blank" className="font-medium text-zinc-950 hover:underline">
                Buka di tab baru
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}