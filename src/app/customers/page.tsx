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
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency } from "@/lib/format";
import { BalePriceRecord, CustomerRecord } from "@/lib/majun-types";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  storeName: "",
  ownerName: "",
  phone: "",
  address: "",
  notes: "",
  preferredBalePriceId: "",
};

export default function CustomersPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [balePrices, setBalePrices] = useState<BalePriceRecord[]>([]);
  const [balePriceError, setBalePriceError] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("storeName");
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
          router.push("/portal-admin");
          return;
        }

        const { user } = (await userResponse.json()) as { user: SessionUser };
        setUser(user);

        const customersData = await fetchJson<CustomerRecord[]>("/api/customers");
        setCustomers(customersData);

        try {
          const balePricesData = await fetchJson<BalePriceRecord[]>("/api/bale-prices");
          setBalePrices(balePricesData);
          setBalePriceError("");
        } catch (error) {
          const message = error instanceof Error ? error.message : "Gagal memuat master harga bal.";
          setBalePrices([]);
          setBalePriceError(message);
        }
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
    router.push("/portal-admin");
    router.refresh();
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchQuery.toLowerCase();
    return customer.storeName.toLowerCase().includes(searchLower) ||
           (customer.ownerName || "").toLowerCase().includes(searchLower);
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "storeName") {
      comparison = a.storeName.localeCompare(b.storeName);
    } else if (sortBy === "ownerName") {
      comparison = (a.ownerName || "").localeCompare(b.ownerName || "");
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditDialog = (customer: CustomerRecord) => {
    setEditingId(customer.id);
    setForm({
      storeName: customer.storeName,
      ownerName: customer.ownerName ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      notes: customer.notes ?? "",
      preferredBalePriceId: customer.preferredBalePriceId ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        storeName: form.storeName,
        ownerName: form.ownerName,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        preferredBalePriceId: form.preferredBalePriceId,
      };

      const customer = await fetchJson<CustomerRecord>(
        editingId ? `/api/customers/${editingId}` : "/api/customers",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      setCustomers((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? customer : item));
        }

        return [...current, customer].sort((left, right) => left.storeName.localeCompare(right.storeName));
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan customer.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus customer ini?")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/customers/${id}`, { method: "DELETE" });
      setCustomers((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus customer.");
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
            eyebrow="Master customer"
            title="Customer"
            description="Simpan data toko pelanggan, histori penjualan, dan sisa piutang yang masih berjalan."
            action={
              <Button onClick={openCreateDialog} className="gap-2 w-full sm:w-auto h-9 px-3 text-xs sm:text-sm">
                <Plus className="h-4 w-4" />
                Tambah customer
              </Button>
            }
          />

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm md:text-base font-bold text-zinc-900">Daftar Customer</CardTitle>
                    <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">
                      Gunakan data customer untuk transaksi penjualan dan pemantauan piutang.
                    </CardDescription>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Customer</label>
                    <Input
                      placeholder="Cari nama toko/pemilik..."
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
                        <option value="storeName">Nama Toko</option>
                        <option value="ownerName">Pemilik</option>
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
                {paginatedCustomers.length ? (
                  paginatedCustomers.map((customer) => (
                    <div key={customer.id} className="rounded-lg border border-zinc-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-zinc-900 truncate">{customer.storeName}</p>
                          <p className="text-xs text-zinc-500 truncate">{customer.ownerName || "Pemilik belum dicatat"}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{customer.phone || "-"}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-semibold text-rose-700">{formatCurrency(customer.outstandingAmount)}</p>
                          <p className="text-xs text-zinc-500">{customer.saleCount} transaksi</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100">
                        <Button size="sm" variant="ghost" className="h-9 flex-1" onClick={() => openEditDialog(customer)}>
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Hapus
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada customer.</div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Toko</TableHead>
                      <TableHead>Kontak</TableHead>
                      <TableHead>Alamat</TableHead>
                      <TableHead>Tag harga/kg</TableHead>
                      <TableHead>Total penjualan</TableHead>
                      <TableHead>Piutang</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.length ? (
                      paginatedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="px-6">
                            <div className="font-medium text-zinc-900 text-sm">{customer.storeName}</div>
                            <div className="text-xs text-zinc-500">{customer.ownerName || "Pemilik belum dicatat"} • {customer.saleCount} transaksi</div>
                          </TableCell>
                          <TableCell className="text-sm">{customer.phone || "-"}</TableCell>
                          <TableCell className="max-w-[220px] truncate text-sm">{customer.address || "-"}</TableCell>
                          <TableCell className="text-sm">
                            {customer.preferredBalePriceLabel && customer.preferredBalePricePerKg !== null
                              ? `${customer.preferredBalePriceLabel} (${formatCurrency(customer.preferredBalePricePerKg)}/kg)`
                              : "-"}
                          </TableCell>
                          <TableCell className="text-sm">{formatCurrency(customer.totalSalesValue)}</TableCell>
                          <TableCell className="font-medium text-rose-700 text-sm">{formatCurrency(customer.outstandingAmount)}</TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit customer</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDelete(customer.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus customer</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={7} className="px-6 py-12 text-center text-zinc-500">Belum ada customer.</TableCell></TableRow>
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
            <DialogTitle>{editingId ? "Edit customer" : "Tambah customer"}</DialogTitle>
            <DialogDescription>
              Simpan data toko pelanggan untuk penjualan dan monitoring pembayaran.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-store">Nama toko</Label>
              <Input
                id="customer-store"
                value={form.storeName}
                onChange={(event) => setForm((current) => ({ ...current, storeName: event.target.value }))}
                placeholder="Contoh: Toko Berkah Jaya"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-owner">Nama pemilik</Label>
                <Input
                  id="customer-owner"
                  value={form.ownerName}
                  onChange={(event) => setForm((current) => ({ ...current, ownerName: event.target.value }))}
                  placeholder="Nama pemilik toko"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone">Nomor kontak</Label>
                <Input
                  id="customer-phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-address">Alamat</Label>
              <Input
                id="customer-address"
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                placeholder="Alamat toko"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-bale-price">Tag harga bal / kg</Label>
              <Select
                id="customer-bale-price"
                value={form.preferredBalePriceId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, preferredBalePriceId: event.target.value }))
                }
              >
                <option value="">Tanpa tag harga</option>
                {balePrices.map((item) => {
                  const pricePerKg = Number((item.pricePerBal / 100).toFixed(2));
                  const label = `${item.clothType === "PUTIH" ? "Kain Putih" : "Kain Warna"} ${item.grade}`;
                  return (
                    <option key={item.id} value={item.id}>
                      {label} - {formatCurrency(pricePerKg)}/kg
                    </option>
                  );
                })}
              </Select>
              <p className="text-xs text-zinc-500">
                Perhitungan awal per kg diturunkan dari harga per bal / 100.
              </p>
              {balePriceError ? (
                <p className="text-xs text-rose-600">
                  Master harga bal belum termuat: {balePriceError}
                </p>
              ) : null}
              {!balePriceError && balePrices.length === 0 ? (
                <p className="text-xs text-amber-600">
                  Belum ada opsi harga bal. Cek data di menu Harga Bal.
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-notes">Catatan</Label>
              <Textarea
                id="customer-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Catatan tambahan"
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
