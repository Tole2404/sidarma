"use client";

import React, { useEffect, useState, useMemo } from "react";
import { BarChart3, HandCoins, Package, ShoppingBag, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchJson } from "@/lib/client-fetch";
import { formatCurrency, formatDate } from "@/lib/format";
import { DashboardData } from "@/lib/majun-types";
import { cn } from "@/lib/utils";
import MobileTransactionCard from "@/components/MobileTransactionCard";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const summaryCards = [
  {
    key: "totalSales",
    label: "Total Penjualan",
    icon: HandCoins,
    tone: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50",
  },
  {
    key: "totalPurchases",
    label: "Total Pembelian",
    icon: ShoppingBag,
    tone: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50",
  },
  {
    key: "totalExpenses",
    label: "Biaya Operasional",
    icon: Wallet,
    tone: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/50",
  },
  {
    key: "estimatedProfit",
    label: "Estimasi Laba",
    icon: BarChart3,
    tone: "text-zinc-900 bg-zinc-100 dark:text-zinc-100 dark:bg-zinc-800",
  },
] as const;

type ChartPeriod = "weekly" | "monthly" | "yearly";

interface DashboardChartsProps {
  salesHistory?: { date: string; amount: number }[];
  purchasesHistory?: { date: string; amount: number }[];
  expensesHistory?: { date: string; amount: number }[];
}

function DashboardCharts({
  salesHistory = [],
  purchasesHistory = [],
  expensesHistory = [],
}: DashboardChartsProps) {
  const [period, setPeriod] = useState<ChartPeriod>("monthly");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (period === "weekly") {
      const weeks: { label: string; start: Date; end: Date; sales: number; purchases: number; expenses: number }[] = [];
      const now = new Date();
      // Generate last 8 weeks ending with this week
      for (let i = 7; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
        const startOfWeek = new Date(d.setDate(diff));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000 + 23 * 3600 * 1000 + 59 * 60000 + 59000);
        weeks.push({
          label: `W-${i === 0 ? "Ini" : 8 - i}`,
          start: startOfWeek,
          end: endOfWeek,
          sales: 0,
          purchases: 0,
          expenses: 0,
        });
      }

      salesHistory.forEach((s) => {
        const d = new Date(s.date);
        const w = weeks.find((wk) => d >= wk.start && d <= wk.end);
        if (w) w.sales += s.amount;
      });

      purchasesHistory.forEach((p) => {
        const d = new Date(p.date);
        const w = weeks.find((wk) => d >= wk.start && d <= wk.end);
        if (w) w.purchases += p.amount;
      });

      expensesHistory.forEach((e) => {
        const d = new Date(e.date);
        const w = weeks.find((wk) => d >= wk.start && d <= wk.end);
        if (w) w.expenses += e.amount;
      });

      return weeks.map((w) => ({
        label: w.label,
        sales: w.sales,
        purchases: w.purchases,
        expenses: w.expenses,
        netProfit: w.sales - w.purchases - w.expenses,
      }));
    } else if (period === "yearly") {
      const years: { label: string; year: number; sales: number; purchases: number; expenses: number }[] = [];
      const currentYear = new Date().getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        years.push({
          label: `${year}`,
          year,
          sales: 0,
          purchases: 0,
          expenses: 0,
        });
      }

      salesHistory.forEach((s) => {
        const d = new Date(s.date);
        const y = years.find((yr) => yr.year === d.getFullYear());
        if (y) y.sales += s.amount;
      });

      purchasesHistory.forEach((p) => {
        const d = new Date(p.date);
        const y = years.find((yr) => yr.year === d.getFullYear());
        if (y) y.purchases += p.amount;
      });

      expensesHistory.forEach((e) => {
        const d = new Date(e.date);
        const y = years.find((yr) => yr.year === d.getFullYear());
        if (y) y.expenses += e.amount;
      });

      return years.map((y) => ({
        label: y.label,
        sales: y.sales,
        purchases: y.purchases,
        expenses: y.expenses,
        netProfit: y.sales - y.purchases - y.expenses,
      }));
    } else {
      // Monthly
      const months: { label: string; year: number; month: number; sales: number; purchases: number; expenses: number }[] = [];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth();
        months.push({
          label: `${monthNames[month]}`,
          year,
          month,
          sales: 0,
          purchases: 0,
          expenses: 0,
        });
      }

      salesHistory.forEach((s) => {
        const d = new Date(s.date);
        const m = months.find((mn) => mn.year === d.getFullYear() && mn.month === d.getMonth());
        if (m) m.sales += s.amount;
      });

      purchasesHistory.forEach((p) => {
        const d = new Date(p.date);
        const m = months.find((mn) => mn.year === d.getFullYear() && mn.month === d.getMonth());
        if (m) m.purchases += p.amount;
      });

      expensesHistory.forEach((e) => {
        const d = new Date(e.date);
        const m = months.find((mn) => mn.year === d.getFullYear() && mn.month === d.getMonth());
        if (m) m.expenses += e.amount;
      });

      return months.map((m) => ({
        label: m.label,
        sales: m.sales,
        purchases: m.purchases,
        expenses: m.expenses,
        netProfit: m.sales - m.purchases - m.expenses,
      }));
    }
  }, [period, salesHistory, purchasesHistory, expensesHistory]);

  const maxVal = useMemo(() => {
    let max = 100000;
    chartData.forEach((d) => {
      if (d.sales > max) max = d.sales;
      if (d.purchases > max) max = d.purchases;
      if (d.expenses > max) max = d.expenses;
    });
    // Round up nicely
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    const roundedMax = Math.ceil(max / (magnitude / 2)) * (magnitude / 2);
    return roundedMax;
  }, [chartData]);

  // SVG Chart sizing
  const width = 1000;
  const height = 300;
  const paddingLeft = 85;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = useMemo(() => {
    const N = chartData.length;
    if (N < 2) return [];
    return chartData.map((d, i) => {
      const x = paddingLeft + (i / (N - 1)) * chartWidth;
      const yScale = (v: number) => {
        const ratio = maxVal > 0 ? v / maxVal : 0;
        return paddingTop + chartHeight - ratio * chartHeight;
      };
      return {
        x,
        salesY: yScale(d.sales),
        purchasesY: yScale(d.purchases),
        expensesY: yScale(d.expenses),
      };
    });
  }, [chartData, maxVal, chartWidth, chartHeight]);

  const paths = useMemo(() => {
    if (points.length < 2) return { sales: "", purchases: "", expenses: "", salesFill: "", purchasesFill: "", expensesFill: "" };

    const getLinePath = (yKey: "salesY" | "purchasesY" | "expensesY") => {
      return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p[yKey]}`).join(" ");
    };

    const getFillPath = (yKey: "salesY" | "purchasesY" | "expensesY") => {
      const lineStr = points.map((p) => `L ${p.x} ${p[yKey]}`).join(" ");
      const startX = points[0].x;
      const endX = points[points.length - 1].x;
      const bottomY = paddingTop + chartHeight;
      return `M ${startX} ${bottomY} ${lineStr} L ${endX} ${bottomY} Z`;
    };

    return {
      sales: getLinePath("salesY"),
      purchases: getLinePath("purchasesY"),
      expenses: getLinePath("expensesY"),
      salesFill: getFillPath("salesY"),
      purchasesFill: getFillPath("purchasesY"),
      expensesFill: getFillPath("expensesY"),
    };
  }, [points, chartHeight]);

  const formatYAxisTick = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}rb`;
    return `Rp ${val}`;
  };

  const yAxisTicks = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!points.length) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;

    let nearestIdx = 0;
    let minDist = Infinity;
    points.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });
    setHoveredIndex(nearestIdx);
  };

  const activeHoverData = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 p-4 md:p-6 pb-4">
        <div>
          <CardTitle className="text-sm md:text-lg font-bold text-zinc-900">Grafik Kinerja Keuangan</CardTitle>
          <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">Perbandingan real-time penjualan, pembelian, dan biaya operasional.</CardDescription>
        </div>
        <div className="flex bg-zinc-100 p-0.5 rounded-lg w-fit">
          {(["weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setHoveredIndex(null);
              }}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all uppercase tracking-wider",
                period === p
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {p === "weekly" ? "Mingguan" : p === "monthly" ? "Bulanan" : "Tahunan"}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {/* Legends */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-xs font-medium text-zinc-600">Total Penjualan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500 shadow-sm" />
            <span className="text-xs font-medium text-zinc-600">Total Pembelian</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm" />
            <span className="text-xs font-medium text-zinc-600">Biaya Operasional</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="relative">
          {!points.length ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-zinc-400">
              Belum ada data untuk periode ini.
            </div>
          ) : (
            <>
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-auto select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="purchasesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expensesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines & Ticks */}
                {yAxisTicks.map((tick, i) => {
                  const y = paddingTop + chartHeight - (tick / maxVal) * chartHeight;
                  return (
                    <g key={i} className="opacity-40">
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={width - paddingRight}
                        y2={y}
                        stroke="#e4e4e7"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingLeft - 12}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] font-medium fill-zinc-400"
                      >
                        {formatYAxisTick(tick)}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {chartData.map((d, i) => {
                  const x = paddingLeft + (i / (chartData.length - 1)) * chartWidth;
                  return (
                    <text
                      key={i}
                      x={x}
                      y={height - 12}
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-zinc-400 opacity-80"
                    >
                      {d.label}
                    </text>
                  );
                })}

                {/* Translucent Fills */}
                <path d={paths.salesFill} fill="url(#salesGrad)" />
                <path d={paths.purchasesFill} fill="url(#purchasesGrad)" />
                <path d={paths.expensesFill} fill="url(#expensesGrad)" />

                {/* Lines */}
                <path d={paths.purchases} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <path d={paths.expenses} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                <path d={paths.sales} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

                {/* Hover vertical line and glow points */}
                {hoveredIndex !== null && points[hoveredIndex] && (
                  <>
                    <line
                      x1={points[hoveredIndex].x}
                      y1={paddingTop}
                      x2={points[hoveredIndex].x}
                      y2={paddingTop + chartHeight}
                      stroke="#71717a"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      className="opacity-70"
                    />

                    {/* Sales Point */}
                    <circle
                      cx={points[hoveredIndex].x}
                      cy={points[hoveredIndex].salesY}
                      r="7"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />

                    {/* Purchases Point */}
                    <circle
                      cx={points[hoveredIndex].x}
                      cy={points[hoveredIndex].purchasesY}
                      r="7"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />

                    {/* Expenses Point */}
                    <circle
                      cx={points[hoveredIndex].x}
                      cy={points[hoveredIndex].expensesY}
                      r="7"
                      fill="#f43f5e"
                      stroke="white"
                      strokeWidth="2.5"
                      className="shadow-sm"
                    />
                  </>
                )}
              </svg>

              {/* HTML Floating Tooltip */}
              {hoveredIndex !== null && activeHoverData && points[hoveredIndex] && (
                <div
                  className="absolute pointer-events-none bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 shadow-xl transition-all duration-150 z-10 w-60"
                  style={{
                    left: `${Math.min(
                      Math.max(10, (points[hoveredIndex].x / width) * 100 - 30),
                      70
                    )}%`,
                    top: "10%",
                  }}
                >
                  <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-2 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">
                    Periode: {activeHoverData.label}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-500">Penjualan:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatCurrency(activeHoverData.sales)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-500">Pembelian:</span>
                      <span className="text-blue-700 dark:text-blue-400 font-semibold">{formatCurrency(activeHoverData.purchases)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-zinc-500">Biaya:</span>
                      <span className="text-rose-700 dark:text-rose-400 font-semibold">{formatCurrency(activeHoverData.expenses)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-1.5 border-t border-dashed border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-700 dark:text-zinc-300">Laba Bersih:</span>
                      <span
                        className={cn(
                          activeHoverData.netProfit >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {formatCurrency(activeHoverData.netProfit)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

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

        const dashboardData = await fetchJson<DashboardData>("/api/dashboard");
        setDashboard(dashboardData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const totalStockKg = dashboard?.stockSummary.reduce((sum, product) => sum + product.currentStockKg, 0) ?? 0;
  const totalInventoryValue =
    dashboard?.stockSummary.reduce((sum, product) => sum + product.totalInventoryValue, 0) ?? 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
          <Skeleton className="h-28 md:h-32" />
          <Skeleton className="h-28 md:h-32" />
          <Skeleton className="h-28 md:h-32" />
          <Skeleton className="h-28 md:h-32" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Dashboard</h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Selamat datang{user?.name ? `, ${user.name}` : ""}. Pantau penjualan, pembelian, biaya, dan stok majun dari satu layar.
            </p>
          </div>
        </div>
      </div>

          <section className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;
              const amount = dashboard?.[card.key] ?? 0;

              return (
                <Card key={card.key}>
                  <CardHeader className="flex flex-col md:flex-row items-start justify-between space-y-2 md:space-y-0 p-4 md:pb-3">
                    <div>
                      <CardDescription className="text-[10px] xs:text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">{card.label}</CardDescription>
                      <CardTitle className="mt-1 md:mt-2 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{formatCurrency(amount)}</CardTitle>
                    </div>
                    <div className={cn("rounded-xl p-2 hidden md:block", card.tone)}>
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </section>

          <DashboardCharts
            salesHistory={(dashboard as any)?.salesHistory}
            purchasesHistory={(dashboard as any)?.purchasesHistory}
            expensesHistory={(dashboard as any)?.expensesHistory}
          />

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg md:text-xl">Aktivitas Terbaru</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Pembelian, penjualan, dan pengeluaran terakhir.</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit">{dashboard?.recentActivities.length ?? 0} aktivitas</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="md:hidden space-y-3 px-4 pb-4">
                  {dashboard?.recentActivities.length ? (
                    dashboard.recentActivities.map((activity) => (
                      <MobileTransactionCard
                        key={`${activity.type}-${activity.id}`}
                        type={activity.type.toLowerCase() as "purchase" | "sale" | "expense"}
                        title={activity.title}
                        subtitle={activity.subtitle}
                        amount={activity.amount}
                        date={formatDate(activity.date)}
                      />
                    ))
                  ) : (
                    <div className="py-8 text-center text-sm text-zinc-500">
                      Belum ada aktivitas terbaru.
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6">Jenis</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="px-6 text-right">Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboard?.recentActivities.length ? (
                      dashboard.recentActivities.map((activity) => (
                        <TableRow key={`${activity.type}-${activity.id}`}>
                          <TableCell className="px-6">
                            <Badge
                              variant={
                                activity.type === "SALE"
                                  ? "success"
                                  : activity.type === "EXPENSE"
                                    ? "danger"
                                    : "secondary"
                              }
                            >
                              {activity.type === "SALE"
                                ? "Penjualan"
                                : activity.type === "PURCHASE"
                                  ? "Pembelian"
                                  : "Pengeluaran"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-zinc-900">{activity.title}</div>
                            <div className="text-xs text-zinc-500">{activity.subtitle}</div>
                          </TableCell>
                          <TableCell>{formatDate(activity.date)}</TableCell>
                          <TableCell
                            className={cn(
                              "px-6 text-right font-medium",
                              activity.type === "EXPENSE"
                                ? "text-rose-700 dark:text-rose-400"
                                : activity.type === "SALE"
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-blue-700 dark:text-blue-400",
                            )}
                          >
                            {formatCurrency(activity.amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                          Belum ada aktivitas terbaru.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg font-bold text-zinc-900">Ringkasan Stok</CardTitle>
                <CardDescription className="text-[10px] xs:text-xs md:text-sm text-zinc-500">Posisi stok dan nilai persediaan per jenis produk.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      <Package className="h-4 w-4" />
                      Total stok
                    </div>
                    <p className="text-lg xs:text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white">{totalStockKg.toFixed(2)} kg</p>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      <Wallet className="h-4 w-4" />
                      Nilai persediaan
                    </div>
                    <p className="text-lg xs:text-xl sm:text-2xl font-semibold text-zinc-950 dark:text-white">{formatCurrency(totalInventoryValue)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {dashboard?.stockSummary.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">{product.name}</p>
                          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">
                            HPP rata-rata {formatCurrency(product.averageCostPerKg)}/kg
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-semibold text-zinc-950 dark:text-white">{product.currentStockKg.toFixed(2)} kg</p>
                          <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400">{formatCurrency(product.totalInventoryValue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
    </div>
  );
}
