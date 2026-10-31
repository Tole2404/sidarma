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
    title: "Harga Pembelian Kompetitif",
    desc: "Kami membeli kain bongkaran dan perca konveksi dengan valuasi harga yang adil per kilogram. Mulai dari skala karungan hingga pasokan tonase rutin.",
  },
  {
    icon: Truck,
    title: "Penjemputan Armada Gratis",
    desc: "Tim logistik DARMIN datang langsung mengambil ke lokasi gudang atau konveksi Anda. Tanpa biaya transportasi tambahan untuk minimal 100 kg.",
  },
  {
    icon: Clock,
    title: "Pembayaran Tunai di Lokasi",
    desc: "Setelah barang ditimbang dan disortir bersama, pembayaran langsung diselesaikan secara tunai atau transfer saat itu juga di tempat.",
  },
  {
    icon: Recycle,
    title: "Pemanfaatan Daur Ulang Tekstil",
    desc: "Limbah kain perca sisa pola cutting yang tidak terpakai kami olah menjadi kain majun bermanfaat untuk kebutuhan industri manufaktur nasional.",
  },
  {
    icon: Scale,
    title: "Timbangan Digital Terbuka",
    desc: "Menggunakan timbangan digital gantung dan lantai yang terkalibrasi akurat. Anda dapat menyaksikan dan memverifikasi langsung setiap proses timbang.",
  },
  {
    icon: Shield,
    title: "Kemitraan Rutin Berkelanjutan",
    desc: "Kami memprioritaskan mitra konveksi dan garment untuk jadwal pengambilan berkala mingguan atau bulanan agar gudang produksi Anda selalu rapi.",
  },
];

const acceptedItems = [
  {
    title: "Sisa Potongan Kain (Perca Cutting)",
    desc: "Sisa kain potongan pola meja potong dari bahan katun kaos, fleece, baby terry, dan bahan industri garmen.",
  },
  {
    title: "Kain Reject Produksi & Cacat Pabrik",
    desc: "Produk gagal jahit, salah potong, salah sablon, atau belang warna kain yang tidak lolos QC garment.",
  },
  {
    title: "Sisa Ujung Rol Kain",
    desc: "Sisa gulungan rol kain, sisa gelaran meja potong, dan sisa kain stok sisa produksi lama.",
  },
  {
    title: "Sampel Pengembangan & Afkiran",
    desc: "Koleksi kain sampel musim lalu, sisa development produk, dan kain afkiran stok konveksi.",
  },
  {
    title: "Dead Stock Bongkaran Gudang",
    desc: "Stok kain rol atau lembaran mati yang sudah bertahun-tahun menumpuk di gudang garmen Anda.",
  },
  {
    title: "Campuran Warna & Jenis Perca",
    desc: "Tidak perlu Anda sortir terlebih dahulu di pabrik Anda. Tim kami yang akan memilah dan mengklasifikasikan di fasilitas gudang kami.",
  },
];

const flowSteps = [
  {
    n: "01",
    title: "Kontak WhatsApp & Kirim Foto",
    subtitle: "Estimasi Jenis & Tonase",
    desc: "Kirimkan foto tumpukan kain bongkaran beserta perkiraan berat kotor (kg) melalui chat WhatsApp admin kami.",
  },
  {
    n: "02",
    title: "Penawaran Harga Resmi",
    subtitle: "Valuasi Berdasarkan Kualitas Bahan",
    desc: "Tim kami mengevaluasi spesifikasi jenis bahan (katun combed, carded, polycotton, atau campuran) dan memberikan harga beli per kg.",
  },
  {
    n: "03",
    title: "Penjemputan & Timbang di Lokasi",
    subtitle: "Armada Mobil DARMIN",
    desc: "Armada kami menjadwalkan kunjungan ke lokasi konveksi Anda, melakukan penimbangan digital terbuka yang disaksikan bersama.",
  },
  {
    n: "04",
    title: "Penyelesaian Pembayaran Langsung",
    subtitle: "Tunai / Transfer di Tempat",
    desc: "Total timbangan dikalikan harga sepakat, lalu langsung dibayarkan tunai atau transfer seketika sebelum armada meninggalkan lokasi.",
  },
];

export default function JualBongkaranClient({ data }: { data: LandingData }) {
  const waNumber = getVal(data, "hero", "wa_number", "6281234567890").replace(/[^0-9+]/g, "");
  const companyName = getVal(data, "footer", "company_name", "CV. DARMIN MAJUN");
  const address = getVal(data, "about", "address", "Jl. Industri Maju No. 18, Bandung");
  const phone = getVal(data, "about", "phone", "0812-3456-7890");

  const heroBadge = getVal(data, "jual_bongkaran", "badge", "Kemitraan Konveksi & Garment");
  const heroTitle = getVal(data, "jual_bongkaran", "title", "Jual Sisa Kain & Bongkaran Gudang Konveksi Anda");
  const heroSubtitle = getVal(data, "jual_bongkaran", "subtitle", "Kami Jemput ke Lokasi, Timbang Akurat, dan Bayar Tunai di Tempat");
  const heroDesc = getVal(
    data,
    "jual_bongkaran",
    "description",
    "Sisa potongan kain perca, kain reject hasil cutting, dan stok kain mati di gudang konveksi Anda kami beli dengan harga terbaik. Ubah tumpukan limbah kain menjadi arus kas tambahan tanpa repot mengantar.",
  );
  const ctaWaText = getVal(
    data,
    "jual_bongkaran",
    "wa_text",
    `Halo ${companyName}, kami dari pihak konveksi ingin menjual sisa kain bongkaran. Mohon informasi harga beli per kg dan jadwal penjemputan armada.`,
  );

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(ctaWaText)}`;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      <SiteNavbar companyName={companyName} />

      <main className="flex-1 overflow-x-hidden">
        {/* HERO SECTION: High-Craft Industrial B2B Header */}
        <section className="relative border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 pt-12 pb-14 sm:pt-20 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                    <Recycle className="h-3.5 w-3.5" />
                    {heroBadge}
                  </div>
                  <h1 className="mt-3 text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-zinc-950 dark:text-white leading-[1.12]">
                    {heroTitle}
                  </h1>
                  <p className="mt-3 text-base sm:text-lg font-bold text-zinc-700 dark:text-zinc-300">
                    {heroSubtitle}
                  </p>
                </div>

                <div
                  className="text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-xl prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: heroDesc }}
                />

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="min-h-[48px] h-12 px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" /> Hubungi Admin Penjemputan
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-h-[48px] h-12 px-6 gap-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
                  >
                    <a href="#alur">
                      Alur Kerja & Syarat <ArrowRight className="h-4 w-4 text-zinc-500" />
                    </a>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Bayar Tunai di Tempat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Jemput Gratis Minimal 100 kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Timbangan Digital Terbuka</span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Checklist Card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                      Material yang Diterima
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                      Semua Kondisi Kain
                    </span>
                  </div>

                  <div className="space-y-3">
                    {acceptedItems.slice(0, 4).map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-emerald-500/20 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
                    <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      Kapasitas Penjemputan Armada
                    </p>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-0.5">
                      Mulai 100 kg hingga 5 Ton per penjemputan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION: 6 Clear Structured Value Props */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/70 dark:bg-zinc-900/30 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                KEUNGGULAN KEMITRAAN
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Mengapa Konveksi Memilih Menjual ke DARMIN?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ratusan pemilik konveksi dan garment di Bandung, Cimahi, dan Jabodetabek telah menjadi mitra pasokan rutin kami karena transparansi dan kepastian transaksi.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.title}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-xl bg-zinc-200 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-zinc-950 dark:text-white">
                        {b.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ACCEPTED ITEMS DETAIL */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  JENIS LIMBAH KAIN
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  Semua Jenis Kain Perca & Stok Gudang Kami Beli
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Anda tidak perlu meluangkan waktu tenaga kerja untuk memilah atau mensortir kain. Bawa langsung seluruh tumpukan sisa produksi Anda, tim kami yang akan menyortir di gudang kami.
                </p>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900 p-4 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
                  <p className="font-semibold text-zinc-900 dark:text-white">Cakupan Wilayah Penjemputan:</p>
                  <p className="text-zinc-600 dark:text-zinc-400">Bandung Raya, Cimahi, Garut, Tasikmalaya, Purwakarta, Karawang, dan Jabodetabek.</p>
                </div>
              </div>

              <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
                {acceptedItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 p-4 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 pl-6">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ALUR KERJA: 4 Clear Procurement Stages */}
        <section id="alur" className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/70 dark:bg-zinc-900/40 px-6 py-14 sm:py-20 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                PROSES TRANSAKSI
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Alur Penjualan Cepat & Transparan
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Mulai dari kirim foto hingga pembayaran tunai di tempat diselesaikan secara efisien dalam 1 hingga 2 hari kerja.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {flowSteps.map((step) => (
                <div
                  key={step.n}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-5 space-y-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-2xl font-black font-mono text-zinc-400 dark:text-zinc-600">
                        {step.n}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Tahap {step.n}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-zinc-950 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {step.subtitle}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80 p-6 sm:p-12 text-center space-y-6 shadow-xl">
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                PUSAT PENERIMAAN KAIN BONGKARAN
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Siap Menjual Limbah Kain Konveksi Anda?
              </h2>
            </div>

            <p className="text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
              Hubungi tim penjemputan DARMIN sekarang via WhatsApp. Kirimkan foto tumpukan kain dan dapatkan penawaran harga beli per kilogram dalam 30 menit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                className="w-full sm:w-auto min-h-[48px] px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
              >
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="h-4 w-4" /> Hubungi Admin via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto min-h-[48px] px-6 gap-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
              >
                <Link href="/katalog">
                  Lihat Hasil Olahan Kain Majun <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
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
