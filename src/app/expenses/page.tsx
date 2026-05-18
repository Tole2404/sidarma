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
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import { ExpenseCategoryOption, ExpenseRecord } from "@/lib/majun-types";
import MobileTransactionCard from "@/components/MobileTransactionCard";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const emptyForm = {
  categoryId: "",
  expenseDate: new Date().toISOString().split("T")[0],
  amount: "",
  description: "",
};

export default function ExpensesPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryOption[]>([]);
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
  const ITEMS_PER_PAGE = 15;

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

        const [expensesData, categoriesData] = await Promise.all([
          fetchJson<ExpenseRecord[]>("/api/expenses"),
          fetchJson<ExpenseCategoryOption[]>("/api/expense-categories"),
        ]);

        setExpenses(expensesData);
        setCategories(categoriesData);
        setForm((current) => ({
          ...current,
          categoryId: categoriesData[0]?.id ?? "",
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

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (expense.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const expenseDateOnly = expense.expenseDate.split("T")[0];
    const matchesStartDate = startDate ? expenseDateOnly >= startDate : true;
    const matchesEndDate = endDate ? expenseDateOnly <= endDate : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.expenseDate).getTime() - new Date(b.expenseDate).getTime();
    } else if (sortBy === "amount") {
      comparison = a.amount - b.amount;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalExpenses = sortedExpenses.reduce((sum, item) => sum + item.amount, 0);

  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = sortedExpenses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openCreateDialog = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
    });
    setOpen(true);
  };

  const openEditDialog = (expense: ExpenseRecord) => {
    setEditingId(expense.id);
    setForm({
      categoryId: expense.categoryId,
      expenseDate: expense.expenseDate.split("T")[0],
      amount: String(expense.amount),
      description: expense.description,
    });
    setOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        categoryId: form.categoryId,
        expenseDate: form.expenseDate,
        amount: Number(form.amount),
        description: form.description,
      };

      const expense = await fetchJson<ExpenseRecord>(
        editingId ? `/api/expenses/${editingId}` : "/api/expenses",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      setExpenses((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? expense : item));
        }

        return [expense, ...current].sort(
          (left, right) => new Date(right.expenseDate).getTime() - new Date(left.expenseDate).getTime(),
        );
      });

      setOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan pengeluaran.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengeluaran ini?")) {
      return;
    }

    try {
      await fetchJson<{ message: string }>(`/api/expenses/${id}`, { method: "DELETE" });
      setExpenses((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus pengeluaran.");
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
            eyebrow="Biaya operasional"
            title="Pengeluaran"
            description="Catat seluruh biaya operasional di luar pembelian dan biaya langsung penjualan."
            action={
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4" />
                Tambah pengeluaran
              </Button>
            }
          />

          <Card>
            <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-zinc-900">Daftar Pengeluaran</CardTitle>
                    <CardDescription className="text-xs md:text-sm text-zinc-500">Seluruh biaya operasional usaha majun tercatat di sini.</CardDescription>
                  </div>
                  <div className="text-sm font-medium text-zinc-600">
                    Total: <span className="text-zinc-950 font-semibold">{formatCurrency(totalExpenses)}</span>
                  </div>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Pengeluaran</label>
                    <Input
                      placeholder="Cari kategori/deskripsi..."
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
                        <option value="amount">Jumlah Biaya</option>
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
                {paginatedExpenses.length ? (
                  paginatedExpenses.map((expense) => (
                    <MobileTransactionCard
                      key={expense.id}
                      type="expense"
                      title={expense.categoryName}
                      subtitle={expense.description}
                      amount={expense.amount}
                      date={formatDate(expense.expenseDate)}
                      onEdit={() => openEditDialog(expense)}
                      onDelete={() => handleDelete(expense.id)}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-zinc-500">Belum ada pengeluaran.</div>
                )}
              </div>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead className="px-6 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedExpenses.length ? (
                      paginatedExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="px-6 text-sm">{formatDate(expense.expenseDate)}</TableCell>
                          <TableCell className="text-sm">{expense.categoryName}</TableCell>
                          <TableCell className="max-w-[320px] truncate text-sm">{expense.description}</TableCell>
                          <TableCell className="font-medium text-rose-700 text-sm">{formatCurrency(expense.amount)}</TableCell>
                          <TableCell className="px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(expense)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit pengeluaran</span>
                              </Button>
                              <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => handleDelete(expense.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Hapus pengeluaran</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow><TableCell colSpan={5} className="px-6 py-12 text-center text-zinc-500">Belum ada pengeluaran.</TableCell></TableRow>
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
            <DialogTitle>{editingId ? "Edit pengeluaran" : "Tambah pengeluaran"}</DialogTitle>
            <DialogDescription>
              Catat biaya operasional beserta kategori dan tanggal pengeluarannya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-category">Kategori</Label>
                <Select
                  id="expense-category"
                  value={form.categoryId}
                  onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  required
                >
                  <option value="" disabled>
                    Pilih kategori
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-date">Tanggal</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={form.expenseDate}
                  onChange={(event) => setForm((current) => ({ ...current, expenseDate: event.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-amount">Jumlah (Rp)</Label>
              <CurrencyInput
                id="expense-amount"
                value={form.amount}
                onValueChange={(value) => setForm((current) => ({ ...current, amount: value }))}
                placeholder="Rp 150.000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-description">Deskripsi</Label>
              <Input
                id="expense-description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Contoh: Beli solar pengiriman"
                required
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
