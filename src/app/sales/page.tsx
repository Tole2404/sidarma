"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Pencil, Plus, Trash2, ArrowUpDown, Printer, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
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
import { CustomerRecord, ProductOption, SaleRecord } from "@/lib/majun-types";
import MobileTransactionCard from "@/components/MobileTransactionCard";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptySaleForm = {
  customerId: "",
  productId: "",
  saleDate: new Date().toISOString().split("T")[0],
  quantityKg: "",
  sellingPricePerKg: "",
  deliveryExpense: "",
  additionalExpense: "",
  notes: "",
};

const emptyPaymentForm = {
  paymentDate: new Date().toISOString().split("T")[0],
  amount: "",
  notes: "",
};

export default function SalesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [saleForm, setSaleForm] = useState(emptySaleForm);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [submittingSale, setSubmittingSale] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [previewSale, setPreviewSale] = useState<SaleRecord | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [activePrintTab, setActivePrintTab] = useState<"nota" | "kuitansi">("nota");
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
          router.push("/login");
          return;
        }

        const { user } = (await userResponse.json()) as { user: SessionUser };
        setUser(user);

        const [salesData, customersData, productsData] = await Promise.all([
          fetchJson<SaleRecord[]>("/api/sales"),
          fetchJson<CustomerRecord[]>("/api/customers"),
          fetchJson<ProductOption[]>("/api/products"),
        ]);

        setSales(salesData);
        setCustomers(customersData);
        setProducts(productsData);
        setSaleForm((current) => ({
          ...current,
          customerId: customersData[0]?.id ?? "",
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
    router.push("/login");
    router.refresh();
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const saleDateOnly = sale.saleDate.split("T")[0];
    const matchesStartDate = startDate ? saleDateOnly >= startDate : true;
    const matchesEndDate = endDate ? saleDateOnly <= endDate : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const sortedSales = [...filteredSales].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
    } else if (sortBy === "amount") {
      comparison = a.totalTransactionValue - b.totalTransactionValue;
    } else if (sortBy === "quantity") {
      comparison = a.quantityKg - b.quantityKg;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalSales = sortedSales.reduce((sum, item) => sum + item.totalTransactionValue, 0);
  const totalOutstanding = sortedSales.reduce((sum, item) => sum + item.outstandingAmount, 0);

  const totalPages = Math.ceil(sortedSales.length / ITEMS_PER_PAGE);
  const paginatedSales = sortedSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    const defaultCustomer = customers[0];
    setSaleForm({
      ...emptySaleForm,
      customerId: defaultCustomer?.id ?? "",
      productId: products[0]?.id ?? "",
      sellingPricePerKg: defaultCustomer?.preferredBalePricePerKg ? String(defaultCustomer.preferredBalePricePerKg) : "",
    });
    setSaleDialogOpen(true);
  };

  const openEditDialog = (sale: SaleRecord) => {
    setEditingId(sale.id);
    setSaleForm({
      customerId: sale.customerId,
      productId: sale.productId,
      saleDate: sale.saleDate.split("T")[0],
      quantityKg: String(sale.quantityKg),
      sellingPricePerKg: String(sale.sellingPricePerKg),
      deliveryExpense: sale.deliveryExpense ? String(sale.deliveryExpense) : "",
      additionalExpense: sale.additionalExpense ? String(sale.additionalExpense) : "",
      notes: sale.notes ?? "",
    });
    setSaleDialogOpen(true);
  };

  const openPaymentDialog = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setPaymentForm({
      paymentDate: new Date().toISOString().split("T")[0],
      amount: sale.outstandingAmount > 0 ? String(sale.outstandingAmount) : "",
      notes: "",
    });
    setPaymentDialogOpen(true);
  };

  const handleSaleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittingSale(true);

    try {
      const payload = {
        customerId: saleForm.customerId,
        productId: saleForm.productId,
        saleDate: saleForm.saleDate,
        quantityKg: Number(saleForm.quantityKg),
        sellingPricePerKg: Number(saleForm.sellingPricePerKg),
        deliveryExpense: Number(saleForm.deliveryExpense || 0),
        additionalExpense: Number(saleForm.additionalExpense || 0),
        notes: saleForm.notes,
      };

      const sale = await fetchJson<SaleRecord>(editingId ? `/api/sales/${editingId}` : "/api/sales", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSales((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? sale : item));
        }

        return [sale, ...current].sort(
          (left, right) => new Date(right.saleDate).getTime() - new Date(left.saleDate).getTime(),
        );
      });

      setSaleDialogOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan penjualan.");
    } finally {
      setSubmittingSale(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedSale) {
      return;
    }

    setSubmittingPayment(true);

    try {
      const updatedSale = await fetchJson<SaleRecord>(`/api/sales/${selectedSale.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentDate: paymentForm.paymentDate,
          amount: Number(paymentForm.amount),
          notes: paymentForm.notes,
        }),
      });

      setSales((current) =>
        current.map((item) => (item.id === updatedSale.id ? updatedSale : item)),
      );
      setSelectedSale(updatedSale);
      setPaymentDialogOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan pembayaran.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus penjualan ini? Stok produk akan dihitung ulang.")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/sales/${id}`, { method: "DELETE" });
      setSales((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus penjualan.");
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
            eyebrow="Stok keluar"
            title="Penjualan"
            description="Catat penjualan ke customer. Sistem akan mengurangi stok, menghitung HPP snapshot, estimasi laba, dan status piutang."
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2" onClick={() => setReportDialogOpen(true)}>
                  <FileText className="h-4 w-4 text-zinc-500" />
                  Rekap Laporan
                </Button>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4" />
                  Tambah penjualan
                </Button>
              </div>
            }
          />

          <section className="grid grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardHeader className="p-4 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Total nilai penjualan</CardDescription>
                <CardTitle className="text-xl md:text-3xl">{formatCurrency(totalSales)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4 md:pb-3">
                <CardDescription className="text-xs md:text-sm">Total outstanding piutang</CardDescription>
                <CardTitle className="text-xl md:text-3xl text-rose-700">{formatCurrency(totalOutstanding)}</CardTitle>
              </CardHeader>
            </Card>
          </section>

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-zinc-900">Daftar Penjualan</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-500">Seluruh transaksi penjualan dan status pembayarannya.</CardDescription>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Transaksi</label>
                    <Input
                      placeholder="Cari customer/produk..."
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
              {/* Mobile card list */}
              <div className="md:hidden space-y-3 px-4 pb-4">
                {paginatedSales.length ? (
                  paginatedSales.map((sale) => (
                    <MobileTransactionCard
                      key={sale.id}
                      type="sale"
                      title={sale.customerName}
                      subtitle={`${sale.productName} · ${sale.quantityKg.toFixed(1)} kg`}
                      amount={sale.totalTransactionValue}
                      date={formatDate(sale.saleDate)}
                      status={
                        sale.paymentStatus === "PAID" ? "Lunas"
                          : sale.paymentStatus === "PARTIAL" ? "Sebagian"
                            : "Belum bayar"
                      }
                      onEdit={() => openEditDialog(sale)}
                      onDelete={() => handleDelete(sale.id)}
                      onPrint={() => {
                        setPreviewSale(sale);
                        setPreviewDialogOpen(true);
                      }}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada penjualan.</div>
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Tanggal</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status bayar</TableHead>
                      <TableHead>Piutang</TableHead>
                      <TableHead>Est. laba</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.length ? (
                      paginatedSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="px-6 text-sm">{formatDate(sale.saleDate)}</TableCell>
                          <TableCell>
                            <div className="font-medium text-zinc-900 text-sm">{sale.customerName}</div>
                            <div className="text-xs text-zinc-500">{formatCurrency(sale.totalTransactionValue)}</div>
                          </TableCell>
                          <TableCell className="text-sm">{sale.productName}</TableCell>
                          <TableCell className="text-sm">{sale.quantityKg.toFixed(2)} kg</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sale.paymentStatus === "PAID" ? "success"
                                  : sale.paymentStatus === "PARTIAL" ? "secondary"
                                    : "danger"
                              }
                            >
                              {sale.paymentStatus === "PAID" ? "Lunas"
                                : sale.paymentStatus === "PARTIAL" ? "Sebagian"
                                  : "Belum bayar"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-rose-700 text-sm">
                            {formatCurrency(sale.outstandingAmount)}
                          </TableCell>
                          <TableCell className={`text-sm ${sale.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            {formatCurrency(sale.estimatedProfit)}
                          </TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setPreviewSale(sale);
                                  setPreviewDialogOpen(true);
                                }}
                                title="Cetak Nota"
                              >
                                <Printer className="h-4 w-4 text-zinc-500" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(sale)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit penjualan</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openPaymentDialog(sale)}>
                                <CreditCard className="h-4 w-4" />
                                <span className="sr-only">Tambah pembayaran</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={() => handleDelete(sale.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus penjualan</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                          Belum ada penjualan.
                        </TableCell>
                      </TableRow>
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

      <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit penjualan" : "Tambah penjualan"}</DialogTitle>
            <DialogDescription>
              Catat penjualan per produk dan customer. Status pembayaran bisa dilengkapi setelah transaksi tersimpan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="sale-customer">Customer</Label>
                <Select
                  id="sale-customer"
                  value={saleForm.customerId}
                  onChange={(event) => {
                    const cid = event.target.value;
                    const cust = customers.find((c) => c.id === cid);
                    setSaleForm((current) => ({
                      ...current,
                      customerId: cid,
                      sellingPricePerKg: cust?.preferredBalePricePerKg ? String(cust.preferredBalePricePerKg) : current.sellingPricePerKg,
                    }));
                  }}
                  required
                >
                  <option value="" disabled>
                    Pilih customer
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.storeName}
                    </option>
                  ))}
                </Select>
                {customers.find((c) => c.id === saleForm.customerId)?.preferredBalePriceLabel && (
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-500 mt-1">
                    Tagging: {customers.find((c) => c.id === saleForm.customerId)?.preferredBalePriceLabel} ({formatCurrency(customers.find((c) => c.id === saleForm.customerId)?.preferredBalePricePerKg ?? 0)}/kg)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-product">Produk</Label>
                <Select
                  id="sale-product"
                  value={saleForm.productId}
                  onChange={(event) => setSaleForm((current) => ({ ...current, productId: event.target.value }))}
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
                <Label htmlFor="sale-date">Tanggal penjualan</Label>
                <Input
                  id="sale-date"
                  type="date"
                  value={saleForm.saleDate}
                  onChange={(event) => setSaleForm((current) => ({ ...current, saleDate: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-quantity">Jumlah (kg)</Label>
                <Input
                  id="sale-quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={saleForm.quantityKg}
                  onChange={(event) => setSaleForm((current) => ({ ...current, quantityKg: event.target.value }))}
                  placeholder="50"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="sale-price">Harga jual per kg</Label>
                <CurrencyInput
                  id="sale-price"
                  value={saleForm.sellingPricePerKg}
                  onValueChange={(value) =>
                    setSaleForm((current) => ({ ...current, sellingPricePerKg: value }))
                  }
                  placeholder="Rp 12.000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sale-delivery">Biaya kirim</Label>
                <CurrencyInput
                  id="sale-delivery"
                  value={saleForm.deliveryExpense}
                  onValueChange={(value) =>
                    setSaleForm((current) => ({ ...current, deliveryExpense: value }))
                  }
                  placeholder="Kosongkan bila tidak ada"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-additional">Biaya tambahan</Label>
              <CurrencyInput
                id="sale-additional"
                value={saleForm.additionalExpense}
                onValueChange={(value) =>
                  setSaleForm((current) => ({ ...current, additionalExpense: value }))
                }
                placeholder="Kosongkan bila tidak ada"
              />
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <span>Subtotal penjualan</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(
                    (Number(saleForm.quantityKg || 0) * Number(saleForm.sellingPricePerKg || 0)) || 0,
                  )}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Total biaya langsung</span>
                <span className="font-medium text-zinc-950 text-rose-600">
                  - {formatCurrency(
                    Number(saleForm.deliveryExpense || 0) + Number(saleForm.additionalExpense || 0),
                  )}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between font-bold text-zinc-950 border-t border-zinc-200 pt-2">
                <span>Grand Total</span>
                <span>
                  {formatCurrency(
                    Math.max(0, ((Number(saleForm.quantityKg || 0) * Number(saleForm.sellingPricePerKg || 0)) || 0) -
                      Number(saleForm.deliveryExpense || 0) -
                      Number(saleForm.additionalExpense || 0)),
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sale-notes">Catatan</Label>
              <Textarea
                id="sale-notes"
                value={saleForm.notes}
                onChange={(event) => setSaleForm((current) => ({ ...current, notes: event.target.value }))}
                placeholder="Catatan tambahan penjualan"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSaleDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={submittingSale}>
                {submittingSale ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah pembayaran</DialogTitle>
            <DialogDescription>
              {selectedSale
                ? `Catat pembayaran untuk ${selectedSale.customerName} pada transaksi ${selectedSale.productName}.`
                : "Catat pembayaran transaksi penjualan."}
            </DialogDescription>
          </DialogHeader>

          {selectedSale ? (
            <form onSubmit={handlePaymentSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                <div className="flex items-center justify-between">
                  <span>Total transaksi</span>
                  <span className="font-medium text-zinc-950">
                    {formatCurrency(selectedSale.totalTransactionValue)}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Sudah dibayar</span>
                  <span className="font-medium text-zinc-950">{formatCurrency(selectedSale.amountPaid)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span>Sisa tagihan</span>
                  <span className="font-medium text-rose-700">
                    {formatCurrency(selectedSale.outstandingAmount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-date">Tanggal pembayaran</Label>
                  <Input
                    id="payment-date"
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(event) =>
                      setPaymentForm((current) => ({ ...current, paymentDate: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-amount">Jumlah pembayaran</Label>
                  <CurrencyInput
                    id="payment-amount"
                    value={paymentForm.amount}
                    onValueChange={(value) =>
                      setPaymentForm((current) => ({ ...current, amount: value }))
                    }
                    placeholder="Rp 500.000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-notes">Catatan pembayaran</Label>
                <Textarea
                  id="payment-notes"
                  value={paymentForm.notes}
                  onChange={(event) => setPaymentForm((current) => ({ ...current, notes: event.target.value }))}
                  placeholder="Catatan tambahan pembayaran"
                />
              </div>

              {selectedSale.payments.length ? (
                <div className="space-y-2">
                  <Label>Riwayat pembayaran</Label>
                  <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                    {selectedSale.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-zinc-900">{formatDate(payment.paymentDate)}</p>
                          <p className="text-xs text-zinc-500">{payment.notes || "Tanpa catatan"}</p>
                        </div>
                        <p className="font-medium text-zinc-900">{formatCurrency(payment.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <DialogFooter>
                <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                  Tutup
                </Button>
                <Button type="submit" disabled={submittingPayment}>
                  {submittingPayment ? "Menyimpan..." : "Simpan pembayaran"}
                </Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <div>
              <DialogTitle className="text-lg font-bold">Preview Cetak Dokumen</DialogTitle>
              <DialogDescription className="text-xs">Tinjau kembali format dokumen sebelum dicetak atau disimpan sebagai PDF.</DialogDescription>
            </div>
          </DialogHeader>

          {previewSale ? (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800 -mt-2">
                <button
                  className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold border-b-2 transition-all ${activePrintTab === "nota"
                      ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  onClick={() => setActivePrintTab("nota")}
                >
                  📄 Nota Penjualan
                </button>
                <button
                  className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold border-b-2 transition-all ${activePrintTab === "kuitansi"
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  onClick={() => setActivePrintTab("kuitansi")}
                >
                  🎫 Kuitansi Pembayaran
                </button>
              </div>

              {activePrintTab === "nota" ? (
                /* Paper Invoice Box */
                <div
                  id="invoice-print-area"
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
                      <h2 className="text-lg font-bold tracking-wider text-zinc-900 uppercase">NOTA PENJUALAN</h2>
                      <p className="text-xs text-zinc-600 mt-1">No: <span className="font-semibold text-zinc-900">INV-{previewSale.id.substring(0, 8).toUpperCase()}</span></p>
                      <p className="text-xs text-zinc-600">Tanggal: <span className="font-semibold text-zinc-900">{formatDate(previewSale.saleDate)}</span></p>
                    </div>
                  </div>

                  {/* Info Customer & Pengiriman */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                    <div>
                      <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">DIBELI OLEH:</p>
                      <p className="font-bold text-zinc-900 text-sm mt-1">{previewSale.customerName}</p>
                      <p className="text-zinc-600 mt-1">Status Pembayaran: <span className="font-semibold">{previewSale.paymentStatus === 'PAID' ? 'LUNAS' : previewSale.paymentStatus === 'PARTIAL' ? 'SEBAGIAN' : 'BELUM DIBAYAR'}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">PENGIRIMAN:</p>
                      <p className="text-zinc-600 mt-1">Metode: Ekspedisi / Driver Sendiri</p>
                      {previewSale.notes && <p className="text-zinc-600 mt-1 italic">Catatan: {previewSale.notes}</p>}
                    </div>
                  </div>

                  {/* Table Items */}
                  <table className="w-full text-xs mb-6 border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-300 text-zinc-500 font-semibold text-left">
                        <th className="py-2">Nama Barang / Deskripsi</th>
                        <th className="py-2 text-right">Jumlah (Kg)</th>
                        <th className="py-2 text-right">Harga Jual / Kg</th>
                        <th className="py-2 text-right">Total Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      <tr className="text-zinc-900">
                        <td className="py-3 font-medium">{previewSale.productName}</td>
                        <td className="py-3 text-right font-medium">{previewSale.quantityKg.toFixed(2)} kg</td>
                        <td className="py-3 text-right font-medium">{formatCurrency(previewSale.sellingPricePerKg)}</td>
                        <td className="py-3 text-right font-bold">{formatCurrency(previewSale.subtotal)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Summary Section */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64 space-y-2 text-xs border-t border-zinc-300 pt-3">
                      <div className="flex justify-between text-zinc-600">
                        <span>Subtotal Jual:</span>
                        <span>{formatCurrency(previewSale.subtotal)}</span>
                      </div>
                      {previewSale.deliveryExpense > 0 && (
                        <div className="flex justify-between text-zinc-600">
                          <span>Ongkos Kirim:</span>
                          <span>{formatCurrency(previewSale.deliveryExpense)}</span>
                        </div>
                      )}
                      {previewSale.additionalExpense > 0 && (
                        <div className="flex justify-between text-zinc-600">
                          <span>Biaya Tambahan:</span>
                          <span>{formatCurrency(previewSale.additionalExpense)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-200 pt-2">
                        <span>GRAND TOTAL:</span>
                        <span>{formatCurrency(previewSale.totalTransactionValue)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-emerald-700">
                        <span>Sudah Dibayar:</span>
                        <span>{formatCurrency(previewSale.amountPaid)}</span>
                      </div>
                      {previewSale.outstandingAmount > 0 && (
                        <div className="flex justify-between font-semibold text-rose-700 border-t border-dashed border-zinc-200 pt-1.5">
                          <span>SISA PIUTANG:</span>
                          <span>{formatCurrency(previewSale.outstandingAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Signature Slots */}
                  <div className="grid grid-cols-2 gap-4 text-center text-xs mt-12 pt-6 border-t border-dashed border-zinc-200">
                    <div>
                      <p className="text-zinc-500">Tanda Terima Penerima,</p>
                      <div className="h-16"></div>
                      <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto"></p>
                      <p className="text-[10px] text-zinc-500 mt-1">Nama Jelas & Stempel</p>
                    </div>
                    <div>
                      <p className="text-zinc-500">Hormat Kami,</p>
                      <div className="h-16"></div>
                      <p className="font-semibold text-zinc-900 border-b border-zinc-400 w-32 mx-auto">Bagian Gudang</p>
                      <p className="text-[10px] text-zinc-500 mt-1">CV. SIDARMA MAJUN</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Paper Kuitansi Box */
                <div
                  id="kuitansi-print-area"
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
                      <h2 className="text-lg font-bold tracking-wider text-zinc-900 uppercase">KUITANSI</h2>
                      <p className="text-xs text-zinc-600 mt-1">No: <span className="font-semibold text-zinc-900">KUI-{previewSale.id.substring(0, 8).toUpperCase()}</span></p>
                      <p className="text-xs text-zinc-600">Tanggal: <span className="font-semibold text-zinc-900">{formatDate(previewSale.saleDate)}</span></p>
                    </div>
                  </div>

                  {/* Kuitansi Body */}
                  <div className="space-y-4 text-xs sm:text-sm mt-8 mb-12">
                    <div className="flex items-center border-b border-zinc-200 pb-3">
                      <span className="w-40 sm:w-48 text-zinc-500 font-medium shrink-0">Telah Diterima Dari :</span>
                      <span className="font-bold text-zinc-950 text-sm sm:text-base">{previewSale.customerName}</span>
                    </div>

                    <div className="flex items-center border-b border-zinc-200 pb-3">
                      <span className="w-40 sm:w-48 text-zinc-500 font-medium shrink-0">Uang Sejumlah :</span>
                      <span className="font-semibold text-zinc-900 bg-zinc-100 px-3 py-1 rounded italic text-xs sm:text-sm">
                        {formatCurrency(previewSale.totalTransactionValue)}
                      </span>
                    </div>

                    <div className="flex items-start border-b border-zinc-200 pb-3">
                      <span className="w-40 sm:w-48 text-zinc-500 font-medium shrink-0">Untuk Pembayaran :</span>
                      <span className="text-zinc-800 text-xs sm:text-sm leading-relaxed">
                        Pembelian {previewSale.productName} sebanyak {Number(previewSale.quantityKg.toFixed(2))} kg | {formatCurrency(previewSale.sellingPricePerKg)} / kg
                      </span>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="flex justify-between items-end mt-12 pt-6 border-t border-dashed border-zinc-200">
                    <div className="bg-zinc-900 text-white font-bold text-base sm:text-lg px-4 sm:px-6 py-2 rounded shadow-sm">
                      {formatCurrency(previewSale.totalTransactionValue)}
                    </div>
                    <div className="text-center w-48 sm:w-64">
                      <p className="text-zinc-500 text-[10px] sm:text-xs mb-12 sm:mb-16">Bandung, {formatDate(previewSale.saleDate)}</p>
                      <p className="font-bold text-zinc-900 border-b border-zinc-400 w-36 sm:w-48 mx-auto pb-1"></p>
                      <p className="text-[10px] text-zinc-500 mt-1">CV. SIDARMA MAJUN</p>
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setPreviewDialogOpen(false)} className="w-full sm:w-auto">
                  Tutup
                </Button>
                <Button
                  onClick={() => handlePrint(activePrintTab === 'nota' ? 'invoice-print-area' : 'kuitansi-print-area')}
                  className={`w-full sm:w-auto gap-2 text-white transition-all ${activePrintTab === 'nota'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
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
              <DialogTitle className="text-lg font-bold">Preview Rekap Laporan Penjualan</DialogTitle>
              <DialogDescription className="text-xs">Tinjau rekapitulasi data penjualan berdasarkan filter aktif sebelum dicetak.</DialogDescription>
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
                  <h2 className="text-lg font-bold tracking-wider text-zinc-900 uppercase">LAPORAN REKAPITULASI PENJUALAN</h2>
                  <p className="text-xs text-zinc-600 mt-1">Periode: <span className="font-semibold text-zinc-900">{startDate ? formatDate(startDate) : 'Awal'} s.d. {endDate ? formatDate(endDate) : 'Hari Ini'}</span></p>
                  <p className="text-xs text-zinc-600">Jumlah Transaksi: <span className="font-semibold text-zinc-900">{sortedSales.length} Nota</span></p>
                </div>
              </div>

              {/* Table Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] mb-6 border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-300 text-zinc-500 font-semibold text-left">
                      <th className="py-2">Tanggal</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Produk</th>
                      <th className="py-2 text-right">Qty (Kg)</th>
                      <th className="py-2 text-right">Harga Jual / Kg</th>
                      <th className="py-2 text-right">Subtotal</th>
                      <th className="py-2 text-right">Ongkir</th>
                      <th className="py-2 text-right">Total Transaksi</th>
                      <th className="py-2 text-right">Terbayar</th>
                      <th className="py-2 text-right">Piutang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {sortedSales.map((sale) => (
                      <tr key={sale.id} className="text-zinc-900">
                        <td className="py-2">{formatDate(sale.saleDate)}</td>
                        <td className="py-2 font-medium">{sale.customerName}</td>
                        <td className="py-2">{sale.productName}</td>
                        <td className="py-2 text-right">{sale.quantityKg.toFixed(2)} kg</td>
                        <td className="py-2 text-right">{formatCurrency(sale.sellingPricePerKg)}</td>
                        <td className="py-2 text-right">{formatCurrency(sale.subtotal)}</td>
                        <td className="py-2 text-right">{formatCurrency(sale.deliveryExpense)}</td>
                        <td className="py-2 text-right font-semibold">{formatCurrency(sale.totalTransactionValue)}</td>
                        <td className="py-2 text-right text-emerald-700 font-medium">{formatCurrency(sale.amountPaid)}</td>
                        <td className="py-2 text-right text-rose-700 font-medium">{formatCurrency(sale.outstandingAmount)}</td>
                      </tr>
                    ))}
                    {/* Summary row */}
                    <tr className="border-t-2 border-zinc-900 font-bold bg-zinc-50 text-zinc-950">
                      <td colSpan={3} className="py-3 px-1 text-left uppercase">TOTAL KESELURUHAN</td>
                      <td className="py-3 text-right">
                        {sortedSales.reduce((sum, item) => sum + item.quantityKg, 0).toFixed(2)} kg
                      </td>
                      <td className="py-3 text-right">-</td>
                      <td className="py-3 text-right">
                        {formatCurrency(sortedSales.reduce((sum, item) => sum + item.subtotal, 0))}
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(sortedSales.reduce((sum, item) => sum + item.deliveryExpense, 0))}
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(totalSales)}
                      </td>
                      <td className="py-3 text-right text-emerald-800">
                        {formatCurrency(sortedSales.reduce((sum, item) => sum + item.amountPaid, 0))}
                      </td>
                      <td className="py-3 text-right text-rose-800">
                        {formatCurrency(totalOutstanding)}
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
              <Button onClick={() => handlePrint('report-print-area')} className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700">
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
