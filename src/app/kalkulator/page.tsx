"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Phone, CheckCircle2, Truck, Leaf, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

const PRICES: Record<string, number> = {
  "majun-putih-lembaran": 18000,
  "majun-warna-lembaran": 12000,
  "majun-jahit-sambung": 14000,
  "majun-jahit-tumpuk": 16000,
  "sarung-tangan": 8000,
};

const PRODUCT_LABELS: Record<string, string> = {
  "majun-putih-lembaran": "Majun Putih: Lembaran (Tanpa Jahit)",
  "majun-warna-lembaran": "Majun Warna: Lembaran (Tanpa Jahit)",
  "majun-jahit-sambung": "Majun Jahit Sambung",
  "majun-jahit-tumpuk": "Majun Jahit Tumpuk (Heavy Duty)",
  "sarung-tangan": "Sarung Tangan Industri (per lusin)",
};

const SHIPPING: Record<string, number> = {
  pickup: 0,
  armada_darmin: 2500,
  kargo_jawa: 4000,
  ekspedisi_luar: 7000,
};

const SHIPPING_LABELS: Record<string, string> = {
  pickup: "Ambil Sendiri di Gudang Bandung (Gratis)",
  armada_darmin: "Armada Truk DARMIN (Bandung & Jabodetabek: Rp 2.500/kg)",
  kargo_jawa: "Kargo Darat Terjadwal (Jawa Tengah & Jawa Timur: Rp 4.000/kg)",
  ekspedisi_luar: "Kargo Laut / Ekspedisi Luar Pulau (Rp 7.000/kg)",
};

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function KalkulatorPage() {
  const [product, setProduct] = useState("majun-putih-lembaran");
  const [qty, setQty] = useState("50");
  const [shipping, setShipping] = useState("armada_darmin");
  const [calc, setCalc] = useState<{
    subtotal: number;
    shippingCost: number;
    total: number;
    balCount: number;
  } | null>(null);

  const calculate = () => {
    const kg = parseFloat(qty) || 0;
    const pricePerKg = PRICES[product] || 0;
    const subtotal = kg * pricePerKg;
    const shippingCost = (SHIPPING[shipping] || 0) * kg;
    const total = subtotal + shippingCost;
    const balCount = Math.ceil(kg / 25);
    setCalc({ subtotal, shippingCost, total, balCount });
  };

  const waText = calc
    ? encodeURIComponent(
        `Halo CV. DARMIN MAJUN,\n\nSaya ingin memesan simulasi pasokan berikut:\n- Produk: ${PRODUCT_LABELS[product]}\n- Jumlah: ${qty} kg (± ${calc.balCount} Bal Press 25kg)\n- Pengiriman: ${SHIPPING_LABELS[shipping]}\n- Estimasi Total: ${fmt(calc.total)}\n\nMohon informasi stok siap muat dan Surat Penawaran Harga (SPH) resmi. Terima kasih!`,
      )
    : "";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
              <Calculator className="h-3.5 w-3.5" />
              KALKULATOR ESTIMASI PENGADAAN B2B
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Simulasi Biaya & Kebutuhan Tonase
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Hitung estimasi anggaran belanja kain majun industri dan sarung tangan kerja berdasarkan volume pesanan dan tujuan pengiriman logistik.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-start">
            {/* Form Input: 7 cols */}
            <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h2 className="text-base font-bold text-zinc-950 dark:text-white">Parameter Kebutuhan</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Pilih grade material dan volume kilogram yang dibutuhkan.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Grade & Jenis Produk</label>
                  <Select
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    className="min-h-[44px] bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl text-xs"
                  >
                    {Object.entries(PRODUCT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v} ({fmt(PRICES[k])}/kg)
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Volume Pesanan (kg)</label>
                  <Input
                    type="number"
                    min="20"
                    step="5"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="Contoh: 100"
                    className="min-h-[44px] bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl text-xs"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-0.5">
                    <span>Minimal order: 20 kg</span>
                    <span>Standar bal press: 25 kg / bal</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Metode & Jangkauan Pengiriman</label>
                  <Select
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                    className="min-h-[44px] bg-zinc-100 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-xl text-xs"
                  >
                    {Object.entries(SHIPPING_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button
                  onClick={calculate}
                  className="w-full min-h-[48px] gap-2 mt-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm"
                >
                  <Calculator className="h-4 w-4" /> Hitung Simulasi Anggaran
                </Button>
              </div>
            </div>

            {/* Result Summary: 5 cols */}
            <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Ringkasan Estimasi</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">Hasil kalkulasi biaya proforma.</p>
              </div>

              {calc ? (
                <div className="space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-zinc-600 dark:text-zinc-400">Harga Satuan Material</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-200">{fmt(PRICES[product])} / kg</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-zinc-600 dark:text-zinc-400">Volume Total</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-200">{qty} kg</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-zinc-600 dark:text-zinc-400">Estimasi Kemasan</span>
                      <span className="font-mono text-amber-600 dark:text-amber-500 font-bold">{calc.balCount} Bal Press (25 kg)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-zinc-600 dark:text-zinc-400">Subtotal Material</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-200">{fmt(calc.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/80">
                      <span className="text-zinc-600 dark:text-zinc-400">Ongkos Logistik Kargo</span>
                      <span className="font-mono text-zinc-900 dark:text-zinc-200">{fmt(calc.shippingCost)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-4 space-y-1">
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Estimasi Total Proforma:</p>
                    <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {fmt(calc.total)}
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full min-h-[48px] gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
                  >
                    <a
                      href={`https://wa.me/6281234567890?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4" /> Ajukan Penawaran Resmi (SPH)
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10 space-y-2 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl">
                  <Calculator className="h-8 w-8 text-zinc-400 dark:text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Masukkan jumlah kilogram dan klik tombol "Hitung Simulasi Anggaran".</p>
                </div>
              )}

              <div className="rounded-xl bg-zinc-100/90 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 p-3.5 text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                <p className="font-semibold text-zinc-900 dark:text-zinc-300">Catatan Pengadaan Pabrik:</p>
                <p>Harga berlaku untuk pemesanan grosir. Untuk kontrak berkala di atas 1 Ton per bulan, tersedia negosiasi harga khusus dan fasilitas pembayaran tempo (TOP).</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
