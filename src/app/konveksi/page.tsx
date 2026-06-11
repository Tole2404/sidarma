"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Building2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import type { KonveksiRecord } from "@/lib/bongkaran-serializers";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  name: "",
  picName: "",
  phone: "",
  address: "",
  notes: "",
};

export default function KonveksiPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [konveksis, setKonveksis] = useState<KonveksiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const data = await fetchJson<KonveksiRecord[]>("/api/konveksi");
      setKonveksis(data);
    } catch (e) {
      console.error(e);
    }
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

  const filtered = konveksis.filter((k) =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    (k.picName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  };

  const openEdit = (k: KonveksiRecord) => {
    setEditingId(k.id);
    setForm({
      name: k.name,
      picName: k.picName ?? "",
      phone: k.phone ?? "",
      address: k.address ?? "",
      notes: k.notes ?? "",
    });
    setError(null);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const url = editingId ? `/api/konveksi/${editingId}` : "/api/konveksi";
      const method = editingId ? "PATCH" : "POST";
      await fetchJson(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!confirm("Hapus konveksi ini?")) return;
    try {
      await fetchJson(`/api/konveksi/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Gagal menghapus");
    }
  };

  const totals = {
    count: konveksis.length,
    qty: konveksis.reduce((s, k) => s + k.totalQuantityKg, 0),
    spending: konveksis.reduce((s, k) => s + k.totalSpending, 0),
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        user={user ? { name: user.name, email: user.email, role: user.role } : null}
        onLogout={handleLogout}
      />
      <main className="admin-main max-w-6xl">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Master Data"
            title="Konveksi"
            description="Kelola data konveksi/garment yang menjadi sumber bongkaran kain."
            action={
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" /> Tambah Konveksi
              </Button>
            }
          />

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Konveksi</CardDescription>
                <CardTitle className="text-2xl">{totals.count}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Bongkaran Masuk</CardDescription>
                <CardTitle className="text-2xl">{totals.qty.toLocaleString("id-ID")} kg</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Spending</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(totals.spending)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Daftar Konveksi</CardTitle>
                <CardDescription>Klik baris untuk edit, atau hapus jika belum ada transaksi.</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <Input
                  className="pl-9"
                  placeholder="Cari nama / PIC..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <Building2 className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
                  <p className="text-sm text-zinc-400">Belum ada data konveksi.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>PIC</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead className="text-right">Transaksi</TableHead>
                        <TableHead className="text-right">Total Kg</TableHead>
                        <TableHead className="text-right">Spending</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((k) => (
                        <TableRow key={k.id}>
                          <TableCell>
                            <div className="font-medium text-zinc-950 dark:text-zinc-100">{k.name}</div>
                            {k.address ? (
                              <div className="text-xs text-zinc-500">{k.address}</div>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">{k.picName ?? "—"}</TableCell>
                          <TableCell className="text-sm text-zinc-600 dark:text-zinc-300">{k.phone ?? "—"}</TableCell>
                          <TableCell className="text-right">{k.bongkaranCount}</TableCell>
                          <TableCell className="text-right">{k.totalQuantityKg.toLocaleString("id-ID")}</TableCell>
                          <TableCell className="text-right">{formatCurrency(k.totalSpending)}</TableCell>
                          <TableCell>
                            <Badge variant={k.isActive ? "default" : "secondary"}>
                              {k.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => openEdit(k)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => handleDelete(k.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
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
            <DialogTitle>{editingId ? "Edit Konveksi" : "Tambah Konveksi"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Konveksi *</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="picName">Nama PIC</Label>
                <Input
                  id="picName"
                  value={form.picName}
                  onChange={(e) => setForm((f) => ({ ...f, picName: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                rows={2}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
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
