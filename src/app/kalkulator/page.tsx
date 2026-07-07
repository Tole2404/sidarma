"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Phone, Leaf, ChevronRight } from "lucide-react";
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
  "majun-putih-lembaran": "Majun Putih – Lembaran",
  "majun-warna-lembaran": "Majun Warna – Lembaran",
  "majun-jahit-sambung": "Majun Jahit Sambung",
  "majun-jahit-tumpuk": "Majun Jahit Tumpuk",
  "sarung-tangan": "Sarung Tangan Industri (per lusin)",
};

const SHIPPING: Record<string, number> = { pickup: 0, jne: 15000, jnt: 12000, sicepat: 13000 };
const SHIPPING_LABELS: Record<string, string> = { pickup: "Ambil Sendiri (Gratis)", jne: "JNE (Rp 15.000/kg)", jnt: "J&T (Rp 12.000/kg)", sicepat: "SiCepat (Rp 13.000/kg)" };

// ESG constants per kg
const ESG = { waterSaved: 2.4, carbonReduced: 0.5, textileRecycled: 1 };

function fmt(n: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n); }

export default function KalkulatorPage() {
  const [product, setProduct] = useState("majun-putih-lembaran");
  const [qty, setQty] = useState("50");
  const [shipping, setShipping] = useState("pickup");
  const [calc, setCalc] = useState<{ subtotal: number; shippingCost: number; total: number; esg: { water: number; carbon: number; textile: number } } | null>(null);

  const calculate = () => {
    const kg = parseFloat(qty) || 0;
    const pricePerKg = PRICES[product] || 0;
    const subtotal = kg * pricePerKg;
    const shippingCost = SHIPPING[shipping] * kg;
    const total = subtotal + shippingCost;
    const esg = { water: +(kg * ESG.waterSaved).toFixed(1), carbon: +(kg * ESG.carbonReduced).toFixed(1), textile: kg };
    setCalc({ subtotal, shippingCost, total, esg });
  };

  const waText = calc
    ? encodeURIComponent(`Halo CV. SIDARMA MAJUN,\n\nSaya ingin memesan:\nProduk: ${PRODUCT_LABELS[product]}\nJumlah: ${qty} kg\nPengiriman: ${SHIPPING_LABELS[shipping]}\nEstimasi Total: ${fmt(calc.total)}\n\nMohon konfirmasi ketersediaan stok dan harga terbaik. Terima kasih!`)
    : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SiteNavbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-650 dark:text-zinc-300">
            <Calculator className="h-3 w-3" /> Kalkulator Harga
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">
            Simulasi Harga Order
          </h1>
          <p className="mt-3 text-xs sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Hitung estimasi biaya dan dampak lingkungan dari pembelian kain majun Anda sebelum menghubungi kami.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 xs:p-6 sm:p-8 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-zinc-955 dark:text-zinc-50 mb-4 sm:mb-6">Detail Pesanan</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Jenis Produk</label>
                <Select value={product} onChange={e => setProduct(e.target.value)} className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white">
                  {Object.entries(PRODUCT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
                <p className="text-[10px] sm:text-xs text-zinc-450 dark:text-zinc-550">Harga: {fmt(PRICES[product])}/kg</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Jumlah (kg)</label>
                <Input type="number" min="20" value={qty} onChange={e => setQty(e.target.value)} placeholder="Min. 20 kg" className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" />
                <p className="text-[10px] sm:text-xs text-zinc-450 dark:text-zinc-550">Minimum order: 20 kg</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">Metode Pengiriman</label>
                <Select value={shipping} onChange={e => setShipping(e.target.value)} className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white">
                  {Object.entries(SHIPPING_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </Select>
              </div>
              <Button onClick={calculate} className="w-full gap-2 mt-2 py-2 sm:py-3 text-xs sm:text-sm h-9 sm:h-11 rounded-lg sm:rounded-xl font-bold">
                <Calculator className="h-4 w-4" /> Hitung Estimasi
              </Button>
            </div>
          </div>

          {/* Result Panel */}
          <div className="space-y-4 sm:space-y-6">
            {calc ? (
              <>
                <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 xs:p-6 sm:p-8 shadow-sm">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-955 dark:text-zinc-50 mb-3 sm:mb-4">Estimasi Biaya</h2>
                  <dl className="space-y-2.5">
                    {[["Produk", fmt(calc.subtotal)], ["Ongkos Kirim", calc.shippingCost > 0 ? fmt(calc.shippingCost) : "Gratis"]].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs sm:text-sm">
                        <dt className="text-zinc-500 dark:text-zinc-400">{k}</dt>
                        <dd className="font-semibold text-zinc-955 dark:text-zinc-200">{v}</dd>
                      </div>
                    ))}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex justify-between">
                      <dt className="font-bold text-zinc-955 dark:text-zinc-200 text-xs sm:text-sm">Total Estimasi</dt>
                      <dd className="text-sm sm:text-lg font-bold text-emerald-600 dark:text-emerald-500">{fmt(calc.total)}</dd>
                    </div>
                  </dl>
                  <a href={`https://wa.me/6281234567890?text=${waText}`} target="_blank" rel="noopener noreferrer">
                    <Button className="mt-4 sm:mt-5 w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 sm:py-3 text-xs sm:text-sm h-9 sm:h-11 rounded-lg sm:rounded-xl font-bold">
                      <Phone className="h-4 w-4" /> Pesan via WhatsApp
                    </Button>
                  </a>
                </div>

                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Leaf className="h-4.5 w-4.5 text-emerald-650 dark:text-emerald-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">Dampak Lingkungan Positif Anda</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-450 mb-2 sm:mb-3">Dengan membeli {qty} kg kain majun daur ulang, Anda berkontribusi:</p>
                  <ul className="space-y-1.5">
                    {[
                      [`♻️ ${calc.esg.textile} kg limbah tekstil didaur ulang`, ""],
                      [`💧 ${calc.esg.water} liter air dihemat`, ""],
                      [`🌱 ${calc.esg.carbon} kg emisi CO₂ dikurangi`, ""],
                    ].map(([text]) => (
                      <li key={text} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400"><ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-600" />{text}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 shadow-sm">
                <div>
                  <Calculator className="mx-auto mb-3 h-8 w-8 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-550 leading-relaxed">Isi formulir dan klik <br /><strong>Hitung Estimasi</strong> untuk melihat hasil.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
