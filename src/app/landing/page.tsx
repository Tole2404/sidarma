"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  Gem,
  Handshake,
  MapPin,
  Menu,
  Phone,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    name: "Majun Putih",
    desc: "Kain lap premium warna putih, daya serap tinggi. Cocok untuk cleaning industri, bengkel, dan rumah sakit.",
    uses: ["Industri & manufaktur", "Bengkel & otomotiv", "Rumah sakit & klinik", "Cleaning service"],
    color: "bg-zinc-100",
    icon: Factory,
  },
  {
    name: "Majun Warna",
    desc: "Kain majun berbagai warna untuk различия fungsi. Tahan lama, absorbensi optimal, harga ekonomis.",
    uses: ["Pabrik & gudang", "Hotel & penginapan", "Kantor & gedung", "Pertanian & perikanan"],
    color: "bg-amber-50",
    icon: Gem,
  },
];

const stats = [
  { value: "5+", label: "Tahun Pengalaman" },
  { value: "100+", label: "Toko Customer" },
  { value: "10 Ton", label: "Stok Tersedia" },
  { value: "24 Jam", label: "Respon Pemesanan" },
];

const trust = [
  "Bahan berkualitas, tidak mudah robek",
  "Daya serap tinggi & cepat kering",
  "Harga langsung dari distributor",
  "Pengiriman cepat ke seluruh Jawa",
  "Minimal order 20 kg",
  "Bisa cicilan untuk customer tetap",
];

const steps = [
  {
    n: "01",
    title: "Hubungi Kami",
    desc: "Chat via WhatsApp atau telepon untuk konsultasi kebutuhan.",
    icon: Phone,
  },
  {
    n: "02",
    title: "Konfirmasi Order",
    desc: "Pilih produk, tentukan quantity, dan sepakati harga.",
    icon: CheckCircle2,
  },
  {
    n: "03",
    title: "Proses & Kirim",
    desc: "Barang disiapkan & dikirim lewat ekspedisi terpercaya.",
    icon: Clock,
  },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Factory className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">CV. SIDARMA MAJUN</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#produk" className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors">Produk</a>
            <a href="#tentang" className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors">Tentang</a>
            <a href="#cara-order" className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors">Cara Order</a>
            <a href="#kontak" className="text-sm text-zinc-600 hover:text-zinc-950 transition-colors">Kontak</a>
            <Button asChild size="sm" className="gap-2">
              <Link href="/login">
                Masuk Admin <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-t border-zinc-200 md:hidden bg-white">
            <nav className="flex flex-col gap-1 p-4">
              <a href="#produk" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Produk</a>
              <a href="#tentang" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Tentang</a>
              <a href="#cara-order" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Cara Order</a>
              <a href="#kontak" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Kontak</a>
              <div className="mt-2 border-t border-zinc-200 pt-3">
                <Button asChild size="sm" className="w-full gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Masuk Admin <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-20 pb-28 sm:px-6 lg:px-8">
          {/* Subtle grid bg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  Supplier kain majun terpercaya sejak 2019
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-[2.75rem] leading-[1.1]">
                  Kain Majun Berkualitas
                  <br />
                  <span className="text-zinc-500">untuk Semua Kebutuhan Industri</span>
                </h1>
                <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg max-w-lg">
                  Majun putih & warna siap kirim dalam quantity besar. Harga distributor,
                  kualitas premium, pengiriman cepat ke seluruh Jawa.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="gap-2 bg-zinc-950 hover:bg-zinc-800 text-white">
                    <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" /> Chat WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/login">
                      Masuk Sistem <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-6 text-sm text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bebas ongkir Jabodetabek
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Stock siap kirim
                  </div>
                </div>
              </div>

              {/* Hero visual card */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-amber-100 opacity-60 blur-2xl" />
                  <div className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-200/50">
                    <div className="grid grid-cols-2 gap-5">
                      {[
                        { label: "Majun Putih", val: "Tersedia", color: "text-zinc-950" },
                        { label: "Majun Warna", val: "Tersedia", color: "text-zinc-950" },
                        { label: "Min. Order", val: "20 kg", color: "text-zinc-700" },
                        { label: "Pengiriman", val: "1-3 Hari", color: "text-zinc-700" },
                        { label: "Harga", val: "Distributor", color: "text-emerald-600 font-semibold" },
                        { label: "Kualitas", val: "Grade A", color: "text-amber-600 font-semibold" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-zinc-50 p-4">
                          <p className="text-xs text-zinc-500">{item.label}</p>
                          <p className={`mt-0.5 text-base font-semibold ${item.color}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-zinc-950 px-4 py-3 text-center">
                      <p className="text-sm text-zinc-400">Rekomendasi untuk pertama kali</p>
                      <p className="mt-1 text-base font-bold text-white">Majun Putih Grade A — 50 kg</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-zinc-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="produk" className="px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Produk Kami</h2>
              <p className="mt-2 text-base text-zinc-500">Dua jenis kain majun untuk berbagai kebutuhan cleaning & industri</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {products.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.name}
                    className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-zinc-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.color} transition-transform group-hover:scale-105`}>
                        <Icon className="h-6 w-6 text-zinc-700" />
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Siap Kirim
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-zinc-950">{p.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{p.desc}</p>
                    <div className="mt-5">
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Cocok untuk:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.uses.map((u) => (
                          <span
                            key={u}
                            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5">
                      <Button asChild size="sm" variant="outline" className="gap-2">
                        <a href={`https://wa.me/6281234567890?text=Halo, saya mau tanya soal ${p.name}`} target="_blank" rel="noopener noreferrer">
                          Tanya Harga <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      <span className="text-xs text-zinc-400">Respon &lt; 30 menit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section id="tentang" className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-400">
                  <Handshake className="h-3 w-3" /> Kenapa Memilih Kami
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Distributor langsung, harga lebih hemat
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-400">
                  CV. SIDARMA MAJUN hadir sebagai solusi 공급 kain majun berkualitas dengan harga langsung dari sumber. Dengan pengalaman lebih dari 5 tahun, kami melayani ratusan toko dan pabrik di Pulau Jawa.
                </p>
                <ul className="mt-8 space-y-3">
                  {trust.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-sm text-zinc-300">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-6">
                  <MapPin className="h-5 w-5 text-zinc-500" />
                  <div>
                    <p className="text-sm font-medium text-white">Lokasi Kami</p>
                    <p className="mt-0.5 text-xs text-zinc-500">Kavling Industri & Pergudangan Majun</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Alamat</span>
                    <span className="text-zinc-300 text-right max-w-[60%]">Jl. Industri Maju No. 18, Bandung</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Jam Operasional</span>
                    <span className="text-zinc-300">08.00 — 17.00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kontak</span>
                    <span className="text-zinc-300">0812-3456-7890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Stok Tersedia</span>
                    <span className="text-emerald-400 font-medium">± 10 Ton</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full gap-2 bg-white text-zinc-950 hover:bg-zinc-200">
                  <a href="https://maps.google.com/?q=Jl.+Industri+Maju+No.+18+Bandung" target="_blank" rel="noopener noreferrer">
                    <MapPin className="h-4 w-4" /> Lihat di Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How to order */}
        <section id="cara-order" className="px-4 py-20 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">Cara Pemesanan</h2>
              <p className="mt-2 text-base text-zinc-500">Simpel dan cepat, cuma 3 langkah</p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.n} className="relative rounded-2xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
                    {i < steps.length - 1 && (
                      <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white">
                          <ArrowRight className="h-3 w-3 text-zinc-400" />
                        </div>
                      </div>
                    )}
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-400">{s.n}</p>
                    <h3 className="mt-1 text-base font-semibold text-zinc-950">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-6 py-12 text-center shadow-xl sm:px-10 sm:py-14">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Siap memesan kain majun?
            </h2>
            <p className="mt-3 text-base text-zinc-400">
              Hubungi kami sekarang via WhatsApp untuk konsultasi dan penawaran harga terbaik.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" /> Chat WhatsApp Sekarang
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white">
                <Link href="/login">
                  Masuk Sistem Admin <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="kontak" className="border-t border-zinc-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
                  <Factory className="h-4 w-4" />
                </div>
                <span className="text-base font-semibold tracking-tight">CV. SIDARMA MAJUN</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-600 max-w-sm">
                Penyedia kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, rumah sakit, dan cleaning service.
              </p>
              <div className="mt-5 flex gap-4">
                {[
                  { label: "WhatsApp", val: "0812-3456-7890" },
                  { label: "Email", val: "sidarmamajun@gmail.com" },
                ].map((c) => (
                  <div key={c.label}>
                    <p className="text-xs font-medium text-zinc-400">{c.label}</p>
                    <p className="mt-0.5 text-sm text-zinc-700">{c.val}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950">Navigasi</h4>
              <ul className="mt-4 space-y-2">
                {[["#produk", "Produk"], ["#tentang", "Tentang"], ["#cara-order", "Cara Order"], ["/login", "Masuk Admin"]].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950">Jam Operasional</h4>
              <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                <li>Senin — Jumat: 08.00 — 17.00</li>
                <li>Sabtu: 08.00 — 14.00</li>
                <li>Minggu: Tutup</li>
              </ul>
              <div className="mt-5 rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2">
                <p className="text-xs text-zinc-500">Alamat</p>
                <p className="mt-0.5 text-sm text-zinc-700">Jl. Industri Maju No. 18, Bandung</p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-zinc-100 pt-6 text-center text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} CV. SIDARMA MAJUN. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}