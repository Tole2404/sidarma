"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Handshake,
  MapPin,
  Phone,
  Recycle,
  Star,
  Calculator,
  Truck,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface LandingData {
  [section: string]: {
    [key: string]: string;
  };
}

const defaultProducts = [
  {
    name: "Majun Lembaran (Tanpa Jahit)",
    category: "Kain Majun",
    desc: "Kain potongan utuh tanpa sambungan. Daya serap tinggi, tidak meninggalkan serat. Ideal untuk mesin presisi & permukaan kaca.",
    uses: ["Mesin presisi & optik", "Lab & farmasi", "Elektronik & semikonduktor", "Kaca & cermin"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Majun Jahit Sambung",
    category: "Kain Majun",
    desc: "Potongan perca dijahit menyambung memanjang. Ekonomis, berdaya serap optimal. Pilihan hemat untuk kebutuhan volume tinggi.",
    uses: ["Pabrik & gudang", "Bengkel otomotif", "Cleaning service", "Pertanian & perikanan"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Majun Jahit Tumpuk",
    category: "Kain Majun",
    desc: "Beberapa lapis kain perca dijahit bertumpuk. Tebal, kuat, dan sangat efektif untuk membersihkan oli dan kotoran berat.",
    uses: ["Bengkel berat & kapal", "Industri minyak & gas", "Pabrik baja & logam", "Konstruksi"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sarung Tangan Industri",
    category: "Alat Pelindung",
    desc: "Sarung tangan benang katun untuk perlindungan tangan pekerja. Nyaman dipakai seharian, daya cengkeram optimal.",
    uses: ["Pabrik manufaktur", "Gudang & logistik", "Konstruksi", "Pertanian"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Alat Pelindung Diri (APD)",
    category: "Alat Pelindung",
    desc: "Masker, kacamata safety, dan perlengkapan APD standar industri sebagai pelengkap keamanan kerja.",
    uses: ["Semua sektor industri", "Rumah sakit & klinik", "Laboratorium", "Pabrik kimia"],
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80",
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
  { name: "Bapak Hendra", company: "CV. Maju Jaya Bengkel", role: "Owner", content: "Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan. Stok selalu tersedia dan pengiriman cepat.", rating: 5, avatar: "" },
  { name: "Ibu Sari", company: "PT. Bersih Semesta", role: "Purchasing Manager", content: "Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami. Harga distributor jauh lebih kompetitif dari pasar.", rating: 5, avatar: "" },
  { name: "Pak Doni", company: "Galangan Kapal Nusantara", role: "Site Manager", content: "Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal yang penuh oli berat, hasilnya memuaskan.", rating: 5, avatar: "" },
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

function StatCounter({ value }: { value: string }) {
  const { ref, isVisible } = useInView({ threshold: 0.1 });
  const match = value.match(/^([\d.,]+)\s*(.*)$/);
  const targetNumber = match ? parseFloat(match[1].replace(/,/g, "")) || 0 : 0;
  const suffix = match ? match[2] || "" : value;

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1800; // 1.8 seconds animation
    const steps = 45;
    const stepTime = duration / steps;
    const increment = targetNumber / steps;
    
    const runAnimation = () => {
      let currentStep = 0;
      setCount(0);
      
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setCount(targetNumber);
          clearInterval(interval);
        } else {
          setCount(Math.floor(increment * currentStep));
        }
      }, stepTime);
      
      return interval;
    };

    let animationInterval = runAnimation();

    // Loop animation every 10 seconds
    const loopInterval = setInterval(() => {
      clearInterval(animationInterval);
      animationInterval = runAnimation();
    }, 10000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(loopInterval);
    };
  }, [targetNumber, isVisible]);

  const space = suffix && suffix !== "+" && suffix !== "%" ? " " : "";
  return (
    <span ref={ref as any}>
      {count}
      {space}
      {suffix}
    </span>
  );
}

interface LandingClientProps {
  data: LandingData;
}

export default function LandingClient({ data }: LandingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [visibleTestimonialCount, setVisibleTestimonialCount] = useState(3);
  const [testimonialFilter, setTestimonialFilter] = useState("Semua");
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
        setVisibleTestimonialCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
        setVisibleTestimonialCount(2);
      } else {
        setVisibleItems(3);
        setVisibleTestimonialCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);
 
  useEffect(() => {
    setTestimonialIndex(0);
  }, [testimonialFilter]);

  const [loadMap, setLoadMap] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoadMap(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const categories = ["Semua", "Kain Majun", "Alat Pelindung"];

  let productsList = defaultProducts;
  try {
    const rawProductsJson = getVal(data, "products", "list", "");
    if (rawProductsJson) {
      const parsed = JSON.parse(rawProductsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsList = parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse dynamic products:", e);
  }

  let testimonialsList = defaultTestimonials;
  try {
    const rawTestimonialsJson = getVal(data, "testimonials", "list", "");
    if (rawTestimonialsJson) {
      const parsed = JSON.parse(rawTestimonialsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        testimonialsList = parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse dynamic testimonials:", e);
  }

  const filteredTestimonialsList = testimonialFilter === "Semua"
    ? testimonialsList
    : testimonialsList.filter((t) => t.rating === Number(testimonialFilter));

  const availableRatings = ["Semua", ...Array.from(new Set(testimonialsList.map((t) => String(t.rating)))).sort((a, b) => Number(b) - Number(a))];

  const filteredProducts = productsList.filter((p) => {
    const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.uses.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev < filteredProducts.length - visibleItems ? prev + 1 : prev
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const heroBadge = getVal(data, "hero", "badge", "Supplier kain majun terpercaya sejak 2019");
  const heroTitle = getVal(data, "hero", "title", "Kain Majun Berkualitas");
  const heroSubtitle = getVal(data, "hero", "subtitle", "untuk Semua Kebutuhan");
  const heroDesc = getVal(data, "hero", "description", "Majun putih & warna siap kirim dalam quantity besar. Harga distributor, kualitas premium, pengiriman cepat ke seluruh Jawa.");
  const rawHeroImage = getVal(data, "hero", "image", "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80");
  const heroImage = (rawHeroImage.startsWith("http://") || rawHeroImage.startsWith("https://") || rawHeroImage.startsWith("/"))
    ? rawHeroImage
    : "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80";
  const heroTrust1 = getVal(data, "hero", "trust1", "Bebas ongkir Jabodetabek");
  const heroTrust2 = getVal(data, "hero", "trust2", "Stock siap kirim");
  const rawWaNumber = getVal(data, "hero", "wa_number", "6281234567890");
  const waNumber = rawWaNumber.replace(/[^0-9+]/g, "");

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
  
  const bongkaranBadge = getVal(data, "jual_bongkaran", "badge", "Kemitraan Konveksi & Garment");
  const bongkaranTitle = getVal(data, "jual_bongkaran", "title", "Punya Limbah atau Sisa Kain Konveksi? Kami Beli Tunai.");
  const bongkaranDesc = getVal(data, "jual_bongkaran", "description", "Kami menerima sisa potongan kain, reject produksi, sample lama, atau stok gudang mati dari garment Anda. Kami bantu bersihkan gudang Anda: tim kami datang menjemput, menimbang di lokasi, dan langsung bayar tunai.");

  const ctaTitle = getVal(data, "cta", "title", "Siap memesan kain majun?");
  const ctaSubtitle = getVal(data, "cta", "subtitle", "Hubungi kami sekarang via WhatsApp untuk konsultasi & penawaran harga terbaik.");

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

  // Validasi URL secara defensif untuk mencegah XSS berbasis protokol (misal: javascript:)
  const rawMapsEmbed = getVal(data, "maps", "embed_url", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7419172!3d-6.2416776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjAuMCJTIDEwNsKwNDQnMzAuOSJF!5e0!3m2!1sid!2sid");
  const mapsEmbed = (rawMapsEmbed.startsWith("http://") || rawMapsEmbed.startsWith("https://")) 
    ? rawMapsEmbed 
    : "about:blank";

  const rawMapsLink = getVal(data, "maps", "maps_link", "https://maps.app.goo.gl/aJDEdUZwJ8M3wnEP9?g_st=ic");
  const mapsLink = (rawMapsLink.startsWith("http://") || rawMapsLink.startsWith("https://"))
    ? rawMapsLink
    : "#";

  const locationName = getVal(data, "maps", "location_name", "Lokasi Gudang Kami");
  const locationSubtitle = getVal(data, "maps", "location_subtitle", "Area pergudangan & industri");

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
      <style>{`
        html { scroll-behavior: smooth; }
        ::selection { background: zinc-200; color: zinc-900; }
      `}</style>

      {/* Nav */}
      <SiteNavbar companyName={companyName} />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-12 pb-14 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 lg:px-8 bg-zinc-950 sm:bg-transparent">
          {/* Mobile Full Background Image Cover */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat block sm:hidden z-0"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          {/* Mobile Dark Overlay Mask */}
          <div className="absolute inset-0 bg-zinc-950/80 block sm:hidden z-0" />

          {/* Grid points background (only for sm+) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-60 hidden sm:block"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-zinc-200/40 via-zinc-100/20 to-transparent blur-3xl hidden sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-100/30 via-zinc-100/20 to-transparent blur-3xl hidden sm:block"
          />

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 sm:items-center lg:gap-20">
              <div>
                <FadeIn>
                  <span className="text-xs sm:text-sm font-bold tracking-wider text-primary uppercase">
                    {heroBadge}
                  </span>
                </FadeIn>

                <FadeIn delay={100}>
                  <h1 className="mt-4 text-3xl xs:text-4xl sm:text-5xl lg:text-[3rem] font-bold tracking-tight text-white sm:text-zinc-950 dark:sm:text-zinc-50 sm:leading-[1.1]">
                    {heroTitle}
                    <br />
                    <span className="text-zinc-300 sm:text-zinc-500 dark:sm:text-zinc-400">{heroSubtitle}</span>
                  </h1>
                </FadeIn>

                <FadeIn delay={200}>
                  <div
                    className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-zinc-200 sm:text-zinc-600 dark:sm:text-zinc-400 max-w-md prose prose-invert sm:prose-normal dark:sm:prose-invert"
                    dangerouslySetInnerHTML={{ __html: heroDesc }}
                  />
                </FadeIn>

                <FadeIn delay={300}>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Button asChild size="default" className="sm:size-lg gap-2 bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 rounded-xl font-bold">
                      <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                        <Phone className="h-4 w-4" /> Chat WhatsApp
                      </a>
                    </Button>
                  </div>
                </FadeIn>

                <FadeIn delay={400}>
                  <div className="mt-8 flex flex-wrap items-center gap-4 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-zinc-300 sm:text-zinc-600 dark:sm:text-zinc-400">{heroTrust1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-zinc-300 sm:text-zinc-600 dark:sm:text-zinc-400">{heroTrust2}</span>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Tablet/Desktop Side-by-side Image (shown from sm screens) */}
              <FadeIn delay={200} className="hidden sm:block">
                <div className="relative">
                  {/* Decorative background blur shapes */}
                  <div className="absolute -top-12 -left-12 h-72 w-72 rounded-full bg-gradient-to-tr from-primary/10 to-amber-100/10 blur-3xl opacity-60" />
                  <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gradient-to-br from-zinc-200 to-amber-100/15 blur-3xl opacity-50" />

                  {/* Main Image Frame */}
                  <div className="relative rounded-3xl border border-zinc-200/50 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.08)]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                      <img
                        src={heroImage}
                        alt="Kain Majun Premium"
                        className="h-full w-full object-cover"
                        {...{ fetchPriority: "high" }}
                      />
                      {/* Dark overlay on bottom of the image for contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Floating Glass Badge 1: Stock Capacity */}
                    <div className="absolute -top-4 -right-4 backdrop-blur-md bg-white/90 dark:bg-zinc-950/85 border border-zinc-200/60 dark:border-zinc-800/80 p-2 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Kapasitas Stok</p>
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">± 10 Ton Ready</p>
                      </div>
                    </div>

                    {/* Floating Glass Badge 2: Quality trust */}
                    <div className="absolute -bottom-4 -left-4 backdrop-blur-md bg-white/90 dark:bg-zinc-950/85 border border-zinc-200/60 dark:border-zinc-800/80 p-2 sm:p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Garansi Mutu</p>
                        <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">100% Serat Katun</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="px-4 py-3 sm:px-6 sm:py-6 lg:px-8 bg-zinc-950 sm:bg-transparent transition-colors">
          <div className="mx-auto max-w-6xl bg-zinc-900/50 border border-zinc-800/80 text-white sm:bg-white sm:dark:bg-zinc-900 sm:border-zinc-200/80 sm:dark:border-zinc-800 sm:text-zinc-950 sm:dark:text-zinc-50 rounded-3xl p-4 sm:p-8 shadow-sm transition-colors">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center">
              {stats.map((s, i) => (
                <div key={s.label} className="relative flex flex-col items-center text-center">
                  <FadeIn delay={i * 80}>
                    <p className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary">
                      <StatCounter value={s.value} />
                    </p>
                    <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {s.label}
                    </p>
                  </FadeIn>
                  {/* Vertical dividers for desktop and mobile */}
                  {i < stats.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 sm:h-10 w-px bg-zinc-800 sm:bg-zinc-200 sm:dark:bg-zinc-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="tentang" className="bg-zinc-950 px-6 py-12 sm:py-20 lg:py-24 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <FadeIn>
                  <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3.5 py-1.5 text-sm font-medium text-zinc-400">
                    <Handshake className="h-3 w-3" /> {aboutBadge}
                  </div>
                </FadeIn>

                <FadeIn delay={100}>
                  <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {aboutTitle}
                  </h2>
                </FadeIn>

                <FadeIn delay={200}>
                  <div
                    className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-400 prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: aboutDesc }}
                  />
                </FadeIn>

                <FadeIn delay={300}>
                  <ul className="mt-6 space-y-3">
                    {trust.map((t) => (
                      <li key={t} className="flex items-center gap-2.5 text-sm sm:text-base text-zinc-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 sm:mt-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>

              <FadeIn delay={200}>
                <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
                  <div className="h-52 w-full overflow-hidden bg-zinc-900/60 flex items-center justify-center">
                    {loadMap ? (
                      <iframe
                        src={mapsEmbed}
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-500">
                        <MapPin className="h-5 w-5 animate-pulse text-zinc-500" />
                        <span className="text-xs font-semibold">Memuat peta...</span>
                      </div>
                    )}
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

        {/* Products Section */}
        <section id="produk" className="px-6 py-12 sm:py-20 lg:py-24 lg:px-8 scroll-mt-20 bg-zinc-50/50 dark:bg-zinc-950/10">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-sm font-semibold text-primary">
                  Katalog Produk
                </span>
                <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">
                  Pilihan Kain Majun & APD Industri
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
                  <strong>Kain Majun (lap perca)</strong> merupakan kain lap pembersih sisa potongan industri garmen berkualitas tinggi. Dirancang khusus untuk menyerap ceceran oli, air, pelumas, zat kimia, serta kotoran mesin berat pada area manufaktur, perkapalan, bengkel, dan pabrik logam.
                </p>
              </div>
            </FadeIn>

            {/* Filter & Search Bar */}
            <div className="mt-6 flex flex-row items-center gap-2 max-w-4xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-sm">
              {/* Search Box */}
              <div className="relative flex-[1.6] sm:flex-1">
                <Search className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari kain majun atau APD..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all dark:text-white"
                />
              </div>

              {/* Dropdown Filter */}
              <div className="relative flex-1 sm:min-w-[200px] max-w-[140px] sm:max-w-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-3 pr-7 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg sm:rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 sm:right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Carousel View */}
            {filteredProducts.length > 0 ? (
              <>
                {/* Carousel View (Tablet/Desktop) */}
                <div className="hidden sm:block relative mt-12 px-4 sm:px-12 max-w-6xl mx-auto group/carousel">
                  {/* Carousel Window */}
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                      }}
                    >
                      {filteredProducts.map((p) => (
                        <div
                          key={p.name}
                          className="shrink-0 px-3 flex"
                          style={{ width: `${100 / visibleItems}%` }}
                        >
                          <div className="group/card flex flex-col w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-zinc-300/80 dark:hover:border-zinc-650 hover:-translate-y-1">
                            {/* Image */}
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute top-4 right-4">
                                <span className="rounded-full bg-emerald-500/90 dark:bg-emerald-600/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm border border-emerald-400/20">
                                  Siap Kirim
                                </span>
                              </div>
                            </div>
                            {/* Content */}
                            <div className="flex flex-col flex-1 p-5 sm:p-6">
                              <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50 leading-snug group-hover/card:text-primary transition-colors line-clamp-1">
                                {p.name}
                              </h3>
                              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-555 dark:text-zinc-400 flex-1 line-clamp-3">
                                {p.desc}
                              </p>
                              
                              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
                                  Cocok untuk:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {p.uses.slice(0, 3).map((u) => (
                                    <span
                                      key={u}
                                      className="inline-flex items-center gap-1 rounded-full bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-600 dark:text-zinc-350 border border-zinc-200/50 dark:border-zinc-700/60"
                                    >
                                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                      {u}
                                    </span>
                                  ))}
                                  {p.uses.length > 3 && (
                                    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                                      +{p.uses.length - 3} lainnya
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                                <Button asChild size="sm" variant="outline" className="flex-1 gap-1 rounded-xl border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-xs py-1.5 h-8 font-bold">
                                  <Link href={`/produk/${p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-")}`}>
                                    Detail <ArrowRight className="h-3 w-3" />
                                  </Link>
                                </Button>
                                <Button asChild size="sm" className="flex-1 gap-1 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs py-1.5 h-8 font-bold">
                                  <a href={`https://wa.me/${waNumber}?text=Halo, saya mau tanya soal ${p.name}`} target="_blank" rel="noopener noreferrer">
                                    Tanya Harga
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Glassmorphic Slide Arrows */}
                  {filteredProducts.length > visibleItems && (
                    <>
                      {/* Left Button */}
                      <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 text-zinc-600 dark:text-zinc-400 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                          currentIndex === 0 ? "opacity-25 cursor-not-allowed" : "opacity-100 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        }`}
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Right Button */}
                      <button
                        onClick={nextSlide}
                        disabled={currentIndex >= filteredProducts.length - visibleItems}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 text-zinc-600 dark:text-zinc-400 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 ${
                          currentIndex >= filteredProducts.length - visibleItems ? "opacity-25 cursor-not-allowed" : "opacity-100"
                        }`}
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Visual Dash/Dot Slide Indicator Indicators */}
                  {filteredProducts.length > visibleItems && (
                    <div className="mt-8 flex justify-center gap-1.5">
                      {Array.from({ length: filteredProducts.length - visibleItems + 1 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`h-1.5 transition-all duration-300 ${
                            currentIndex === idx
                              ? "w-6 rounded-full bg-primary"
                              : "w-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-350 dark:hover:bg-zinc-700"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Compact Vertical Stack (up to 3 items) */}
                <div className="block sm:hidden mt-8 space-y-3">
                  {filteredProducts.slice(0, 3).map((p) => {
                    const slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
                    return (
                      <div
                        key={p.name}
                        className="flex items-start gap-4 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                      >
                        {/* Image Left */}
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <span className="absolute top-1 left-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                            Ready
                          </span>
                        </div>

                        {/* Content Right */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[96px] py-0.5">
                          <div>
                            <h3 className="text-sm font-bold text-zinc-955 dark:text-zinc-50 leading-tight line-clamp-1">
                              {p.name}
                            </h3>
                            <p className="mt-1 text-xs leading-snug text-zinc-500 dark:text-zinc-400 line-clamp-2">
                              {p.desc}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-2">
                            <Link
                              href={`/produk/${slug}`}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-bold text-zinc-750 dark:text-zinc-300 py-1.5 h-8 hover:bg-zinc-100"
                            >
                              Detail
                            </Link>
                            <a
                              href={`https://wa.me/${waNumber}?text=Halo, saya mau tanya soal ${p.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-primary text-white text-xs font-bold py-1.5 h-8 hover:bg-primary-hover shadow-sm"
                            >
                              Tanya Harga
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* View All Button */}
                  <div className="pt-2">
                    <Button asChild variant="outline" size="sm" className="w-full gap-2 rounded-xl text-xs py-1.5 h-8 font-bold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                      <Link href="/katalog">
                        Lihat Semua Produk di Katalog <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl mt-12">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Tidak ada produk yang cocok dengan pencarian Anda.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-bold text-primary hover:underline font-mono"
                >
                  Reset Filter & Pencarian
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Banner: Jual Bongkaran (untuk konveksi) */}
        <section className="px-6 py-8 sm:py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl dark:border-zinc-800/80 sm:p-12">
              {/* Decorative colored glow */}
              <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
              
              <div className="relative grid gap-8 lg:grid-cols-3 lg:items-center lg:gap-12">
                <div className="lg:col-span-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400 border border-emerald-500/20">
                    <Recycle className="h-3 w-3" /> {bongkaranBadge}
                  </span>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    {bongkaranTitle}
                  </h2>
                  <div
                    className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-400 prose prose-invert"
                    dangerouslySetInnerHTML={{ __html: bongkaranDesc }}
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs xs:text-sm font-medium text-zinc-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Layanan Jemput Gratis
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Timbangan Akurat & Transparan
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Pembayaran Cash/Transfer
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 lg:items-end">
                  <Button asChild size="lg" className="gap-2 bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all rounded-xl">
                    <Link href="/jual-bongkaran">
                      Jual Sekarang <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-xs text-zinc-500 tracking-wider uppercase font-semibold">Mulai dari 100 kg per penjemputan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to order */}
        <section id="cara-order" className="px-6 py-12 sm:py-20 lg:py-24 lg:px-8 scroll-mt-20 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="text-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  Proses Transaksi
                </span>
                <h2 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">Cara Pemesanan</h2>
                <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Simpel, cepat, dan transparan dalam 3 tahapan mudah</p>
              </div>
            </FadeIn>
 
            <div className="mt-10 sm:mt-20 relative">
              {/* Horizontal Line (shown behind circles) */}
              <div className="absolute top-5 sm:top-8 left-[15%] right-[15%] h-0.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 -z-0" />
 
              <div className="grid grid-cols-3 gap-2 sm:gap-12 relative z-10">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <FadeIn key={s.n} delay={i * 120} className="relative">
                      {/* Step Column Layout */}
                      <div className="group flex flex-col items-center text-center">
                        {/* Step Circle Indicator & Node */}
                        <div className="flex flex-col items-center">
                          {/* Number Node with hover pulse */}
                          <div className="relative flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-extrabold text-xs sm:text-lg shadow-md group-hover:border-primary group-hover:text-primary transition-all duration-300 shrink-0">
                            {/* Inner circle background */}
                            <div className="absolute inset-1 sm:inset-1.5 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 group-hover:border-primary/20 transition-all" />
                            {/* Step number that hides on hover */}
                            <span className="relative z-10 group-hover:scale-0 opacity-100 group-hover:opacity-0 transition-all duration-300 font-mono tracking-tighter">
                              {s.n}
                            </span>
                            {/* Lucide icon that shows on hover */}
                            <div className="absolute inset-0 flex items-center justify-center scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                              <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                            </div>
                          </div>
 
                          {/* Header text / status badge */}
                          <div className="flex flex-col items-center gap-1 mt-3 sm:mt-6">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase border ${
                              i === 0 
                                ? "bg-blue-50/70 text-blue-700 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30" 
                                : i === 1 
                                  ? "bg-amber-50/70 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-800/30" 
                                  : "bg-emerald-50/70 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-800/30"
                            }`}>
                              {i === 0 ? "Hubungi" : i === 1 ? "Negosiasi" : "Pengiriman"}
                            </span>
                            <h3 className="text-xs xs:text-sm sm:text-base font-extrabold text-zinc-955 dark:text-white tracking-tight leading-snug">
                              {s.title}
                            </h3>
                          </div>
                        </div>
 
                        {/* Step Description Box */}
                        <div className="pl-0 mt-1 sm:mt-2 max-w-sm">
                          <div
                            className="text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 prose dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: s.desc }}
                          />
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-white dark:bg-zinc-950 px-6 py-12 sm:py-20 lg:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <FadeIn>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-955 dark:text-zinc-50">Apa Kata Pelanggan Kami</h2>
                  <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400">Dipercaya oleh ratusan pabrik, bengkel, dan cleaning service di seluruh Jawa</p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative min-w-[180px] shrink-0">
                  <Star className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-400 fill-amber-400 pointer-events-none" />
                  <select
                    value={testimonialFilter}
                    onChange={(e) => setTestimonialFilter(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer dark:text-white"
                  >
                    {availableRatings.map((r) => (
                      <option key={r} value={r} className="dark:bg-zinc-900 dark:text-white">
                        {r === "Semua" ? "Semua Rating" : `${r} Bintang`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </FadeIn>

            {/* Slider/Carousel Container */}
            <div className="relative mt-12 px-4 sm:px-12 max-w-6xl mx-auto group">
              {filteredTestimonialsList.length > 0 ? (
                <>
                  {/* Slider/Carousel Container (Desktop/Tablet) */}
                  <div className="hidden sm:block">
                    {/* Slider Window */}
                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{
                          transform: `translateX(-${testimonialIndex * (100 / visibleTestimonialCount)}%)`,
                        }}
                      >
                        {filteredTestimonialsList.map((t, i) => (
                          <div
                            key={`${t.name}-${i}`}
                            className="shrink-0 px-3 flex"
                            style={{ width: `${100 / visibleTestimonialCount}%` }}
                          >
                            <div className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900 p-6 shadow-sm w-full hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300">
                              <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`h-3.5 w-3.5 ${
                                      j < (t.rating || 5)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300 flex-1 italic">"{t.content}"</p>
                              <div className="mt-5 flex items-center gap-3 border-t border-zinc-200/60 dark:border-zinc-800 pt-4">
                                {t.avatar ? (
                                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-850">
                                    <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                                  </div>
                                ) : (
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white text-xs font-bold shadow-sm">
                                    {t.name.split(" ").slice(-1)[0][0]}
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{t.name}</p>
                                  <p className="text-xs text-zinc-400">{t.role ? `${t.role} · ` : ""}{t.company}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {filteredTestimonialsList.length > visibleTestimonialCount && (
                      <>
                        {/* Left Arrow */}
                        <button
                          onClick={() => setTestimonialIndex((prev) => Math.max(0, prev - 1))}
                          disabled={testimonialIndex === 0}
                          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all ${
                            testimonialIndex === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"
                          }`}
                          aria-label="Previous slide"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Right Arrow */}
                        <button
                          onClick={() => setTestimonialIndex((prev) => Math.min(filteredTestimonialsList.length - visibleTestimonialCount, prev + 1))}
                          disabled={testimonialIndex >= filteredTestimonialsList.length - visibleTestimonialCount}
                          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all ${
                            testimonialIndex >= filteredTestimonialsList.length - visibleTestimonialCount ? "opacity-30 cursor-not-allowed" : "opacity-100"
                          }`}
                          aria-label="Next slide"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Dots indicator */}
                    {filteredTestimonialsList.length > visibleTestimonialCount && (
                      <div className="mt-8 flex justify-center gap-1.5">
                        {[...Array(filteredTestimonialsList.length - visibleTestimonialCount + 1)].map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setTestimonialIndex(idx)}
                            className={`rounded-full transition-all duration-300 ${
                              testimonialIndex === idx
                                ? "h-2.5 w-7 bg-primary"
                                : "h-2.5 w-2.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                            }`}
                            aria-label={`Halaman ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Testimonials Stack (up to 3 items) */}
                  <div className="block sm:hidden mt-8 space-y-3">
                    {filteredTestimonialsList.slice(0, 3).map((t, i) => (
                      <div
                        key={`${t.name}-${i}`}
                        className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900 p-4 shadow-sm"
                      >
                        {/* Rating */}
                        <div className="flex items-center gap-0.5 mb-2.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3 w-3 ${
                                j < (t.rating || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Content */}
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 italic">
                          "{t.content}"
                        </p>

                        {/* User Info */}
                        <div className="mt-3 flex items-center gap-2.5 border-t border-zinc-200/60 dark:border-zinc-800 pt-2.5">
                          {t.avatar ? (
                            <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800">
                              <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover text-white text-xs font-bold shadow-sm">
                              {t.name.split(" ").slice(-1)[0][0]}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-zinc-955 dark:text-zinc-50">{t.name}</p>
                            <p className="text-xs text-zinc-400">{t.role ? `${t.role} · ` : ""}{t.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  <Star className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Tidak ada testimoni dengan rating ini.</p>
                  <button
                    onClick={() => setTestimonialFilter("Semua")}
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    Lihat Semua
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA (Single Merged) */}
        <section className="px-6 py-12 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-5 py-8 sm:px-12 sm:py-20 text-center shadow-xl">
            <FadeIn>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                {ctaTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={100}>
              <div
                className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-400 prose prose-invert mx-auto max-w-lg"
                dangerouslySetInnerHTML={{ __html: ctaSubtitle }}
              />
            </FadeIn>
            <FadeIn delay={200}>
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto w-full">
                <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 py-2 sm:py-2.5 text-sm h-9 sm:h-11 rounded-lg sm:rounded-xl">
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Chat WhatsApp Sekarang
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2 border-zinc-700/50 bg-white/5 hover:bg-white/10 text-white py-2 sm:py-2.5 text-sm h-9 sm:h-11 rounded-lg sm:rounded-xl">
                  <Link href="/kalkulator">
                    <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Hitung Estimasi Harga
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2 border-zinc-700/50 bg-white/5 hover:bg-white/10 text-white py-2 sm:py-2.5 text-sm h-9 sm:h-11 rounded-lg sm:rounded-xl">
                  <Link href="/lacak-pesanan">
                    <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Lacak Status Pesanan
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
