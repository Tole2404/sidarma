"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Scissors, PackageOpen, Search, ChevronRight, Layers } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import type { BongkaranRecord, KonveksiRecord, BongkaranStatusValue } from "@/lib/bongkaran-serializers";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  konveksiId: "",
  purchaseDate: todayIso(),
  quantityKg: "",
  pricePerKg: "",
  transportExpense: "",
  additionalExpense: "",
  notes: "",
};

const STATUS_LABEL: Record<BongkaranStatusValue, { label: string; cls: string }> = {
  PENDING_SORT: { label: "Menunggu Sortir", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "Sebagian", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  SORTED: { label: "Selesai", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Dibatalkan", cls: "bg-zinc-100 text-zinc-600 border-zinc-200" },
};

export default function BongkaranPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<BongkaranRecord[]>([]);
  const [konveksis, setKonveksis] = useState<KonveksiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    const [b, k] = await Promise.all([
      fetchJson<BongkaranRecord[]>("/api/bongkaran").catch(() => []),
      fetchJson<KonveksiRecord[]>("/api/konveksi").catch(() => []),
    ]);
    setItems(b);
    setKonveksis(k);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/me");
        if (!r.ok) {
          router.push("/login");
          return;
        }
        const { user } = (await r.json()) as { user: SessionUser };
        setUser(user);
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const filtered = items.filter((it) =>
    it.konveksiName.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    let pendingKg = 0;
    let pendingCount = 0;
    let monthQty = 0;
    let monthValue = 0;
    let totalRemaining = 0;

    for (const it of items) {
      totalRemaining += it.remainingKg;
      if (it.status !== "SORTED" && it.status !== "CANCELLED") {
        pendingKg += it.remainingKg;
        pendingCount += 1;
      }
      if (new Date(it.purchaseDate) >= monthStart) {
        monthQty += it.quantityKg;
        monthValue += it.totalCost;
      }
    }
    return { pendingKg, pendingCount, monthQty, monthValue, totalRemaining };
  }, [items]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, konveksiId: konveksis[0]?.id ?? "" });
    setError(null);
    setOpen(true);
  };

  const openEdit = (b: BongkaranRecord) => {
    if (b.status !== "PENDING_SORT" || b.sortedQuantityKg > 0) {
      alert("Bongkaran sudah disortir, tidak bisa diedit. Hapus batch sortir dulu jika perlu.");
      return;
    }
    setEditingId(b.id);
    setForm({
      konveksiId: b.konveksiId,
      purchaseDate: b.purchaseDate.slice(0, 10),
      quantityKg: String(b.quantityKg),
      pricePerKg: String(b.pricePerKg),
      transportExpense: String(b.transportExpense),
      additionalExpense: String(b.additionalExpense),
      notes: b.notes ?? "",
    });
    setError(null);
    setOpen(true);
  };

  const livePreview = useMemo(() => {
    const qty = parseFloat(form.quantityKg) || 0;
    const price = parseFloat(form.pricePerKg) || 0;
    const transport = parseFloat(form.transportExpense) || 0;
    const additional = parseFloat(form.additionalExpense) || 0;
    const subtotal = qty * price;
    const totalCost = subtotal + transport + additional;
    const costPerKg = qty > 0 ? totalCost / qty : 0;
    return { subtotal, totalCost, costPerKg };
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const url = editingId ? `/api/bongkaran/${editingId}` : "/api/bongkaran";
      const method = editingId ? "PATCH" : "POST";
      await fetchJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantityKg: Number(form.quantityKg) || 0,
          pricePerKg: Number(form.pricePerKg) || 0,
          transportExpense: Number(form.transportExpense) || 0,
          additionalExpense: Number(form.additionalExpense) || 0,
        }),
      });
      setOpen(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus transaksi bongkaran ini?")) return;
    try {
      await fetchJson(`/api/bongkaran/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        user={user ? { name: user.name, email: user.email, role: user.role } : null}
        onLogout={handleLogout}
      />
      <main className="admin-main max-w-7xl">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Operasional"
            title="Bongkaran Kain"
            description="Catat pembelian kain bongkaran dari konveksi sebelum disortir menjadi majun."
            action={
              <Button onClick={openCreate} className="gap-2" disabled={konveksis.length === 0}>
                <Plus className="h-4 w-4" /> Tambah Bongkaran
              </Button>
            }
          />

          {konveksis.length === 0 && !loading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-zinc-500">
                  Belum ada konveksi terdaftar.{" "}
                  <Link href="/konveksi" className="font-medium text-zinc-950 underline dark:text-zinc-100">
                    Tambah konveksi dulu
                  </Link>{" "}
                  sebelum bisa input bongkaran.
                </p>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sisa Belum Sortir</CardDescription>
                <CardTitle className="text-2xl">{stats.totalRemaining.toLocaleString("id-ID")} kg</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Sortir</CardDescription>
                <CardTitle className="text-2xl">{stats.pendingCount}</CardTitle>
                <p className="text-xs text-zinc-500">{stats.pendingKg.toLocaleString("id-ID")} kg menunggu</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Bulan Ini (Kg)</CardDescription>
                <CardTitle className="text-2xl">{stats.monthQty.toLocaleString("id-ID")} kg</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Bulan Ini (Rp)</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(stats.monthValue)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Transaksi Bongkaran</CardTitle>
                <CardDescription>Klik baris untuk masuk ke proses sortir.</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  className="pl-9"
                  placeholder="Cari konveksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <PackageOpen className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
                  <p className="text-sm text-zinc-400">Belum ada transaksi bongkaran.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Konveksi</TableHead>
                        <TableHead className="text-right">Qty (kg)</TableHead>
                        <TableHead className="text-right">Harga/kg</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Progress Sortir</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((b) => {
                        const pct = b.quantityKg > 0
                          ? Math.min(100, Math.round((b.sortedQuantityKg / b.quantityKg) * 100))
                          : 0;
                        const status = STATUS_LABEL[b.status];
                        return (
                          <TableRow key={b.id}>
                            <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">{formatDate(b.purchaseDate)}</TableCell>
                            <TableCell>
                              <div className="font-medium text-zinc-950 dark:text-zinc-100">{b.konveksiName}</div>
                              {b.notes ? (
                                <div className="text-xs text-zinc-500 line-clamp-1">{b.notes}</div>
                              ) : null}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {b.quantityKg.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {formatCurrency(b.pricePerKg)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-sm font-semibold">
                              {formatCurrency(b.totalCost)}
                            </TableCell>
                            <TableCell className="min-w-[160px]">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                  <div
                                    className="h-full rounded-full bg-emerald-500 transition-all"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500 tabular-nums">{pct}%</span>
                              </div>
                              <p className="mt-0.5 text-[11px] text-zinc-400">
                                {b.sortedQuantityKg.toLocaleString("id-ID")} / {b.quantityKg.toLocaleString("id-ID")} kg
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className={`${status.cls} border`}>
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button asChild variant="ghost" size="icon" title="Sortir">
                                  <Link href={`/bongkaran/${b.id}`}>
                                    <Scissors className="h-4 w-4" />
                                  </Link>
                                </Button>
                                {b.status === "PENDING_SORT" && b.sortedQuantityKg === 0 ? (
                                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)} title="Edit">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                ) : null}
                                {b.sortedQuantityKg === 0 ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                    onClick={() => handleDelete(b.id)}
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                ) : null}
                                <Button asChild variant="ghost" size="icon" title="Detail">
                                  <Link href={`/bongkaran/${b.id}`}>
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Bongkaran" : "Tambah Bongkaran"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="konveksiId">Konveksi *</Label>
                <Select
                  id="konveksiId"
                  required
                  value={form.konveksiId}
                  onChange={(e) => setForm((f) => ({ ...f, konveksiId: e.target.value }))}
                >
                  <option value="" disabled>Pilih konveksi</option>
                  {konveksis.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purchaseDate">Tanggal *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  required
                  value={form.purchaseDate}
                  onChange={(e) => setForm((f) => ({ ...f, purchaseDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="quantityKg">Quantity (kg) *</Label>
                <Input
                  id="quantityKg"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.quantityKg}
                  onChange={(e) => setForm((f) => ({ ...f, quantityKg: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pricePerKg">Harga per Kg *</Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={form.pricePerKg}
                  onChange={(e) => setForm((f) => ({ ...f, pricePerKg: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="transportExpense">Ongkos Angkut</Label>
                <Input
                  id="transportExpense"
                  type="number"
                  min="0"
                  step="1"
                  value={form.transportExpense}
                  onChange={(e) => setForm((f) => ({ ...f, transportExpense: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="additionalExpense">Biaya Tambahan</Label>
                <Input
                  id="additionalExpense"
                  type="number"
                  min="0"
                  step="1"
                  value={form.additionalExpense}
                  onChange={(e) => setForm((f) => ({ ...f, additionalExpense: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-mono">{formatCurrency(livePreview.subtotal)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-zinc-500">Total Cost</span>
                <span className="font-mono font-semibold">{formatCurrency(livePreview.totalCost)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-zinc-500">HPP per kg (efektif)</span>
                <span className="font-mono text-emerald-600">{formatCurrency(livePreview.costPerKg)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
