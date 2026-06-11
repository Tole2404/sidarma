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
  Layers,
  MapPin,
  Moon,
  Phone,
  Recycle,
  Shield,
  Star,
  Sun,
  Quote,
  Calculator,
  Briefcase,
  BookOpen,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface LandingData {
  [section: string]: {
    [key: string]: string;
  };
}

const products = [
  {
    name: "Majun Lembaran (Tanpa Jahit)",
    desc: "Kain potongan utuh tanpa sambungan. Daya serap tinggi, tidak meninggalkan serat. Ideal untuk mesin presisi dan permukaan kaca.",
    uses: ["Mesin presisi & optik", "Lab & farmasi", "Elektronik & semikonduktor", "Kaca & cermin"],
    color: "bg-zinc-100",
    icon: Factory,
  },
  {
    name: "Majun Jahit Sambung",
    desc: "Potongan perca dijahit menyambung memanjang. Ekonomis, berdaya serap optimal. Pilihan hemat untuk kebutuhan volume tinggi.",
    uses: ["Pabrik & gudang", "Bengkel otomotif", "Cleaning service", "Pertanian & perikanan"],
    color: "bg-amber-50",
    icon: Gem,
  },
  {
    name: "Majun Jahit Tumpuk",
    desc: "Beberapa lapis kain perca dijahit bertumpuk. Tebal, kuat, dan sangat efektif untuk membersihkan oli dan kotoran berat.",
    uses: ["Bengkel berat & kapal", "Industri minyak & gas", "Pabrik baja & logam", "Konstruksi"],
    color: "bg-orange-50",
    icon: Layers,
  },
  {
    name: "Sarung Tangan Industri",
    desc: "Sarung tangan benang katun untuk perlindungan tangan pekerja. Nyaman dipakai seharian, daya cengkeram optimal.",
    uses: ["Pabrik manufaktur", "Gudang & logistik", "Konstruksi", "Pertanian"],
    color: "bg-blue-50",
    icon: Shield,
  },
  {
    name: "Alat Pelindung Diri (APD)",
    desc: "Masker, kacamata safety, dan perlengkapan APD standar industri sebagai pelengkap keamanan kerja.",
    uses: ["Semua sektor industri", "Rumah sakit & klinik", "Laboratorium", "Pabrik kimia"],
    color: "bg-emerald-50",
    icon: Truck,
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

const defaultTestimonials = [
  { name: "Bapak Hendra", company: "CV. Maju Jaya Bengkel", role: "Owner", content: "Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan. Stok selalu tersedia dan pengiriman cepat.", rating: 5 },
  { name: "Ibu Sari", company: "PT. Bersih Semesta", role: "Purchasing Manager", content: "Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami. Harga distributor jauh lebih kompetitif dari pasar.", rating: 5 },
  { name: "Pak Doni", company: "Galangan Kapal Nusantara", role: "Site Manager", content: "Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal yang penuh oli berat, hasilnya memuaskan.", rating: 5 },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/sidarmamajun", svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { label: "Facebook", href: "https://facebook.com/sidarmamajun", svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { label: "TikTok", href: "https://tiktok.com/@sidarmamajun", svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.56a8.16 8.16 0 004.77 1.52V7.65a4.85 4.85 0 01-1-.96z"/></svg> },
  { label: "WhatsApp", href: "https://wa.me/6281234567890", svg: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("majun-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";
    setTheme(nextTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("majun-theme", theme);
  }, [theme, themeReady]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

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
  const copyrightText = getVal(data, "footer", "copyright", "");

  // Sosial media — dapat dikelola dari menu admin Footer.
  // Kosongkan URL agar link tidak ditampilkan.
  const socialDefs: { key: string; label: string; defaultUrl: string; svg: React.ReactNode }[] = SOCIAL_LINKS.map((s) => ({
    key: s.label.toLowerCase(),
    label: s.label,
    defaultUrl: s.href,
    svg: s.svg,
  }));
  const socialLinks = socialDefs
    .map((s) => ({
      ...s,
      href: getVal(data, "social", s.key, s.defaultUrl),
    }))
    .filter((s) => Boolean(s.href));

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
      <SiteNavbar companyName={companyName} />

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
                  <p className="mt-5 text-base leading-7 text-zinc-500 dark:text-zinc-400 sm:text-lg max-w-md">
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
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{heroTrust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">{heroTrust2}</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              <FadeIn delay={200} className="hidden lg:block">
                <div className="relative float-anim">
                  <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-zinc-200 via-zinc-100 to-amber-50 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800 opacity-70 blur-2xl" />
                  <div className="relative rounded-2xl border border-zinc-200/60 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/90 p-8 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 backdrop-blur-sm">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Majun Putih", val: "Tersedia" },
                        { label: "Majun Warna", val: "Tersedia" },
                        { label: "Min. Order", val: "20 kg" },
                        { label: "Pengiriman", val: "1-3 Hari" },
                        { label: "Harga", val: "Distributor" },
                        { label: "Kualitas", val: "Grade A" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-zinc-50/80 dark:bg-zinc-800/80 p-4">
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">{item.label}</p>
                          <p className={`mt-0.5 text-sm font-semibold ${item.label === "Harga" ? "text-emerald-600 dark:text-emerald-400" : item.label === "Kualitas" ? "text-amber-600 dark:text-amber-400" : "text-zinc-700 dark:text-zinc-200"}`}>{item.val}</p>
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
        <section className="border-y border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-6 py-12 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 80}>
                <div className="text-center">
                  <p className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.label}</p>
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
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Produk Kami</h2>
                <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">Dua jenis kain majun untuk berbagai kebutuhan cleaning & industri</p>
              </div>
            </FadeIn>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {products.map((p, i) => {
                const Icon = p.icon;
                return (
                  <FadeIn key={p.name} delay={i * 120}>
                    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-700 p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300/80 dark:hover:border-zinc-600 hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.color} dark:bg-zinc-800 transition-transform duration-300 group-hover:scale-105`}>
                          <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                        </div>
                        <span className="rounded-full bg-emerald-50 dark:bg-emerald-900/50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                          Siap Kirim
                        </span>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-zinc-950 dark:text-zinc-50">{p.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{p.desc}</p>
                      <div className="mt-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Cocok untuk:</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.uses.map((u) => (
                            <span
                              key={u}
                              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800 px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700"
                            >
                              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-4 border-t border-zinc-100/80 dark:border-zinc-800 pt-5">
                        <Button asChild size="sm" variant="outline" className="gap-2">
                          <a href={`https://wa.me/${waNumber}?text=Halo, saya mau tanya soal ${p.name}`} target="_blank" rel="noopener noreferrer">
                            Tanya Harga <ArrowRight className="h-3 w-3" />
                          </a>
                        </Button>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">Respon &lt; 30 menit</span>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* Banner: Jual Bongkaran (untuk konveksi) */}
        <section className="px-6 py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 p-8 shadow-sm dark:border-emerald-900/60 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-amber-950/20 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/30"
              />
              <div className="relative grid gap-6 lg:grid-cols-3 lg:items-center lg:gap-10">
                <div className="lg:col-span-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Recycle className="h-3 w-3" /> Khusus Konveksi & Garment
                  </div>
                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                    Punya bongkaran kain di gudang? Kami beli.
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-300">
                    Sisa potongan, kain reject, sample lama, atau stok mati di konveksi Anda — semuanya kami terima dengan harga terbaik. Tim kami yang jemput, bayar tunai di tempat.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Jemput gratis
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Bayar tunai
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Respon &lt; 30 menit
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <Button asChild size="lg" className="gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500">
                    <Link href="/jual-bongkaran">
                      Pelajari & Hubungi Kami <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Mulai dari 100 kg per pickup</p>
                </div>
              </div>
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
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Cara Pemesanan</h2>
                <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">Simpel dan cepat, cuma 3 langkah</p>
              </div>
            </FadeIn>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <FadeIn key={s.n} delay={i * 120}>
                    <div className="relative rounded-2xl border border-zinc-200/80 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      {i < steps.length - 1 && (
                        <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                            <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                          </div>
                        </div>
                      )}
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-zinc-950/20">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{s.n}</p>
                      <h3 className="mt-2 text-base font-semibold text-zinc-950 dark:text-zinc-50">{s.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{s.desc}</p>
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
                  <Link href="/lacak-pesanan">
                    <Truck className="h-4 w-4" /> Lacak Status Pesanan
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
          {/* Testimonials */}
          <section className="bg-white dark:bg-zinc-950 px-6 py-24 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <FadeIn>
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">Apa Kata Pelanggan Kami</h2>
                  <p className="mt-3 text-base text-zinc-500 dark:text-zinc-400">Dipercaya oleh ratusan pabrik, bengkel, dan cleaning service di seluruh Jawa</p>
                </div>
              </FadeIn>
              <div className="mt-12 grid gap-6 sm:grid-cols-3">
                {defaultTestimonials.map((t, i) => (
                  <FadeIn key={t.name} delay={i * 100}>
                    <div className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900 p-6 shadow-sm h-full">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(t.rating)].map((_, j) => (
                          <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300 flex-1 italic">"{t.content}"</p>
                      <div className="mt-5 flex items-center gap-3 border-t border-zinc-200/60 dark:border-zinc-800 pt-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white text-xs font-bold">
                          {t.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{t.name}</p>
                          <p className="text-xs text-zinc-400">{t.role} · {t.company}</p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
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
                    <Link href="/kalkulator">
                      <Calculator className="h-4 w-4" /> Hitung Estimasi Harga
                    </Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </section>
        </main>

      <SiteFooter
        companyName={companyName}
        address={footerAddress}
        phone={phone}
        email={email}
        hoursWeekday={hoursWeekday}
        hoursSaturday={hoursSaturday}
        hoursSunday={hoursSunday}
        footerDesc={footerDesc}
      />
    </div>
  );
}