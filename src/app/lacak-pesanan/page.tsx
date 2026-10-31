"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, CheckCircle2, Clock, Truck, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface OrderStatus {
  id: string;
  customerName: string;
  productName: string;
  quantityKg: number;
  saleDate: string;
  paymentStatus: string;
  notes: string | null;
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  UNPAID: {
    label: "Menunggu Pembayaran",
    color: "bg-amber-950/30 border-amber-800 text-amber-300",
    icon: <Clock className="h-5 w-5 text-amber-400" />,
  },
  PARTIAL: {
    label: "Pembayaran Sebagian",
    color: "bg-blue-950/30 border-blue-800 text-blue-300",
    icon: <Package className="h-5 w-5 text-blue-400" />,
  },
  PAID: {
    label: "Lunas: Siap Kirim",
    color: "bg-emerald-950/30 border-emerald-800 text-emerald-300",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  },
};

export default function LacakPesananPage() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    try {
      const res = await fetch(`/api/sales/${encodeURIComponent(orderId.trim())}/public`);
      if (!res.ok) {
        setNotFound(true);
      } else {
        setResult(await res.json());
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  };

  const statusInfo = result ? STATUS_MAP[result.paymentStatus] ?? STATUS_MAP.UNPAID : null;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
              <Truck className="h-3.5 w-3.5" />
              SISTEM MONITORING LOGISTIK
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Lacak Status Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Masukkan nomor Surat Jalan atau ID Transaksi resmi dari faktur CV. DARMIN MAJUN untuk memantau status muat dan pengiriman.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Masukkan ID Transaksi (contoh: cm4xyz123...)"
                className="flex-1 min-h-[44px] bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl text-xs sm:text-sm placeholder-zinc-500"
                onKeyDown={(e) => e.key === "Enter" && search()}
              />
              <Button
                onClick={search}
                disabled={loading}
                className="min-h-[44px] px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm"
              >
                <Search className="h-4 w-4" />
                {loading ? "Mencari..." : "Lacak Status"}
              </Button>
            </div>

            {notFound && (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/20 p-4 text-xs text-rose-800 dark:text-rose-300">
                <XCircle className="h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
                <div>
                  <p className="font-semibold">ID Transaksi tidak ditemukan</p>
                  <p className="text-rose-600 dark:text-rose-400/80 mt-0.5">Pastikan kode yang dimasukkan sesuai dengan faktur atau surat jalan yang Anda terima.</p>
                </div>
              </div>
            )}

            {result && statusInfo && (
              <div className={`rounded-xl border p-5 ${statusInfo.color} space-y-4`}>
                <div className="flex items-center justify-between pb-3 border-b border-current/20">
                  <div className="flex items-center gap-3">
                    {statusInfo.icon}
                    <div>
                      <p className="font-bold text-sm text-zinc-950 dark:text-white">{statusInfo.label}</p>
                      <p className="text-[11px] font-mono opacity-80">ID: {result.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-white/10 text-zinc-800 dark:text-white">
                    Terverifikasi
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 text-[11px]">Nama Pemesan / Perusahaan</dt>
                    <dd className="font-bold text-zinc-950 dark:text-white mt-0.5">{result.customerName}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 text-[11px]">Material Produk</dt>
                    <dd className="font-bold text-zinc-950 dark:text-white mt-0.5">{result.productName}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 text-[11px]">Volume Muat</dt>
                    <dd className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{result.quantityKg} kg</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 text-[11px]">Tanggal Pemesanan</dt>
                    <dd className="font-mono font-medium text-zinc-900 dark:text-white mt-0.5">
                      {new Date(result.saleDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>

                {result.notes && (
                  <div className="pt-2 border-t border-current/20 text-[11px] text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold">Catatan Pengiriman:</span> {result.notes}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-xl bg-zinc-100/90 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
              <p className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-amber-500" />
                Cara Memperoleh ID Transaksi:
              </p>
              <p className="leading-relaxed">
                ID Transaksi tertera pada faktur resmi dan Surat Jalan pengiriman yang diberikan admin CV. DARMIN MAJUN setelah pembayaran atau konfirmasi pemesanan disetujui.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
