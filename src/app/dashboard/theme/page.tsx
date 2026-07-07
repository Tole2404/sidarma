"use client";

import { useEffect, useMemo, useState } from "react";
import { Palette, RefreshCw, Save, Sparkles, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";

type ThemeApiResponse = {
  tokens: Record<string, string>;
  defaults: Record<string, string>;
  presets: Record<string, { label: string; description: string; tokens: Record<string, string> }>;
};

const TOKEN_GROUPS: { title: string; description: string; keys: string[] }[] = [
  {
    title: "Netral / Slate",
    description: "Latar belakang, surface, border, dan teks utama.",
    keys: [
      "zinc-50",
      "zinc-100",
      "zinc-200",
      "zinc-300",
      "zinc-400",
      "zinc-500",
      "zinc-600",
      "zinc-700",
      "zinc-800",
      "zinc-900",
      "zinc-950",
    ],
  },
  {
    title: "Brand & Aksen",
    description: "Warna brand utama dan aksen (mis. Digital Blue & Safety Amber).",
    keys: ["primary", "primary-hover", "amber-500", "amber-600", "amber-700"],
  },
  {
    title: "Status",
    description: "Sukses, error, dan info.",
    keys: ["emerald-500", "emerald-600", "rose-500", "rose-600", "blue-500", "blue-600"],
  },
];

const HEX_RE = /^#([0-9a-fA-F]{3}){1,2}$/;

function normalizeHex(value: string): string {
  const v = value.trim();
  if (!v) return v;
  if (HEX_RE.test(v)) {
    return v.length === 4
      ? "#" + v.slice(1).split("").map((c) => c + c).join("").toUpperCase()
      : v.toUpperCase();
  }
  return v;
}

export default function ThemeAdminPage() {
  const [data, setData] = useState<ThemeApiResponse | null>(null);
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/theme");
      if (!res.ok) throw new Error();
      const json: ThemeApiResponse = await res.json();
      setData(json);
      setTokens(json.tokens);
    } catch {
      setMessage({ type: "err", text: "Gagal memuat tema" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dirtyTokens = useMemo(() => {
    if (!data) return {} as Record<string, string>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(tokens)) {
      if (data.tokens[k] !== v) out[k] = v;
    }
    return out;
  }, [tokens, data]);

  const invalidTokens = useMemo(
    () => Object.entries(tokens).filter(([, v]) => !HEX_RE.test(v)).map(([k]) => k),
    [tokens],
  );

  const handleSave = async () => {
    if (invalidTokens.length) {
      setMessage({ type: "err", text: `Ada warna tidak valid: ${invalidTokens.join(", ")}` });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Gagal menyimpan");
      }
      setMessage({ type: "ok", text: "Tema tersimpan. Refresh halaman publik untuk lihat perubahan." });
      await load();
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Gagal menyimpan" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = async () => {
    if (!confirm("Reset semua warna ke default? Override yang tersimpan akan dihapus.")) return;
    setResetting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/theme", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessage({ type: "ok", text: "Tema dikembalikan ke default." });
      await load();
    } catch {
      setMessage({ type: "err", text: "Gagal reset tema" });
    } finally {
      setResetting(false);
    }
  };

  const applyPreset = (presetKey: string) => {
    const preset = data?.presets[presetKey];
    if (!preset) return;
    setTokens((prev) => ({ ...prev, ...preset.tokens }));
    setMessage({ type: "ok", text: `Preset "${preset.label}" diterapkan. Klik Simpan untuk menyimpan.` });
  };

  const resetToken = (key: string) => {
    if (!data) return;
    setTokens((prev) => ({ ...prev, [key]: data.defaults[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Tema & Warna Website"
        description="Atur palet warna website secara dinamis. Perubahan langsung berlaku ke seluruh halaman publik & dashboard."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Presets */}
        <div className="w-full lg:w-72 shrink-0 space-y-3">
          <Label className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Preset Palet
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 rounded-xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
            {data
              ? Object.entries(data.presets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-950 dark:text-zinc-100">
                        {preset.label}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">{preset.description}</p>
                    </div>
                  </button>
                ))
              : null}
          </div>
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
            Pilih preset untuk mengisi semua warna sekaligus, lalu sesuaikan per token bila perlu.
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
              <Palette className="h-4 w-4" />
              {Object.keys(dirtyTokens).length > 0 ? (
                <span>
                  <span className="font-medium text-zinc-950 dark:text-zinc-100">
                    {Object.keys(dirtyTokens).length}
                  </span>{" "}
                  warna belum disimpan
                </span>
              ) : (
                <span>Tidak ada perubahan</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {message ? (
                <span
                  className={`text-xs font-medium w-full sm:w-auto ${
                    message.type === "ok" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {message.text}
                </span>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                onClick={load}
                disabled={loading}
                className="gap-2 flex-1 sm:flex-none"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetAll}
                disabled={resetting}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Undo2 className="h-3.5 w-3.5" />
                {resetting ? "Mereset..." : "Reset"}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || Object.keys(dirtyTokens).length === 0}
                className="gap-2 flex-1 sm:flex-none"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
              ))}
            </div>
          ) : (
            TOKEN_GROUPS.map((group) => (
              <section
                key={group.title}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <header className="mb-4">
                  <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-100">
                    {group.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-zinc-500">{group.description}</p>
                </header>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.keys.map((key) => {
                    const value = tokens[key] || "";
                    const isDirty = data && data.tokens[key] !== value;
                    const isInvalid = !HEX_RE.test(value);
                    return (
                      <div
                        key={key}
                        className={`rounded-lg border p-3 transition-colors ${
                          isInvalid
                            ? "border-rose-300 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20"
                            : isDirty
                              ? "border-amber-300 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20"
                              : "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 shrink-0 rounded-md border border-zinc-200 shadow-inner dark:border-zinc-700"
                            style={{ backgroundColor: HEX_RE.test(value) ? value : "transparent" }}
                          />
                          <div className="min-w-0 flex-1">
                            <Label
                              htmlFor={`token-${key}`}
                              className="block text-[11px] font-mono uppercase tracking-wider text-zinc-500"
                            >
                              --color-{key}
                            </Label>
                            <div className="mt-1 flex items-center gap-1.5">
                              <input
                                id={`token-${key}-picker`}
                                type="color"
                                value={HEX_RE.test(value) ? value : "#000000"}
                                onChange={(e) =>
                                  setTokens((prev) => ({ ...prev, [key]: e.target.value.toUpperCase() }))
                                }
                                className="h-8 w-8 cursor-pointer rounded border border-zinc-200 bg-transparent dark:border-zinc-700"
                              />
                              <Input
                                id={`token-${key}`}
                                value={value}
                                onChange={(e) =>
                                  setTokens((prev) => ({ ...prev, [key]: e.target.value }))
                                }
                                onBlur={(e) =>
                                  setTokens((prev) => ({ ...prev, [key]: normalizeHex(e.target.value) }))
                                }
                                className="h-8 font-mono text-base sm:text-xs"
                                placeholder="#000000"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>
                            Default:{" "}
                            <span className="font-mono">{data?.defaults[key] || "—"}</span>
                          </span>
                          {isDirty && data?.defaults[key] ? (
                            <button
                              onClick={() => resetToken(key)}
                              className="font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                            >
                              Reset
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}

          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40">
            Tip: setelah simpan, lakukan hard refresh (Ctrl+Shift+R) untuk melihat perubahan di halaman publik.
            Token ini di-inject sebagai CSS variables di <code className="font-mono">&lt;head&gt;</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
