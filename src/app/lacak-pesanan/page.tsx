"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface OrderStatus { id: string; customerName: string; productName: string; quantityKg: number; saleDate: string; paymentStatus: string; notes: string | null; }

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  UNPAID: { label: "Menunggu Pembayaran", color: "bg-amber-50 border-amber-200 text-amber-700", icon: <Clock className="h-5 w-5 text-amber-500" /> },
  PARTIAL: { label: "Pembayaran Sebagian", color: "bg-blue-50 border-blue-200 text-blue-700", icon: <Package className="h-5 w-5 text-blue-500" /> },
  PAID: { label: "Lunas — Siap Kirim", color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" /> },
};

export default function LacakPesananPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!orderId.trim()) return;
    setLoading(true); setNotFound(false); setResult(null);
    try {
      const res = await fetch(`/api/sales/${orderId.trim()}/public`);
      if (!res.ok) { setNotFound(true); } else { setResult(await res.json()); }
    } catch { setNotFound(true); }
    setLoading(false);
  };

  const statusInfo = result ? (STATUS_MAP[result.paymentStatus] ?? STATUS_MAP.UNPAID) : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SiteNavbar />

      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600"><Truck className="h-3 w-3" /> Lacak Pesanan</div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Cek Status Pesanan</h1>
          <p className="mt-4 text-sm text-zinc-500">Masukkan ID Transaksi yang diberikan admin untuk melihat status pesanan Anda secara real-time.</p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
          <div className="flex gap-3">
            <Input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Contoh: cm4xyz123abc..." className="flex-1" onKeyDown={e => e.key === "Enter" && search()} />
            <Button onClick={search} disabled={loading} className="gap-2"><Search className="h-4 w-4" />{loading ? "..." : "Cari"}</Button>
          </div>

          {notFound && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <XCircle className="h-5 w-5 shrink-0" /> ID Transaksi tidak ditemukan. Pastikan ID yang Anda masukkan benar.
            </div>
          )}

          {result && statusInfo && (
            <div className={`mt-6 rounded-xl border p-5 ${statusInfo.color}`}>
              <div className="flex items-center gap-3 mb-4">
                {statusInfo.icon}
                <div>
                  <p className="font-semibold">{statusInfo.label}</p>
                  <p className="text-xs opacity-70">ID: {result.id.slice(0, 16)}...</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                {[["Pelanggan", result.customerName], ["Produk", result.productName], ["Jumlah", `${result.quantityKg} kg`], ["Tanggal Order", new Date(result.saleDate).toLocaleDateString("id-ID")]].map(([k, v]) => (
                  <div key={k}><dt className="opacity-60">{k}</dt><dd className="font-semibold mt-0.5">{v}</dd></div>
                ))}
              </dl>
              {result.notes && <p className="mt-3 text-xs opacity-70 italic">Catatan: {result.notes}</p>}
            </div>
          )}

          <div className="mt-6 rounded-xl bg-zinc-50 border border-zinc-100 p-4 text-xs text-zinc-500">
            <p className="font-medium text-zinc-700 mb-1">Cara mendapatkan ID Transaksi:</p>
            <p>Minta ID Transaksi kepada tim admin CV. SIDARMA MAJUN melalui WhatsApp setelah melakukan pemesanan.</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
