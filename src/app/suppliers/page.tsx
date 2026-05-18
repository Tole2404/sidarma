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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency } from "@/lib/format";
import { SupplierRecord } from "@/lib/majun-types";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  notes: "",
};

export default function SuppliersPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
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

        const suppliersData = await fetchJson<SupplierRecord[]>("/api/suppliers");
        setSuppliers(suppliersData);
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

  const filteredSuppliers = suppliers.filter((supplier) => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedSuppliers.length / ITEMS_PER_PAGE);
  const paginatedSuppliers = sortedSuppliers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditDialog = (supplier: SupplierRecord) => {
    setEditingId(supplier.id);
    setForm({
      name: supplier.name,
      phone: supplier.phone ?? "",
      address: supplier.address ?? "",
      notes: supplier.notes ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
      };

      const supplier = await fetchJson<SupplierRecord>(
        editingId ? `/api/suppliers/${editingId}` : "/api/suppliers",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      setSuppliers((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? supplier : item));
        }

        return [...current, supplier].sort((left, right) => left.name.localeCompare(right.name));
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan supplier.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus supplier ini?")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/suppliers/${id}`, { method: "DELETE" });
      setSuppliers((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus supplier.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="admin-main max-w-6xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
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
            eyebrow="Master supplier"
            title="Supplier"
            description="Kelola pemasok kain majun beserta kontak dan histori pembeliannya."
            action={
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Tambah supplier
              </Button>
            }
          />

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-zinc-900">Daftar Supplier</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-500">
                      Data supplier dipakai langsung saat membuat pembelian baru.
                    </CardDescription>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Supplier</label>
                    <Input
                      placeholder="Cari nama supplier..."
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
                        <option value="name">Nama Supplier</option>
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
              <div className="md:hidden space-y-3 px-4 pb-4">
                {paginatedSuppliers.length ? (
                  paginatedSuppliers.map((supplier) => (
                    <div key={supplier.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-900 truncate">{supplier.name}</p>
                          <p className="text-xs text-zinc-500">{supplier.purchaseCount} transaksi pembelian</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{supplier.phone || "-"}</p>
                        </div>
                        <p className="text-sm font-semibold text-blue-700 flex-shrink-0">{formatCurrency(supplier.totalPurchaseValue)}</p>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100">
                        <Button size="sm" variant="ghost" className="h-9 flex-1" onClick={() => openEditDialog(supplier)}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDelete(supplier.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada supplier.</div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Supplier</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Total pembelian</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSuppliers.length ? (
                      paginatedSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="px-6">
                            <div className="font-medium text-zinc-900 text-sm">{supplier.name}</div>
                            <div className="text-xs text-zinc-500">{supplier.purchaseCount} transaksi pembelian</div>
                          </TableCell>
                          <TableCell className="text-sm">{supplier.phone || "-"}</TableCell>
                          <TableCell className="max-w-[220px] truncate text-sm">{supplier.address || "-"}</TableCell>
                          <TableCell className="text-sm">{formatCurrency(supplier.totalPurchaseValue)}</TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(supplier)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit supplier</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDelete(supplier.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus supplier</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={5} className="px-6 py-12 text-center text-zinc-500">Belum ada supplier.</TableCell></TableRow>
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
            <DialogTitle>{editingId ? "Edit supplier" : "Tambah supplier"}</DialogTitle>
            <DialogDescription>
              Simpan data kontak supplier agar proses pembelian lebih cepat.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Nama supplier</Label>
              <Input
                id="supplier-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Contoh: CV Sumber Majun"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier-phone">Nomor kontak</Label>
                <Input
                  id="supplier-phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier-address">Alamat singkat</Label>
                <Input
                  id="supplier-address"
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  placeholder="Kota / area supplier"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier-notes">Catatan</Label>
              <Textarea
                id="supplier-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Catatan tambahan supplier"
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
