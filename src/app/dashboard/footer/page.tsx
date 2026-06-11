"use client";

import { useEffect, useMemo, useState } from "react";
import { Layout, RefreshCw, Save, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";

type FooterField = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  help?: string;
};

const COMPANY_FIELDS: FooterField[] = [
  { key: "company_name", label: "Nama Perusahaan", placeholder: "CV. SIDARMA MAJUN" },
  {
    key: "description",
    label: "Deskripsi Singkat",
    placeholder: "Penyedia kain majun ...",
    multiline: true,
    help: "Tampil di kolom kiri footer.",
  },
  { key: "address", label: "Alamat Lengkap", placeholder: "Jl. ..." },
];

const CONTACT_FIELDS: FooterField[] = [
  { key: "wa_label", label: "Label WhatsApp", placeholder: "WhatsApp" },
  { key: "wa_number", label: "Nomor WhatsApp", placeholder: "0812-3456-7890" },
  { key: "email_label", label: "Label Email", placeholder: "Email" },
  { key: "email", label: "Alamat Email", placeholder: "you@domain.com" },
];

const HOURS_FIELDS: FooterField[] = [
  { key: "hours_weekday", label: "Jam Senin–Jumat", placeholder: "Senin — Jumat: 08.00 — 17.00" },
  { key: "hours_saturday", label: "Jam Sabtu", placeholder: "Sabtu: 08.00 — 14.00" },
  { key: "hours_sunday", label: "Jam Minggu", placeholder: "Minggu: Tutup" },
];

const COPYRIGHT_FIELDS: FooterField[] = [
  {
    key: "copyright",
    label: "Teks Copyright",
    placeholder: "© 2026 CV. SIDARMA MAJUN. Seluruh hak cipta dilindungi.",
    help: "Kosongkan untuk pakai default otomatis (tahun + nama perusahaan).",
  },
];

const SOCIAL_FIELDS: FooterField[] = [
  { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/...", help: "Kosongkan untuk sembunyikan." },
  { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@..." },
  { key: "whatsapp", label: "WhatsApp URL", placeholder: "https://wa.me/62..." },
];

type SettingsBucket = Record<string, string>;
type AllSettings = Record<string, SettingsBucket>;

export default function FooterAdminPage() {
  const [allSettings, setAllSettings] = useState<AllSettings | null>(null);
  const [draft, setDraft] = useState<{ footer: SettingsBucket; social: SettingsBucket }>({
    footer: {},
    social: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/landing");
      if (!res.ok) throw new Error();
      const data: AllSettings = await res.json();
      setAllSettings(data);
      setDraft({
        footer: { ...(data.footer || {}) },
        social: { ...(data.social || {}) },
      });
    } catch {
      setMessage({ type: "err", text: "Gagal memuat data footer" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (section: "footer" | "social", key: string, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setMessage(null);
  };

  const dirtyCount = useMemo(() => {
    if (!allSettings) return 0;
    let count = 0;
    for (const section of ["footer", "social"] as const) {
      const stored = allSettings[section] || {};
      const current = draft[section] || {};
      const allKeys = new Set([...Object.keys(stored), ...Object.keys(current)]);
      for (const key of allKeys) {
        if ((stored[key] ?? "") !== (current[key] ?? "")) count++;
      }
    }
    return count;
  }, [allSettings, draft]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updates: { section: string; key: string; value: string }[] = [];
      for (const section of ["footer", "social"] as const) {
        for (const [key, value] of Object.entries(draft[section] || {})) {
          updates.push({ section, key, value });
        }
      }
      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal menyimpan");
      }
      setMessage({ type: "ok", text: "Footer tersimpan." });
      await load();
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (section: "footer" | "social", fields: FooterField[]) =>
    fields.map((field) => (
      <div key={field.key} className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <Label
            htmlFor={`${section}-${field.key}`}
            className="text-sm font-medium text-zinc-700 dark:text-zinc-200"
          >
            {field.label}
          </Label>
          {field.help ? (
            <span className="text-[11px] text-zinc-400">{field.help}</span>
          ) : null}
        </div>
        {field.multiline ? (
          <textarea
            id={`${section}-${field.key}`}
            value={draft[section][field.key] ?? ""}
            onChange={(e) => handleChange(section, field.key, e.target.value)}
            rows={3}
            placeholder={field.placeholder}
            className="flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        ) : (
          <Input
            id={`${section}-${field.key}`}
            value={draft[section][field.key] ?? ""}
            onChange={(e) => handleChange(section, field.key, e.target.value)}
            placeholder={field.placeholder}
          />
        )}
      </div>
    ));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Footer Website"
        description="Kelola konten footer halaman publik: identitas, kontak, jam operasional, sosial media, dan copyright."
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <Layout className="h-4 w-4" />
          {dirtyCount > 0 ? (
            <span>
              <span className="font-medium text-zinc-950 dark:text-zinc-100">{dirtyCount}</span>{" "}
              perubahan belum disimpan
            </span>
          ) : (
            <span>Tidak ada perubahan</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <Button onClick={handleSave} disabled={saving || dirtyCount === 0} size="sm" className="gap-2">
            <Save className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
                Identitas & Alamat
              </h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Nama perusahaan, deskripsi, dan alamat untuk kolom kiri footer.
              </p>
            </header>
            <div className="space-y-5">{renderFields("footer", COMPANY_FIELDS)}</div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">Kontak</h2>
              <p className="mt-0.5 text-sm text-zinc-500">WhatsApp & email yang ditampilkan di footer.</p>
            </header>
            <div className="grid gap-5 sm:grid-cols-2">{renderFields("footer", CONTACT_FIELDS)}</div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">Jam Operasional</h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Setiap baris ditampilkan sebagai item terpisah di kolom Jam Operasional.
              </p>
            </header>
            <div className="space-y-5">{renderFields("footer", HOURS_FIELDS)}</div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <header className="mb-4 flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-zinc-500" />
              <div>
                <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">Sosial Media</h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Kosongkan URL untuk menyembunyikan ikon dari footer.
                </p>
              </div>
            </header>
            <div className="space-y-5">{renderFields("social", SOCIAL_FIELDS)}</div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
            <header className="mb-4">
              <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">Copyright</h2>
              <p className="mt-0.5 text-sm text-zinc-500">Teks di paling bawah footer.</p>
            </header>
            <div className="space-y-5">{renderFields("footer", COPYRIGHT_FIELDS)}</div>
          </section>
        </div>
      )}

      <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
        <p className="text-sm text-zinc-500">
          Lihat perubahan di halaman publik:{" "}
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-950 hover:underline dark:text-zinc-100">
            Buka beranda ↗
          </a>
        </p>
      </div>
    </div>
  );
}
