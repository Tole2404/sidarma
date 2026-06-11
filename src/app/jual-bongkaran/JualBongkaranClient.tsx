"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  Factory,
  Layers,
  MapPin,
  Phone,
  Recycle,
  Scale,
  Shield,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface LandingData {
  [section: string]: { [key: string]: string };
}

function getVal(data: LandingData, section: string, key: string, fallback = ""): string {
  return data[section]?.[key] || fallback;
}

const benefits = [
  {
    icon: Banknote,
    title: "Harga Terbaik di Pasaran",
    desc: "Kami beli kain bongkaran konveksi dengan harga kompetitif. Stok kecil maupun ton-an, semua dihargai layak.",
  },
  {
    icon: Truck,
    title: "Penjemputan Gratis",
    desc: "Tim kami yang datang ambil ke lokasi konveksi. Tidak perlu repot mengantar — cukup jadwalkan via WhatsApp.",
  },
  {
    icon: Clock,
    title: "Bayar Cash di Tempat",
    desc: "Begitu barang ditimbang dan dicek, pembayaran langsung tunai. Tidak ada drama hutang atau tunda bayar.",
  },
  {
    icon: Recycle,
    title: "Mendukung Sirkular Ekonomi",
    desc: "Bongkaran konveksi yang biasanya dibuang, kami olah jadi kain majun bermanfaat. Reduce textile waste.",
  },
  {
    icon: Scale,
    title: "Timbangan Adil",
    desc: "Pakai timbangan digital terkalibrasi. Anda boleh saksikan langsung saat penimbangan.",
  },
  {
    icon: Shield,
    title: "Kerja Sama Jangka Panjang",
    desc: "Konveksi tetap kami prioritaskan. Frekuensi pickup teratur, harga lebih baik, dan pembayaran lebih cepat.",
  },
];

const acceptedItems = [
  { title: "Sisa potongan kain", desc: "Perca cutting room dari semua jenis garmen" },
  { title: "Kain reject produksi", desc: "Defect, salah size, salah warna — kami terima semua" },
  { title: "Sisa rol kain", desc: "Ujung rol, sisa lay yang tidak terpakai produksi" },
  { title: "Sample & afkir", desc: "Sample lama, sisa development, kain afkiran" },
  { title: "Bongkaran gudang", desc: "Stock dead yang sudah lama tidak terpakai" },
  { title: "Mix campuran", desc: "Tidak harus sortir dulu — kami sortir di gudang kami" },
];

const flowSteps = [
  {
    n: "01",
    title: "Hubungi via WhatsApp",
    desc: "Kirim foto stok bongkaran dan estimasi quantity (kg). Kami akan respon dalam 30 menit.",
  },
  {
    n: "02",
    title: "Penawaran Harga",
    desc: "Tim kami review foto dan kasih penawaran harga per kg sesuai jenis & kondisi bahan.",
  },
  {
    n: "03",
    title: "Penjemputan & Penimbangan",
    desc: "Kami jadwalkan ambil ke lokasi konveksi. Timbang di tempat, transparan, disaksikan langsung.",
  },
  {
    n: "04",
    title: "Pembayaran Tunai",
    desc: "Begitu cocok jumlahnya, dibayar cash di tempat. Selesai. Mudah dan cepat.",
  },
];

export default function JualBongkaranClient({ data }: { data: LandingData }) {
  const waNumber = getVal(data, "hero", "wa_number", "6281234567890");
  const companyName = getVal(data, "footer", "company_name", "CV. SIDARMA MAJUN");
  const address = getVal(data, "about", "address", "Jl. Industri Maju No. 18, Bandung");
  const phone = getVal(data, "about", "phone", "0812-3456-7890");

  // CMS-driven (with sane defaults)
  const heroBadge = getVal(data, "jual_bongkaran", "badge", "Untuk Konveksi & Garment");
  const heroTitle = getVal(data, "jual_bongkaran", "title", "Jual Kain Bongkaran Konveksi Anda");
  const heroSubtitle = getVal(data, "jual_bongkaran", "subtitle", "Kami beli, kami jemput, kami bayar tunai");
  const heroDesc = getVal(
    data,
    "jual_bongkaran",
    "description",
    "Sisa potongan kain, kain reject, sample lama, dan stok bongkaran gudang konveksi Anda — semuanya kami beli dengan harga terbaik. Jadikan limbah produksi sebagai pemasukan tambahan.",
  );
  const ctaWaText = getVal(
    data,
    "jual_bongkaran",
    "wa_text",
    `Halo ${companyName}, saya konveksi yang mau jual kain bongkaran. Mohon info harga & cara penjemputan.`,
  );

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(ctaWaText)}`;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <SiteNavbar companyName={companyName} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-24 lg:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-200/40 via-zinc-100/20 to-transparent blur-3xl dark:from-emerald-900/30"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-100/30 via-zinc-100/20 to-transparent blur-3xl dark:from-amber-900/20"
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Recycle className="h-3 w-3" />
                  {heroBadge}
                </div>
                <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-950 sm:text-5xl lg:text-[3rem] dark:text-zinc-50">
                  {heroTitle}
                </h1>
                <p className="mt-4 text-lg font-medium text-zinc-700 dark:text-zinc-200">
                  {heroSubtitle}
                </p>
                <p className="mt-5 max-w-md text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  {heroDesc}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500">
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" /> Chat WhatsApp Sekarang
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <a href="#alur">
                      Lihat Cara Kerjanya <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <div className="mt-8 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Bayar tunai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Jemput gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Respon &lt; 30 menit</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-emerald-200 via-zinc-100 to-amber-50 opacity-70 blur-2xl dark:from-emerald-900 dark:via-zinc-900 dark:to-zinc-800" />
                  <div className="relative rounded-2xl border border-zinc-200/60 bg-white/90 p-7 shadow-xl shadow-zinc-200/50 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:shadow-zinc-950/50">
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Yang Kami Beli
                    </p>
                    <div className="mt-4 space-y-3">
                      {acceptedItems.slice(0, 4).map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <div>
                            <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-emerald-600 px-4 py-3 text-center text-white">
                      <p className="text-xs opacity-80">Mulai dari</p>
                      <p className="mt-0.5 text-sm font-semibold">100 kg / pickup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-y border-zinc-200/80 bg-white/60 px-6 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
                Kenapa Konveksi Memilih Kami?
              </h2>
              <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">
                Sudah ratusan konveksi di Bandung dan sekitarnya yang jadi mitra rutin.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-zinc-950 dark:text-zinc-100">{b.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{b.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Yang kami terima */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  <Layers className="h-3 w-3" /> Yang Kami Terima
                </div>
                <h2 className="mt-5 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
                  Semua jenis kain bongkaran konveksi
                </h2>
                <p className="mt-4 text-base leading-7 text-zinc-500 dark:text-zinc-400">
                  Tidak perlu pilah-pilah dulu. Semua kondisi kami terima — yang penting masih kain. Kami yang sortir di gudang kami.
                </p>
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  Khusus untuk konveksi/garment skala kecil-menengah-besar di area Jawa Barat, Banten, dan Jakarta.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {acceptedItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-zinc-200/80 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-zinc-950 dark:text-zinc-100">{item.title}</p>
                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Alur kerja */}
        <section id="alur" className="scroll-mt-20 bg-zinc-950 px-6 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Cara Kerjanya — Mudah & Cepat</h2>
              <p className="mt-3 text-base text-zinc-400">
                Dari kontak pertama sampai uang di tangan, biasanya selesai dalam 1–2 hari kerja.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {flowSteps.map((s, i) => (
                <div key={s.n} className="relative">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
                    <p className="text-xs font-mono text-emerald-400">{s.n}</p>
                    <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{s.desc}</p>
                  </div>
                  {i < flowSteps.length - 1 ? (
                    <div className="absolute top-1/2 -right-3 hidden h-0.5 w-6 -translate-y-1/2 bg-zinc-700 lg:block" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lokasi & kontak */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" /> Gudang Kami
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-950 dark:text-zinc-100">{companyName}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{address}</p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <Phone className="h-3.5 w-3.5" /> Kontak
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-950 dark:text-zinc-100">{phone}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Senin–Sabtu, 08.00–17.00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA bawah */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 text-center dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-zinc-950">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
              Siap menjual bongkaran Anda?
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300">
              Chat WhatsApp sekarang, kirim foto stok, dan dapatkan penawaran harga dalam 30 menit.
            </p>
            <Button asChild size="lg" className="mt-6 gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4" /> Chat WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter
        companyName={companyName}
        address={address}
        phone={phone}
      />
    </div>
  );
}
