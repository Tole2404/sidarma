"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Scissors, Trash2, TrendingUp, Layers, AlertCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import type { BongkaranRecord, BongkaranSortRecord, BongkaranStatusValue } from "@/lib/bongkaran-serializers";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const STATUS_LABEL: Record<BongkaranStatusValue, { label: string; cls: string }> = {
  PENDING_SORT: { label: "Menunggu Sortir", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "Sebagian", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  SORTED: { label: "Selesai", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Dibatalkan", cls: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export default function BongkaranDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [bongkaran, setBongkaran] = useState<BongkaranRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortForm, setSortForm] = useState({
    sortDate: new Date().toISOString().slice(0, 10),
    inputKg: "",
    outputPutihKg: "",
    outputWarnaKg: "",
    laborExpense: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!id) return;
    try {
      const data = await fetchJson<BongkaranRecord>(`/api/bongkaran/${id}`);
      setBongkaran(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me");
        if (!r.ok) {
          router.push("/portal-admin");
          return;
        }
        const { user } = (await r.json()) as { user: SessionUser };
        setUser(user);
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [router, id]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal-admin");
    router.refresh();
  };

  const sortPreview = useMemo(() => {
    const inp = parseFloat(sortForm.inputKg) || 0;
    const putih = parseFloat(sortForm.outputPutihKg) || 0;
    const warna = parseFloat(sortForm.outputWarnaKg) || 0;
    const labor = parseFloat(sortForm.laborExpense) || 0;
    const waste = Math.max(0, inp - putih - warna);
    const totalOutput = putih + warna;
    const costPerKg = bongkaran?.costPerKgEffective ?? 0;
    const inputCost = inp * costPerKg + labor;
    const costPutih = totalOutput > 0 ? (inputCost * putih) / totalOutput : 0;
    const costWarna = inputCost - costPutih;
    const unitCostPutih = putih > 0 ? costPutih / putih : 0;
    const unitCostWarna = warna > 0 ? costWarna / warna : 0;
    const yieldPercent = inp > 0 ? ((putih + warna) / inp) * 100 : 0;
    return { inp, putih, warna, waste, inputCost, unitCostPutih, unitCostWarna, yieldPercent };
  }, [sortForm, bongkaran]);

  const validSort = useMemo(() => {
    if (!bongkaran) return false;
    if (sortPreview.inp <= 0) return false;
    if (sortPreview.inp > bongkaran.remainingKg) return false;
    if (sortPreview.putih + sortPreview.warna > sortPreview.inp) return false;
    if (sortPreview.putih + sortPreview.warna <= 0) return false;
    return true;
  }, [bongkaran, sortPreview]);

  const openSort = () => {
    if (!bongkaran) return;
    setSortForm({
      sortDate: new Date().toISOString().slice(0, 10),
      inputKg: String(bongkaran.remainingKg),
      outputPutihKg: "",
      outputWarnaKg: "",
      laborExpense: "",
      notes: "",
    });
    setError(null);
    setSortOpen(true);
  };

  const handleSubmitSort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bongkaran) return;
    setSubmitting(true);
    setError(null);
    try {
      await fetchJson(`/api/bongkaran/${bongkaran.id}/sort`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sortDate: sortForm.sortDate,
          inputKg: Number(sortForm.inputKg) || 0,
          outputPutihKg: Number(sortForm.outputPutihKg) || 0,
          outputWarnaKg: Number(sortForm.outputWarnaKg) || 0,
          laborExpense: Number(sortForm.laborExpense) || 0,
          notes: sortForm.notes,
        }),
      });
      setSortOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan sortir");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!bongkaran) return;
    if (!confirm("Hapus batch sortir ini? Stok majun yang sudah masuk akan dikembalikan.")) return;
    try {
      await fetchJson(`/api/bongkaran/${bongkaran.id}/sort/${batchId}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus");
    }
  };

  const renderSummary = () => {
    if (!bongkaran) return null;
    const status = STATUS_LABEL[bongkaran.status];
    const pct = bongkaran.quantityKg > 0
      ? Math.min(100, Math.round((bongkaran.sortedQuantityKg / bongkaran.quantityKg) * 100))
      : 0;
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardDescription>Konveksi</CardDescription>
              <CardTitle className="text-xl">{bongkaran.konveksiName}</CardTitle>
              <p className="mt-1 text-sm text-zinc-500">{formatDate(bongkaran.purchaseDate)}</p>
            </div>
            <Badge variant="secondary" className={`${status.cls} border`}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-sm">
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-500">Quantity</p>
              <p className="font-mono text-base font-semibold">{bongkaran.quantityKg.toLocaleString("id-ID")} kg</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-500">Total Cost</p>
              <p className="font-mono text-base font-semibold">{formatCurrency(bongkaran.totalCost)}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-500">HPP per kg</p>
              <p className="font-mono text-base font-semibold text-emerald-600">{formatCurrency(bongkaran.costPerKgEffective)}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="text-xs text-zinc-500">Sisa Belum Sortir</p>
              <p className="font-mono text-base font-semibold">{bongkaran.remainingKg.toLocaleString("id-ID")} kg</p>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
              <span>Progress sortir</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {bongkaran.sortedQuantityKg.toLocaleString("id-ID")} / {bongkaran.quantityKg.toLocaleString("id-ID")} kg
            </p>
          </div>
          {bongkaran.notes ? (
            <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
              {bongkaran.notes}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        user={user ? { name: user.name, email: user.email, role: user.role } : null}
        onLogout={handleLogout}
      />
      <main className="admin-main max-w-6xl">
        <div className="space-y-6">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/bongkaran">
              <ArrowLeft className="h-4 w-4" /> Kembali ke daftar
            </Link>
          </Button>

          <PageHeader
            eyebrow="Operasional"
            title="Detail Bongkaran"
            description="Kelola proses sortir bongkaran menjadi majun putih dan warna."
            action={
              bongkaran && bongkaran.remainingKg > 0 && bongkaran.status !== "CANCELLED" ? (
                <Button onClick={openSort} className="gap-2">
                  <Scissors className="h-4 w-4" /> Sortir Batch Baru
                </Button>
              ) : null
            }
          />

          {loading || !bongkaran ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              {renderSummary()}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Riwayat Sortir
                  </CardTitle>
                  <CardDescription>
                    {bongkaran.sorts?.length ?? 0} batch — total{" "}
                    <span className="font-medium text-zinc-700 dark:text-zinc-200">
                      {bongkaran.sortedQuantityKg.toLocaleString("id-ID")} kg
                    </span>{" "}
                    sudah disortir.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!bongkaran.sorts || bongkaran.sorts.length === 0 ? (
                    <div className="py-12 text-center">
                      <Scissors className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
                      <p className="text-sm text-zinc-400">Belum ada batch sortir.</p>
                      {bongkaran.status !== "CANCELLED" && bongkaran.remainingKg > 0 ? (
                        <Button onClick={openSort} variant="outline" size="sm" className="mt-3 gap-2">
                          <Plus className="h-4 w-4" /> Sortir Sekarang
                        </Button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bongkaran.sorts.map((s: BongkaranSortRecord) => (
                        <div
                          key={s.id}
                          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">
                                {formatDate(s.sortDate)}
                              </p>
                              <p className="mt-0.5 text-xs text-zinc-400">
                                Yield {s.yieldPercent.toFixed(1)}% — Total cost {formatCurrency(s.totalCost)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              onClick={() => handleDeleteBatch(s.id)}
                              title="Reverse batch"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-3 grid gap-2 sm:grid-cols-4 text-sm">
                            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/40">
                              <p className="text-xs text-zinc-500">Input</p>
                              <p className="font-mono">{s.inputKg.toLocaleString("id-ID")} kg</p>
                            </div>
                            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/40">
                              <p className="text-xs text-zinc-500">Putih</p>
                              <p className="font-mono">
                                {s.outputPutihKg.toLocaleString("id-ID")} kg
                                <span className="ml-1 text-[11px] text-emerald-600">@{formatCurrency(s.unitCostPutih)}</span>
                              </p>
                            </div>
                            <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/40">
                              <p className="text-xs text-zinc-500">Warna</p>
                              <p className="font-mono">
                                {s.outputWarnaKg.toLocaleString("id-ID")} kg
                                <span className="ml-1 text-[11px] text-emerald-600">@{formatCurrency(s.unitCostWarna)}</span>
                              </p>
                            </div>
                            <div className="rounded-lg bg-rose-50 p-2 dark:bg-rose-950/30">
                              <p className="text-xs text-rose-600">Waste</p>
                              <p className="font-mono">{s.wasteKg.toLocaleString("id-ID")} kg</p>
                            </div>
                          </div>
                          {s.notes ? <p className="mt-3 text-xs text-zinc-500">{s.notes}</p> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Dialog open={sortOpen} onOpenChange={setSortOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sortir Batch Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitSort} className="space-y-4">
            {error ? (
              <div className="flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="sortDate">Tanggal *</Label>
                <Input
                  id="sortDate"
                  type="date"
                  required
                  value={sortForm.sortDate}
                  onChange={(e) => setSortForm((f) => ({ ...f, sortDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inputKg">Input (kg) — sisa {bongkaran?.remainingKg.toLocaleString("id-ID")} kg</Label>
                <Input
                  id="inputKg"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={sortForm.inputKg}
                  onChange={(e) => setSortForm((f) => ({ ...f, inputKg: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="outputPutihKg">Output Putih (kg)</Label>
                <Input
                  id="outputPutihKg"
                  type="number"
                  min="0"
                  step="0.01"
                  value={sortForm.outputPutihKg}
                  onChange={(e) => setSortForm((f) => ({ ...f, outputPutihKg: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="outputWarnaKg">Output Warna (kg)</Label>
                <Input
                  id="outputWarnaKg"
                  type="number"
                  min="0"
                  step="0.01"
                  value={sortForm.outputWarnaKg}
                  onChange={(e) => setSortForm((f) => ({ ...f, outputWarnaKg: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Waste (auto)</Label>
                <Input value={sortPreview.waste.toFixed(2)} readOnly className="bg-zinc-50 dark:bg-zinc-900/40" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="laborExpense">Upah Sortir (opsional)</Label>
              <Input
                id="laborExpense"
                type="number"
                min="0"
                step="1"
                value={sortForm.laborExpense}
                onChange={(e) => setSortForm((f) => ({ ...f, laborExpense: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                rows={2}
                value={sortForm.notes}
                onChange={(e) => setSortForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-500">
                <TrendingUp className="h-3.5 w-3.5" /> Preview Alokasi HPP
              </p>
              <div className="grid gap-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total cost batch</span>
                  <span className="font-mono">{formatCurrency(sortPreview.inputCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Yield</span>
                  <span className="font-mono">{sortPreview.yieldPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">HPP/kg Putih</span>
                  <span className="font-mono text-emerald-600">{formatCurrency(sortPreview.unitCostPutih)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">HPP/kg Warna</span>
                  <span className="font-mono text-emerald-600">{formatCurrency(sortPreview.unitCostWarna)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSortOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting || !validSort}>
                {submitting ? "Menyimpan..." : "Simpan Sortir"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
