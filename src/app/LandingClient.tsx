"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Factory,
  Gem,
  Handshake,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LandingData {
  [section: string]: {
    [key: string]: string;
  };
}

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
    desc: "Kain majun berbagai warna untuk berbagai fungsi. Tahan lama, absorbensi optimal, harga ekonomis.",
    uses: ["Pabrik & gudang", "Hotel & penginapan", "Kantor & gedung", "Pertanian & perikanan"],
    color: "bg-amber-50",
    icon: Gem,
  },
];

const defaultStats = [
  { value: "5+", label: "Tahun Pengalaman" },
  { value: "100+", label: "Toko Customer" },
  { value: "10 Ton", label: "Stok Tersedia" },
  { value: "24 Jam", label: "Respon Pemesanan" },
];

const defaultTrust = [
  "Bahan berkualitas, tidak mudah robek",
  "Daya serap tinggi & cepat kering",
  "Harga langsung dari distributor",
  "Pengiriman cepat ke seluruh Jawa",
  "Minimal order 20 kg",
  "Bisa cicilan untuk customer tetap",
];

const defaultSteps = [
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

function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function getVal(data: LandingData, section: string, key: string, fallback: string = ""): string {
  return data[section]?.[key] || fallback;
}

interface LandingClientProps {
  data: LandingData;
}

export default function LandingClient({ data }: LandingClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get dynamic content
  const heroBadge = getVal(data, "hero", "badge", "Supplier kain majun terpercaya sejak 2019");
  const heroTitle = getVal(data, "hero", "title", "Kain Majun Berkualitas");
  const heroSubtitle = getVal(data, "hero", "subtitle", "untuk Semua Kebutuhan");
  const heroDesc = getVal(data, "hero", "description", "Majun putih & warna siap kirim dalam quantity besar. Harga distributor, kualitas premium, pengiriman cepat ke seluruh Jawa.");
  const heroTrust1 = getVal(data, "hero", "trust1", "Bebas ongkir Jabodetabek");
  const heroTrust2 = getVal(data, "hero", "trust2", "Stock siap kirim");
  const waNumber = getVal(data, "hero", "wa_number", "6281234567890");

  const stats = [
    { value: getVal(data, "stats", "exp_years", "5+"), label: "Tahun Pengalaman" },
    { value: getVal(data, "stats", "customers", "100+"), label: "Toko Customer" },
    { value: getVal(data, "stats", "stock", "10 Ton"), label: "Stok Tersedia" },
    { value: getVal(data, "stats", "response", "24 Jam"), label: "Respon Pemesanan" },
  ];

  const trust = [
    getVal(data, "about", "trust1", defaultTrust[0]),
    getVal(data, "about", "trust2", defaultTrust[1]),
    getVal(data, "about", "trust3", defaultTrust[2]),
    getVal(data, "about", "trust4", defaultTrust[3]),
    getVal(data, "about", "trust5", defaultTrust[4]),
    getVal(data, "about", "trust6", defaultTrust[5]),
  ];

  const steps = [
    { n: "01", title: getVal(data, "order", "step1_title", "Hubungi Kami"), desc: getVal(data, "order", "step1_desc", "Chat via WhatsApp atau telepon untuk konsultasi kebutuhan."), icon: Phone },
    { n: "02", title: getVal(data, "order", "step2_title", "Konfirmasi Order"), desc: getVal(data, "order", "step2_desc", "Pilih produk, tentukan quantity, dan sepakati harga."), icon: CheckCircle2 },
    { n: "03", title: getVal(data, "order", "step3_title", "Proses & Kirim"), desc: getVal(data, "order", "step3_desc", "Barang disiapkan & dikirim lewat ekspedisi terpercaya."), icon: Clock },
  ];

  const aboutBadge = getVal(data, "about", "badge", "Kenapa Memilih Kami");
  const aboutTitle = getVal(data, "about", "title", "Distributor langsung, harga lebih hemat");
  const aboutDesc = getVal(data, "about", "description", "CV. SIDARMA MAJUN hadir sebagai solusi pasokan kain majun berkualitas dengan harga langsung dari sumber. Dengan pengalaman lebih dari 5 tahun, kami melayani ratusan toko dan pabrik di Pulau Jawa.");
  const address = getVal(data, "about", "address", "Jl. Industri Maju No. 18, Bandung");
  const hours = getVal(data, "about", "hours", "08.00 — 17.00 WIB");
  const phone = getVal(data, "about", "phone", "0812-3456-7890");
  const stock = getVal(data, "about", "stock", "± 10 Ton");

  const ctaTitle = getVal(data, "cta", "title", "Siap memesan kain majun?");
  const ctaSubtitle = getVal(data, "cta", "subtitle", "Hubungi kami sekarang via WhatsApp untuk konsultasi dan penawaran harga terbaik.");

  const companyName = getVal(data, "footer", "company_name", "CV. SIDARMA MAJUN");
  const footerDesc = getVal(data, "footer", "description", "Penyedia kain majun putih dan warna berkualitas untuk kebutuhan industri, bengkel, rumah sakit, dan cleaning service.");
  const waLabel = getVal(data, "footer", "wa_label", "WhatsApp");
  const waNumFooter = getVal(data, "footer", "wa_number", "0812-3456-7890");
  const emailLabel = getVal(data, "footer", "email_label", "Email");
  const email = getVal(data, "footer", "email", "sidarmamajun@gmail.com");
  const footerAddress = getVal(data, "footer", "address", "Jl. Industri Maju No. 18, Bandung");
  const hoursWeekday = getVal(data, "footer", "hours_weekday", "Senin — Jumat: 08.00 — 17.00");
  const hoursSaturday = getVal(data, "footer", "hours_saturday", "Sabtu: 08.00 — 14.00");
  const hoursSunday = getVal(data, "footer", "hours_sunday", "Minggu: Tutup");

  const mapsEmbed = getVal(data, "maps", "embed_url", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7419172!3d-6.2416776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjAuMCJTIDEwNsKwNDQnMzAuOSJF!5e0!3m2!1sid!2sid");
  const mapsLink = getVal(data, "maps", "maps_link", "https://maps.app.goo.gl/aJDEdUZwJ8M3wnEP9?g_st=ic");
  const locationName = getVal(data, "maps", "location_name", "Lokasi Gudang Kami");
  const locationSubtitle = getVal(data, "maps", "location_subtitle", "Area pergudangan & industri");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
      <style>{`
        html { scroll-behavior: smooth; }
        ::selection { background: zinc-200; color: zinc-900; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">
              <Factory className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">{companyName || "CV. SIDARMA MAJUN"}</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#produk" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200">Produk</a>
            <a href="#tentang" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200">Tentang</a>
            <a href="#cara-order" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200">Cara Order</a>
            <a href="#kontak" className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200">Kontak</a>
            <Button asChild size="sm" className="gap-2 shadow-sm">
              <Link href="/login">
                Masuk Admin <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </nav>

          <button
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-zinc-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-zinc-200/80 md:hidden bg-white/90 backdrop-blur-xl">
            <nav className="flex flex-col gap-1 p-4">
              <a href="#produk" className="rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Produk</a>
              <a href="#tentang" className="rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Tentang</a>
              <a href="#cara-order" className="rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Cara Order</a>
              <a href="#kontak" className="rounded-lg px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Kontak</a>
              <div className="mt-2 border-t border-zinc-100 pt-3">
                <Button asChild size="sm" className="w-full gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    Masuk Admin <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-24 pb-32 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-60"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-zinc-200/40 via-zinc-100/20 to-transparent blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-100/30 via-zinc-100/20 to-transparent blur-3xl"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 lg:items-center">
              <div>
                <FadeIn>
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {heroBadge}
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl lg:text-[3rem] leading-[1.1]">
                    {heroTitle}
                    <br />
                    <span className="text-zinc-400">{heroSubtitle}</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={200}>
                  <p className="mt-5 text-base leading-7 text-zinc-500 sm:text-lg max-w-md">
                    {heroDesc}
                  </p>
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Button asChild size="lg" className="gap-2 bg-zinc-950 hover:bg-zinc-900 text-white shadow-lg shadow-zinc-950/20">
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4" /> Chat WhatsApp
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="gap-2">
                      <Link href="/login">
                        Masuk Sistem <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </FadeIn>

                <FadeIn delay={400}>
                  <div className="mt-10 flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-zinc-500">{heroTrust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-zinc-500">{heroTrust2}</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={200} className="hidden lg:block">
                <div className="relative float-anim">
                  <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-amber-50 opacity-70 blur-2xl" />
                  <div className="relative rounded-2xl border border-zinc-200/60 bg-white/90 p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Majun Putih", val: "Tersedia" },
                        { label: "Majun Warna", val: "Tersedia" },
                        { label: "Min. Order", val: "20 kg" },
                        { label: "Pengiriman", val: "1-3 Hari" },
                        { label: "Harga", val: "Distributor" },
                        { label: "Kualitas", val: "Grade A" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-zinc-50/80 p-4">
                          <p className="text-xs text-zinc-400">{item.label}</p>
                          <p className={`mt-0.5 text-sm font-semibold ${item.label === "Harga" ? "text-emerald-600" : item.label === "Kualitas" ? "text-amber-600" : "text-zinc-700"}`}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl bg-zinc-950 px-4 py-3.5 text-center">
                      <p className="text-xs text-zinc-400">Rekomendasi untuk pertama kali</p>
                      <p className="mt-1 text-sm font-semibold text-white">Majun Putih Grade A — 50 kg</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="border-y border-zinc-200/80 bg-white/80 backdrop-blur-sm px-6 py-12 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 80}>
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="produk" className="px-6 py-24 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Produk Kami</h2>
                <p className="mt-3 text-base text-zinc-500">Dua jenis kain majun untuk berbagai kebutuhan cleaning & industri</p>
              </div>
            </FadeIn>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {products.map((p, i) => {
                const Icon = p.icon;
                return (
                  <FadeIn key={p.name} delay={i * 120}>
                    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300/80 hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.color} transition-transform duration-300 group-hover:scale-105`}>
                          <Icon className="h-5 w-5 text-zinc-600" />
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
                          Siap Kirim
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-zinc-950">{p.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{p.desc}</p>
                      <div className="mt-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Cocok untuk:</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.uses.map((u) => (
                            <span
                              key={u}
                              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100/80 px-3 py-1 text-xs text-zinc-600 border border-zinc-200/50"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-4 border-t border-zinc-100/80 pt-5">
                        <Button asChild size="sm" variant="outline" className="gap-2">
                          <a href={`https://wa.me/${waNumber}?text=Halo, saya mau tanya soal ${p.name}`} target="_blank" rel="noopener noreferrer">
                            Tanya Harga <ArrowRight className="h-3 w-3" />
                          </a>
                        </Button>
                        <span className="text-xs text-zinc-400">Respon &lt; 30 menit</span>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="tentang" className="bg-zinc-950 px-6 py-24 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <FadeIn>
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1.5 text-xs font-medium text-zinc-400">
                    <Handshake className="h-3 w-3" /> {aboutBadge}
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl leading-tight">
                    {aboutTitle}
                  </h2>
                </FadeIn>

                <FadeIn delay={200}>
                  <p className="mt-5 text-base leading-7 text-zinc-400">
                    {aboutDesc}
                  </p>
                </FadeIn>

                <FadeIn delay={300}>
                  <ul className="mt-8 space-y-4">
                    {trust.map((t) => (
                      <li key={t} className="flex items-start gap-3 text-sm text-zinc-300">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>

              <FadeIn delay={200}>
                <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
                  <div className="h-52 w-full overflow-hidden">
                    <iframe
                      src={mapsEmbed}
                      className="h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 border-b border-zinc-800/60 pb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/60">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{locationName}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">{locationSubtitle}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: "Alamat", val: address },
                        { label: "Jam Operasional", val: hours },
                        { label: "Kontak", val: phone },
                        { label: "Stok Tersedia", val: stock },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between">
                          <span className="text-xs text-zinc-500">{item.label}</span>
                          <span className={`text-xs ${item.label === "Stok Tersedia" ? "text-emerald-400 font-medium" : "text-zinc-300"}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="mt-5 w-full gap-2 bg-white/10 hover:bg-white/15 text-white border border-zinc-700/50 text-sm">
                      <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-3.5 w-3.5" /> Buka di Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* How to order */}
        <section id="cara-order" className="px-6 py-24 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">Cara Pemesanan</h2>
                <p className="mt-3 text-base text-zinc-500">Simpel dan cepat, cuma 3 langkah</p>
              </div>
            </FadeIn>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <FadeIn key={s.n} delay={i * 120}>
                    <div className="relative rounded-2xl border border-zinc-200/80 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      {i < steps.length - 1 && (
                        <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
                            <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                          </div>
                        </div>
                      )}
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-zinc-400">{s.n}</p>
                      <h3 className="mt-2 text-base font-semibold text-zinc-950">{s.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500">{s.desc}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-8 py-16 text-center shadow-xl sm:px-12 sm:py-20">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {ctaTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <p className="mt-4 text-base text-zinc-400">
                {ctaSubtitle}
              </p>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30">
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4" /> Chat WhatsApp Sekarang
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="gap-2 border-zinc-700/50 bg-white/5 hover:bg-white/10 text-white">
                  <Link href="/login">
                    Masuk Sistem Admin <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="kontak" className="border-t border-zinc-200/80 bg-white/80 px-6 py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">
                  <Factory className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">{companyName}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-500 max-w-sm">
                {footerDesc}
              </p>
              <div className="mt-6 flex gap-8">
                {[
                  { label: waLabel, val: waNumFooter },
                  { label: emailLabel, val: email },
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
              <ul className="mt-4 space-y-2.5">
                {[["#produk", "Produk"], ["#tentang", "Tentang"], ["#cara-order", "Cara Order"], ["/login", "Masuk Admin"]].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors duration-200">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-950">Jam Operasional</h4>
              <ul className="mt-4 space-y-2 text-sm text-zinc-500">
                <li>{hoursWeekday}</li>
                <li>{hoursSaturday}</li>
                <li>{hoursSunday}</li>
              </ul>
              <div className="mt-5 rounded-xl bg-zinc-50/80 border border-zinc-200/60 px-4 py-3">
                <p className="text-xs text-zinc-400">Alamat</p>
                <p className="mt-0.5 text-sm text-zinc-700">{footerAddress}</p>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-100/80 pt-8 text-center text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} {companyName}. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
}