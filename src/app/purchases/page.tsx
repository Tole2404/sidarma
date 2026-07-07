"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, ArrowUpDown, Printer, FileText } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/format";
import { ProductOption, PurchaseRecord, SupplierRecord } from "@/lib/majun-types";
import MobileTransactionCard from "@/components/MobileTransactionCard";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  supplierId: "",
  productId: "",
  purchaseDate: new Date().toISOString().split("T")[0],
  quantityKg: "",
  pricePerKg: "",
  transportExpense: "",
  notes: "",
};

export default function PurchasesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewPurchase, setPreviewPurchase] = useState<PurchaseRecord | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const ITEMS_PER_PAGE = 15;

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    let stylesHtml = "";
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        let rules = "";
        for (const rule of Array.from(sheet.cssRules)) {
          rules += rule.cssText;
        }
        stylesHtml += `<style>${rules}</style>`;
      } catch (e) {
        if (sheet.href) {
          stylesHtml += `<link rel="stylesheet" href="${sheet.href}">`;
        }
      }
    }

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Cetak Nota</title>
          ${stylesHtml}
          <style>
            @media print {
              body {
                background: white !important;
                color: black !important;
                padding: 10px !important;
              }
            }
            body {
              font-family: system-ui, sans-serif;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <div>
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, startDate, endDate, sortBy, sortOrder]);

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

        const [purchasesData, suppliersData, productsData] = await Promise.all([
          fetchJson<PurchaseRecord[]>("/api/purchases"),
          fetchJson<SupplierRecord[]>("/api/suppliers"),
          fetchJson<ProductOption[]>("/api/products"),
        ]);

        setPurchases(purchasesData);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setForm((current) => ({
          ...current,
          supplierId: suppliersData[0]?.id ?? "",
          productId: productsData[0]?.id ?? "",
        }));
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

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          purchase.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const purchaseDateOnly = purchase.purchaseDate.split("T")[0];
    const matchesStartDate = startDate ? purchaseDateOnly >= startDate : true;
    const matchesEndDate = endDate ? purchaseDateOnly <= endDate : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
    } else if (sortBy === "amount") {
      comparison = a.totalExpense - b.totalExpense;
    } else if (sortBy === "quantity") {
      comparison = a.quantityKg - b.quantityKg;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPurchases = sortedPurchases.reduce((sum, item) => sum + item.totalExpense, 0);

  const totalPages = Math.ceil(sortedPurchases.length / ITEMS_PER_PAGE);
  const paginatedPurchases = sortedPurchases.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      supplierId: suppliers[0]?.id ?? "",
      productId: products[0]?.id ?? "",
    });
    setOpen(true);
  };

  const openEditDialog = (purchase: PurchaseRecord) => {
    setEditingId(purchase.id);
    setForm({
      supplierId: purchase.supplierId,
      productId: purchase.productId,
      purchaseDate: purchase.purchaseDate.split("T")[0],
      quantityKg: String(purchase.quantityKg),
      pricePerKg: String(purchase.pricePerKg),
      transportExpense: purchase.transportExpense ? String(purchase.transportExpense) : "",
      notes: purchase.notes ?? "",
    });
    setOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        supplierId: form.supplierId,
        productId: form.productId,
        purchaseDate: form.purchaseDate,
        quantityKg: Number(form.quantityKg),
        pricePerKg: Number(form.pricePerKg),
        transportExpense: Number(form.transportExpense || 0),
        notes: form.notes,
      };

      const purchase = await fetchJson<PurchaseRecord>(
        editingId ? `/api/purchases/${editingId}` : "/api/purchases",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      setPurchases((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? purchase : item));
        }

        return [purchase, ...current].sort(
          (left, right) => new Date(right.purchaseDate).getTime() - new Date(left.purchaseDate).getTime(),
        );
      });

      setOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan pembelian.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pembelian ini? Stok produk akan dihitung ulang.")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/purchases/${id}`, { method: "DELETE" });
      setPurchases((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus pembelian.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="admin-main max-w-7xl">
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

      <main className="admin-main max-w-7xl">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Stok masuk"
            title="Pembelian"
            description="Catat pembelian kain majun dari supplier. Setiap pembelian otomatis menambah stok dan menghitung HPP berjalan."
            action={
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap w-full sm:w-auto">
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-9 px-3" onClick={() => setReportDialogOpen(true)}>
                  <FileText className="h-4 w-4 text-zinc-500" />
                  Rekap Laporan
                </Button>
                <Button onClick={openCreateDialog} className="gap-2 flex-1 sm:flex-none text-xs sm:text-sm h-9 px-3">
                  <Plus className="h-4 w-4" />
                  Tambah pembelian
                </Button>
              </div>
            }
          />

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm md:text-base font-bold text-zinc-900">Daftar Pembelian</CardTitle>
                    <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">Riwayat pembelian produk majun dari seluruh supplier.</CardDescription>
                  </div>
                  <div className="text-sm font-medium text-zinc-600">
                    Total: <span className="text-zinc-950 font-semibold">{formatCurrency(totalPurchases)}</span>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Pembelian</label>
                    <Input
                      placeholder="Cari supplier/produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 text-xs"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Dari Tanggal</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-9 text-xs text-zinc-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Sampai Tanggal</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-9 text-xs text-zinc-600"
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
                        <option value="date">Tanggal</option>
                        <option value="amount">Total Nilai</option>
                        <option value="quantity">Jumlah (Kg)</option>
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
                {paginatedPurchases.length ? (
                  paginatedPurchases.map((purchase) => (
                    <MobileTransactionCard
                      key={purchase.id}
                      type="purchase"
                      title={purchase.supplierName}
                      subtitle={`${purchase.productName} · ${purchase.quantityKg.toFixed(1)} kg`}
                      amount={purchase.totalExpense}
                      date={formatDate(purchase.purchaseDate)}
                      onEdit={() => openEditDialog(purchase)}
                      onDelete={() => handleDelete(purchase.id)}
                      onPrint={() => {
                        setPreviewPurchase(purchase);
                        setPreviewDialogOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada pembelian.</div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Tanggal</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Harga/kg</TableHead>
                      <TableHead>Total biaya</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPurchases.length ? (
                      paginatedPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="px-6 text-sm">{formatDate(purchase.purchaseDate)}</TableCell>
                          <TableCell className="text-sm">{purchase.supplierName}</TableCell>
                          <TableCell className="text-sm">{purchase.productName}</TableCell>
                          <TableCell className="text-sm">{purchase.quantityKg.toFixed(2)} kg</TableCell>
                          <TableCell className="text-sm">{formatCurrency(purchase.pricePerKg)}</TableCell>
                          <TableCell className="font-medium text-blue-700 text-sm">{formatCurrency(purchase.totalExpense)}</TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setPreviewPurchase(purchase);
                                  setPreviewDialogOpen(true);
                                }}
                                title="Cetak Nota"
                              >
                                <Printer className="h-4 w-4 text-zinc-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(purchase)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit pembelian</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDelete(purchase.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus pembelian</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={7} className="px-6 py-12 text-center text-zinc-500">Belum ada pembelian.</TableCell></TableRow>
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit pembelian" : "Tambah pembelian"}</DialogTitle>
            <DialogDescription>
              Isi supplier, produk, kuantitas, dan biaya pembelian. Stok akan bertambah otomatis.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-supplier">Supplier</Label>
                <Select
                  id="purchase-supplier"
                  value={form.supplierId}
                  onChange={(event) => setForm((current) => ({ ...current, supplierId: event.target.value }))}
                  required
                >
                  <option value="" disabled>
                    Pilih supplier
                  </option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-product">Produk</Label>
                <Select
                  id="purchase-product"
                  value={form.productId}
                  onChange={(event) => setForm((current) => ({ ...current, productId: event.target.value }))}
                  required
                >
                  <option value="" disabled>
                    Pilih produk
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Tanggal pembelian</Label>
                <Input
                  id="purchase-date"
                  type="date"
                  value={form.purchaseDate}
                  onChange={(event) => setForm((current) => ({ ...current, purchaseDate: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-quantity">Jumlah (kg)</Label>
                <Input
                  id="purchase-quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantityKg}
                  onChange={(event) => setForm((current) => ({ ...current, quantityKg: event.target.value }))}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Harga per kg</Label>
                <CurrencyInput
                  id="purchase-price"
                  value={form.pricePerKg}
                  onValueChange={(value) => setForm((current) => ({ ...current, pricePerKg: value }))}
                  placeholder="Rp 8.500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-transport">Biaya transport</Label>
                <CurrencyInput
                  id="purchase-transport"
                  value={form.transportExpense}
                  onValueChange={(value) => setForm((current) => ({ ...current, transportExpense: value }))}
                  placeholder="Kosongkan bila tidak ada"
                />
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency((Number(form.quantityKg || 0) * Number(form.pricePerKg || 0)) || 0)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Total biaya</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(
                    (Number(form.quantityKg || 0) * Number(form.pricePerKg || 0) ||
                      0) + Number(form.transportExpense || 0),
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchase-notes">Catatan</Label>
              <Textarea
                id="purchase-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Catatan tambahan pembelian"
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

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold">Preview Nota Pembelian</DialogTitle>
              <DialogDescription className="text-xs">Tinjau kembali nota pembelian sebelum dicetak atau disimpan sebagai PDF.</DialogDescription>
            </div>
          </DialogHeader>

          {previewPurchase ? (
            <div className="space-y-6">
              {/* Paper Invoice Box */}
              <div 
                id="purchase-print-area" 
                className="bg-white text-zinc-900 p-6 md:p-8 rounded-lg shadow-sm border border-zinc-200"
              >
                {/* Kop Surat / Business Info */}
                <div className="flex justify-between items-start gap-4 border-b-2 border-zinc-900 pb-4 mb-6">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-950">CV. SIDARMA MAJUN</h1>
                    <p className="text-xs text-zinc-600 mt-1">Kavling Industri & Pergudangan Majun</p>
                    <p className="text-xs text-zinc-600">Jl. Industri Maju No. 18, Bandung</p>
                    <p className="text-xs text-zinc-600">Telp: 0812-3456-7890 | Email: sidarmamajun@gmail.com</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-lg font-bold tracking-wider text-zinc-900 uppercase">NOTA PEMBELIAN</h2>
                    <p className="text-xs text-zinc-600 mt-1">No: <span className="font-semibold text-zinc-900">PO-{previewPurchase.id.substring(0, 8).toUpperCase()}</span></p>
                    <p className="text-xs text-zinc-600">Tanggal: <span className="font-semibold text-zinc-900">{formatDate(previewPurchase.purchaseDate)}</span></p>
                  </div>
                </div>

                {/* Info Supplier & Penerimaan */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                  <div>
                    <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">DITERIMA DARI SUPPLIER:</p>
                    <p className="font-bold text-zinc-900 text-sm mt-1">{previewPurchase.supplierName}</p>
                    <p className="text-zinc-600 mt-1">Status Transaksi: <span className="font-semibold text-emerald-700">SUKSES / MASUK GUDANG</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">PENERIMA GUDANG:</p>
                    <p className="text-zinc-600 mt-1">Metode: Bongkar Muat Inbound</p>
                    {previewPurchase.notes && <p className="text-zinc-600 mt-1 italic">Catatan: {previewPurchase.notes}</p>}
                  </div>
                </div>

                {/* Table Items */}
                <table className="w-full text-xs mb-6 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-300 text-zinc-500 font-semibold text-left">
                      <th className="py-2">Nama Barang / Deskripsi</th>
                      <th className="py-2 text-right">Jumlah (Kg)</th>
                      <th className="py-2 text-right">Harga Beli / Kg</th>
                      <th className="py-2 text-right">Total Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    <tr className="text-zinc-900">
                      <td className="py-3 font-medium">{previewPurchase.productName}</td>
                      <td className="py-3 text-right font-medium">{previewPurchase.quantityKg.toFixed(2)} kg</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(previewPurchase.pricePerKg)}</td>
                      <td className="py-3 text-right font-bold">{formatCurrency(previewPurchase.subtotal)}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Summary Section */}
                <div className="flex justify-end mb-8">
                  <div className="w-64 space-y-2 text-xs border-t border-zinc-300 pt-3">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal Belakangan:</span>
                      <span>{formatCurrency(previewPurchase.subtotal)}</span>
                    </div>
                    {previewPurchase.transportExpense > 0 && (
                      <div className="flex justify-between text-zinc-600">
                        <span>Ongkos Transport:</span>
                        <span>{formatCurrency(previewPurchase.transportExpense)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-200 pt-2">
                      <span>GRAND TOTAL BIAYA:</span>
                      <span>{formatCurrency(previewPurchase.totalExpense)}</span>
                    </div>
                  </div>
                </div>

                {/* Signature Slots */}
                <div className="grid grid-cols-2 gap-4 text-center text-xs mt-12 pt-6 border-t border-dashed border-zinc-200">
                  <div>
                    <p className="text-zinc-500">Diserahkan Oleh Supplier,</p>
                    <div className="h-16"></div>
                    <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto"></p>
                    <p className="text-[10px] text-zinc-500 mt-1">Nama Jelas & TTD</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Diterima Oleh Gudang,</p>
                    <div className="h-16"></div>
                    <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto">Kepala Gudang</p>
                    <p className="text-[10px] text-zinc-500 mt-1">CV. SIDARMA MAJUN</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)} className="w-full sm:w-auto">
                  Tutup
                </Button>
                <Button onClick={() => handlePrint('purchase-print-area')} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  <Printer className="h-4 w-4" />
                  Cetak / Download PDF
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-4xl bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold">Preview Rekap Laporan Pembelian</DialogTitle>
              <DialogDescription className="text-xs">Tinjau rekapitulasi data pembelian berdasarkan filter aktif sebelum dicetak.</DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Paper Invoice Box */}
            <div 
              id="report-print-area" 
              className="bg-white text-zinc-900 p-6 md:p-8 rounded-lg shadow-sm border border-zinc-200"
            >
              {/* Kop Surat / Business Info */}
              <div className="flex justify-between items-start gap-4 border-b-2 border-zinc-900 pb-4 mb-6">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-950">CV. SIDARMA MAJUN</h1>
                  <p className="text-xs text-zinc-600 mt-1">Kavling Industri & Pergudangan Majun</p>
                  <p className="text-xs text-zinc-600">Jl. Industri Maju No. 18, Bandung</p>
                  <p className="text-xs text-zinc-600">Telp: 0812-3456-7890 | Email: sidarmamajun@gmail.com</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-bold tracking-wider text-zinc-900 uppercase">LAPORAN REKAPITULASI PEMBELIAN</h2>
                  <p className="text-xs text-zinc-600 mt-1">Periode: <span className="font-semibold text-zinc-900">{startDate ? formatDate(startDate) : 'Awal'} s.d. {endDate ? formatDate(endDate) : 'Hari Ini'}</span></p>
                  <p className="text-xs text-zinc-600">Jumlah Transaksi: <span className="font-semibold text-zinc-900">{sortedPurchases.length} Nota</span></p>
                </div>
              </div>

              {/* Table Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs mb-6 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-300 text-zinc-500 font-semibold text-left">
                      <th className="py-2">Tanggal</th>
                      <th className="py-2">Supplier</th>
                      <th className="py-2">Produk</th>
                      <th className="py-2 text-right">Qty (Kg)</th>
                      <th className="py-2 text-right">Harga Beli / Kg</th>
                      <th className="py-2 text-right">Subtotal</th>
                      <th className="py-2 text-right">Transport</th>
                      <th className="py-2 text-right font-bold">Total Biaya</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {sortedPurchases.map((purchase) => (
                      <tr key={purchase.id} className="text-zinc-900">
                        <td className="py-2">{formatDate(purchase.purchaseDate)}</td>
                        <td className="py-2 font-medium">{purchase.supplierName}</td>
                        <td className="py-2">{purchase.productName}</td>
                        <td className="py-2 text-right">{purchase.quantityKg.toFixed(2)} kg</td>
                        <td className="py-2 text-right">{formatCurrency(purchase.pricePerKg)}</td>
                        <td className="py-2 text-right">{formatCurrency(purchase.subtotal)}</td>
                        <td className="py-2 text-right">{formatCurrency(purchase.transportExpense)}</td>
                        <td className="py-2 text-right font-bold text-blue-700">{formatCurrency(purchase.totalExpense)}</td>
                      </tr>
                    ))}
                    {/* Summary row */}
                    <tr className="border-t-2 border-zinc-900 font-bold bg-zinc-50 text-zinc-950">
                      <td colSpan={3} className="py-3 px-1 text-left uppercase">TOTAL KESELURUHAN</td>
                      <td className="py-3 text-right">
                        {sortedPurchases.reduce((sum, item) => sum + item.quantityKg, 0).toFixed(2)} kg
                      </td>
                      <td className="py-3 text-right">-</td>
                      <td className="py-3 text-right">
                        {formatCurrency(sortedPurchases.reduce((sum, item) => sum + item.subtotal, 0))}
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(sortedPurchases.reduce((sum, item) => sum + item.transportExpense, 0))}
                      </td>
                      <td className="py-3 text-right text-blue-800">
                        {formatCurrency(totalPurchases)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signature Slots */}
              <div className="grid grid-cols-2 gap-4 text-center text-xs mt-12 pt-6 border-t border-dashed border-zinc-200">
                <div>
                  <p className="text-zinc-500">Mengetahui / Direksi,</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto"></p>
                  <p className="text-[10px] text-zinc-500 mt-1">Nama Jelas & TTD</p>
                </div>
                <div>
                  <p className="text-zinc-500">Dibuat Oleh Admin,</p>
                  <div className="h-16"></div>
                  <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto">Bagian Keuangan</p>
                  <p className="text-[10px] text-zinc-500 mt-1">CV. SIDARMA MAJUN</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReportDialogOpen(false)} className="w-full sm:w-auto">
                Tutup
              </Button>
              <Button onClick={() => handlePrint('report-print-area')} className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Printer className="h-4 w-4" />
                Cetak / Download PDF
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
