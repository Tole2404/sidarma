"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Package, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import { StockMovementRecord, StockProduct } from "@/lib/majun-types";
import Pagination from "@/components/Pagination";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface StockResponse {
  products: StockProduct[];
  recentMovements: StockMovementRecord[];
}

export default function StockPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [recentMovements, setRecentMovements] = useState<StockMovementRecord[]>([]);
  const [loading, setLoading] = useState(true);
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
          router.push("/portal-admin");
          return;
        }

        const { user } = (await userResponse.json()) as { user: SessionUser };
        setUser(user);

        const stockData = await fetchJson<StockResponse>("/api/stock");
        setProducts(stockData.products);
        setRecentMovements(stockData.recentMovements);
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

  const totalStockKg = products.reduce((sum, product) => sum + product.currentStockKg, 0);
  const totalInventoryValue = products.reduce((sum, product) => sum + product.totalInventoryValue, 0);

  const filteredMovements = recentMovements.filter((movement) => {
    const matchesSearch = movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          movement.sourceLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const dateOnly = movement.occurredAt.split("T")[0];
    const matchesStartDate = startDate ? dateOnly >= startDate : true;
    const matchesEndDate = endDate ? dateOnly <= endDate : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "date") {
      comparison = new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime();
    } else if (sortBy === "quantity") {
      comparison = a.quantityKg - b.quantityKg;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedMovements.length / ITEMS_PER_PAGE);
  const paginatedMovements = sortedMovements.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
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
            eyebrow="Persediaan"
            title="Stok"
            description="Pantau sisa stok, HPP berjalan, dan riwayat keluar-masuk barang secara realtime."
          />

          <section className="grid grid-cols-2 gap-3 md:gap-4">
            <Card>
              <CardHeader className="p-4 md:pb-3">
                <CardDescription className="text-[10px] xs:text-xs sm:text-sm font-medium text-zinc-500">Total stok semua produk</CardDescription>
                <CardTitle className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">{totalStockKg.toFixed(2)} kg</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4 md:pb-3">
                <CardDescription className="text-[10px] xs:text-xs sm:text-sm font-medium text-zinc-500">Total nilai persediaan</CardDescription>
                <CardTitle className="text-sm xs:text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">{formatCurrency(totalInventoryValue)}</CardTitle>
              </CardHeader>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader className="p-4 md:p-6 pb-2">
                <CardTitle className="text-sm md:text-base font-bold text-zinc-900">Posisi stok per produk</CardTitle>
                <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">Stok saat ini dipisahkan berdasarkan jenis majun aktif.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                {products.map((product) => (
                  <div key={product.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-zinc-900">{product.name}</p>
                        <p className="text-[10px] sm:text-xs text-zinc-500">
                          HPP rata-rata {formatCurrency(product.averageCostPerKg)}/kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-zinc-950">{product.currentStockKg.toFixed(2)} kg</p>
                        <p className="text-[10px] sm:text-xs text-zinc-500">{formatCurrency(product.totalInventoryValue)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 md:p-6 pb-3 border-b border-zinc-100">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm md:text-base font-bold text-zinc-900">Riwayat Pergerakan Stok</CardTitle>
                      <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">Riwayat masuk dan keluarnya barang dari gudang.</CardDescription>
                    </div>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Cari Pergerakan</label>
                      <Input
                        placeholder="Cari produk/sumber..."
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="px-4 md:px-6">Tanggal</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead className="hidden sm:table-cell">Sumber</TableHead>
                        <TableHead>Pergerakan</TableHead>
                        <TableHead className="px-4 md:px-6 text-right">Qty</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedMovements.length ? (
                        paginatedMovements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell className="px-4 md:px-6 text-sm">{formatDate(movement.occurredAt)}</TableCell>
                            <TableCell className="text-sm">{movement.productName}</TableCell>
                            <TableCell className="hidden sm:table-cell max-w-[220px] truncate text-sm">{movement.sourceLabel}</TableCell>
                            <TableCell>
                              <Badge variant={movement.movementType === "INBOUND" ? "success" : "danger"}>
                                <span className="mr-1 inline-flex">
                                  {movement.movementType === "INBOUND" ? (
                                    <ArrowDownToLine className="h-3.5 w-3.5" />
                                  ) : (
                                    <ArrowUpFromLine className="h-3.5 w-3.5" />
                                  )}
                                </span>
                                {movement.movementType === "INBOUND" ? "Masuk" : "Keluar"}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 md:px-6 text-right font-medium text-sm">
                              {movement.movementType === "INBOUND" ? "+" : "-"}
                              {movement.quantityKg.toFixed(2)} kg
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                            Belum ada pergerakan stok.
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
          </section>
        </div>
      </main>
    </div>
  );
}
