"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency } from "@/lib/format";
import { BalePriceRecord } from "@/lib/majun-types";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  clothType: "PUTIH",
  grade: "A1",
  pricePerKg: "",
  notes: "",
};

export default function BalePricesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<BalePriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("grade");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    async function loadData() {
      try {
        const userResponse = await fetch("/api/auth/me");

        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const { user } = (await userResponse.json()) as { user: SessionUser };
        setUser(user);

        const data = await fetchJson<BalePriceRecord[]>("/api/bale-prices");
        setItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const filteredItems = items.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const typeLabel = item.clothType === "PUTIH" ? "kain putih" : "kain warna";
    return typeLabel.includes(searchLower) ||
           item.grade.toLowerCase().includes(searchLower) ||
           (item.notes || "").toLowerCase().includes(searchLower);
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "grade") {
      comparison = a.grade.localeCompare(b.grade);
    } else if (sortBy === "price") {
      comparison = a.pricePerBal - b.pricePerBal;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditDialog = (item: BalePriceRecord) => {
    setEditingId(item.id);
    setForm({
      clothType: item.clothType,
      grade: item.grade,
      pricePerKg: String(Number((item.pricePerBal / 100).toFixed(2))),
      notes: item.notes ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        clothType: form.clothType,
        grade: form.grade,
        pricePerBal: Number(form.pricePerKg) * 100,
        notes: form.notes,
      };

      const item = await fetchJson<BalePriceRecord>(editingId ? `/api/bale-prices/${editingId}` : "/api/bale-prices", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setItems((current) => {
        if (editingId) {
          return current
            .map((existing) => (existing.id === editingId ? item : existing))
            .sort((a, b) => `${a.clothType}-${a.grade}`.localeCompare(`${b.clothType}-${b.grade}`));
        }

        return [...current, item].sort((a, b) => `${a.clothType}-${a.grade}`.localeCompare(`${b.clothType}-${b.grade}`));
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan harga bal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data harga bal ini?")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/bale-prices/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus harga bal.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="admin-main max-w-6xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="admin-main max-w-6xl">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Master harga"
            title="Harga Jual Kain Bal"
            description="Daftar patokan harga jual kain per kilo berdasarkan jenis kain dan grade kualitas (A1, B2, C3)."
            action={
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Tambah harga
              </Button>
            }
          />

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-zinc-900">Daftar Harga Jual Per Kilo</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-500">
                      Referensi patokan harga jual kain majun untuk customer.
                    </CardDescription>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Jenis/Grade</label>
                    <Input
                      placeholder="Cari jenis/grade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 text-xs"
                    />
                  </div>

                  {/* Sorting controls */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Urutkan Berdasarkan</label>
                    <div className="flex gap-1.5">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 h-9 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-300 focus:outline-none"
                      >
                        <option value="grade">Grade Kain</option>
                        <option value="price">Harga Jual</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="flex items-center justify-center h-9 w-9 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 shadow-sm transition-colors"
                        title={sortOrder === "asc" ? "Urutan Naik" : "Urutan Turun"}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {/* Mobile */}
              <div className="md:hidden space-y-2 px-4 pb-4">
                {paginatedItems.length ? (
                  paginatedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {item.clothType === "PUTIH" ? "Kain Putih" : "Kain Warna"} • {item.grade}
                        </p>
                        <p className="text-xs text-zinc-500">{item.notes || "-"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-950">{formatCurrency(Number((item.pricePerBal / 100).toFixed(2)))}</p>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada master harga bal.</div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Jenis kain</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Harga jual per kilo</TableHead>
                      <TableHead>Catatan</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length ? (
                      paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="px-6 font-medium text-zinc-900 text-sm">
                            {item.clothType === "PUTIH" ? "Kain Putih" : "Kain Warna"}
                          </TableCell>
                          <TableCell className="text-sm">{item.grade}</TableCell>
                          <TableCell className="text-sm">{formatCurrency(Number((item.pricePerBal / 100).toFixed(2)))}</TableCell>
                          <TableCell className="text-sm">{item.notes || "-"}</TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit harga bal</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus harga bal</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={5} className="px-6 py-12 text-center text-zinc-500">Belum ada master harga bal.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit harga jual kain bal" : "Tambah harga jual kain bal"}</DialogTitle>
            <DialogDescription>
              Atur patokan harga jual berdasarkan jenis kain dan grade kualitas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="bale-cloth-type">Jenis kain</Label>
                <Select
                  id="bale-cloth-type"
                  value={form.clothType}
                  onChange={(event) => setForm((current) => ({ ...current, clothType: event.target.value }))}
                  required
                >
                  <option value="PUTIH">Kain Putih</option>
                  <option value="WARNA">Kain Warna</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bale-grade">Grade</Label>
                <Input
                  id="bale-grade"
                  value={form.grade}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, grade: event.target.value.toUpperCase() }))
                  }
                  placeholder="Contoh: A1"
                  maxLength={10}
                  required
                />
              </div>
            </div>

              <div className="space-y-2">
                <Label htmlFor="bale-price">Harga jual per kilo (Rp)</Label>
                <CurrencyInput
                  id="bale-price"
                  value={form.pricePerKg}
                  onValueChange={(value) => setForm((current) => ({ ...current, pricePerKg: value }))}
                  placeholder="Rp 9.500"
                  required
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bale-notes">Catatan</Label>
              <Textarea
                id="bale-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Contoh: Grade premium"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
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