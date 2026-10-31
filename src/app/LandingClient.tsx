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
  Calculator,
  Truck,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Factory,
  Wrench,
  Layers,
  Settings,
  PackageCheck,
  ShieldCheck,
  FileText,
  HelpCircle,
  ChevronUp,
  Droplets,
  Scale,
  Building2,
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
    desc: "Kain katun lembaran utuh tanpa sambungan jahitan. Daya serap tinggi dan tidak meninggalkan debu perca. Standar untuk mesin presisi, silinder mesin, optik, dan kaca.",
    uses: ["Mesin presisi & bearing", "Perakitan blok mesin", "Elektronik & optik", "Laboratorium & kaca"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Majun Jahit Sambung",
    category: "Kain Majun",
    desc: "Potongan perca katun dijahit memanjang rapi. Solusi pasokan ekonomis dengan daya serap maksimal untuk pembersihan rutin di workshop dan gudang.",
    uses: ["Pabrik manufaktur", "Bengkel otomotif", "Workshop perbaikan", "Perawatan mesin industri"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Majun Jahit Tumpuk",
    category: "Kain Majun",
    desc: "3 hingga 5 lapis kain perca katun dijahit silang rapat. Tebal, kuat menahan gesekan pelat baja, dan berdaya tampung cairan tinggi untuk oli berat.",
    uses: ["Bengkel alat berat", "Galangan kapal & marine", "Pabrik baja & stamping", "Mesin bubut & CNC"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sarung Tangan Industri",
    category: "Alat Pelindung",
    desc: "Sarung tangan rajut katun tebal untuk perlindungan tangan teknisi dan operator. Nyaman digunakan seharian dengan daya cengkeram kuat.",
    uses: ["Operator mesin pabrik", "Gudang & logistik", "Konstruksi baja", "Bongkar muat kargo"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Alat Pelindung Diri (APD)",
    category: "Alat Pelindung",
    desc: "Kacamata safety industri, masker pelindung debu, dan perlengkapan pelindung standar K3 untuk mendukung keselamatan kerja operasional.",
    uses: ["Manufaktur & pabrikasi", "Bengkel las & bubut", "Area berdebu & kimia", "Warehouse"],
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80",
  },
];

const defaultTrust = [
  "Bahan 100% serat katun kaos, serap air dan oli cepat",
  "Sortir ketat manual: bebas kawat, kancing, dan resleting",
  "Tersedia kemasan bal press 25 kg dan 50 kg siap kirim",
  "Pengiriman kargo terjadwal ke seluruh wilayah Pulau Jawa",
  "Minimal pemesanan fleksibel mulai 20 kg hingga skala tonase",
  "Dukungan faktur resmi, SPH, dan opsi tempo untuk mitra pabrik",
];

const defaultWorkflow = [
  {
    step: "01",
    title: "Konsultasi Spesifikasi",
    subtitle: "Analisis Kebutuhan Kerja",
    desc: "Diskusikan jenis residu pabrik Anda (oli mesin, oli hidrolik berat, tinta, atau cairan kimia) untuk penentuan grade katun dan estimasi tonase rutin.",
    tag: "Spesifikasi & Tonase",
  },
  {
    step: "02",
    title: "Sampel Fisik & SPH Resmi",
    subtitle: "Uji Mutu Bahan Langsung",
    desc: "Kami sediakan sampel bahan fisik gratis untuk diuji di lini operasional Anda beserta Surat Penawaran Harga (SPH) resmi dan simulasi biaya distributor.",
    tag: "Sampel Gratis",
  },
  {
    step: "03",
    title: "Distribusi Terjadwal",
    subtitle: "Armada Sendiri & Kargo Terpercaya",
    desc: "Pengiriman terjadwal menggunakan armada internal DARMIN untuk Bandung dan Jabodetabek, atau ekspedisi rekanan kargo ke seluruh kota di Pulau Jawa.",
    tag: "Surat Jalan & Segel",
  },
  {
    step: "04",
    title: "Verifikasi Timbang & Pembayaran",
    subtitle: "Serah Terima Transparan",
    desc: "Timbang ulang di lokasi bongkar muat untuk memastikan akurasi tonase. Tersedia fasilitas Term of Payment (TOP 14-30 hari) bagi mitra pabrik terdaftar.",
    tag: "Faktur & Tempo",
  },
];

const defaultIndustrySectors = [
  {
    id: "otomotif",
    sector: "Manufaktur & Pabrik Otomotif",
    category: "Presisi & Assembly Mesin",
    bestProduct: "Majun Lembaran Putih (Tanpa Jahit)",
    need: "Pembersihan blok silinder, ruang bakar, dan bearing mesin presisi tanpa risiko goresan mikron atau residu serat benang.",
    specs: [
      "100% Katun Perca Lembaran Murni",
      "Bebas kawat, kancing, dan resleting",
      "Daya serap oli cepat tanpa rontok",
    ],
    icon: Factory,
  },
  {
    id: "marine",
    sector: "Bengkel Alat Berat & Galangan Kapal",
    category: "Heavy Duty & Marine",
    bestProduct: "Majun Jahit Tumpuk Tebal (4-5 Lapis)",
    need: "Penyerapan tumpahan oli kental SAE 40/90, gemuk (grease), dan residu solar pada instalasi mesin genset dan ruang mesin kapal.",
    specs: [
      "Lapisan perca dijahit silang kokoh",
      "Daya tampung cairan s.d. 3.2x bobot kain",
      "Tahan gesekan pada permukaan pelat baja",
    ],
    icon: Wrench,
  },
  {
    id: "percetakan",
    sector: "Industri Percetakan & Packaging",
    category: "Cetak & Offset",
    bestProduct: "Majun Katun Putih Bersih",
    need: "Pembersihan rol silinder plat cetak, baki tinta, dan sisa solvent tanpa melunturkan warna lap ke permukaan plat cetak.",
    specs: [
      "Warna putih murni tidak meninggalkan luntur",
      "Tahan terhadap cairan pelarut solvent & alkohol",
      "Struktur serat rapat tidak mudah koyak",
    ],
    icon: Layers,
  },
  {
    id: "bubut",
    sector: "Workshop Bubut & Fabrikasi Logam",
    category: "Metalworking & Machining",
    bestProduct: "Majun Jahit Sambung Ekonomis",
    need: "Membersihkan semprotan cairan pendingin (coolant emulsi) dan serpihan gram besi hasil proses bubut dan mesin frais CNC.",
    specs: [
      "Biaya paling hemat per kilogram kebutuhan rutin",
      "Daya serap cairan emulsi pendingin cepat",
      "Jahitan sambung rapi tidak mudah terurai",
    ],
    icon: Settings,
  },
  {
    id: "grosir",
    sector: "Distributor & Toko Bahan Bangunan",
    category: "Distribusi Grosir Reseller",
    bestProduct: "Bal Press Karung 25 kg & 50 kg",
    need: "Pasokan karung bal press padat berikat kawat galvanis yang rapi disimpan di gudang toko dan siap dijual eceran per kilogram.",
    specs: [
      "Kemasan bal press padat hemat tempat penyimpanan",
      "Timbangan bal akurat tertera jelas pada karung",
      "Harga distributor langsung dengan margin reseller sehat",
    ],
    icon: PackageCheck,
  },
];

const technicalMatrix = [
  {
    grade: "Majun Putih Lembaran",
    type: "Grade Super (Tanpa Jahit)",
    composition: "100% Katun Kaos Perca Murni",
    layers: "1 Lapis Utuh (Tanpa Sambungan)",
    absorption: "Tinggi & Cepat (Oli, Pelarut, Air)",
    metalFree: "100% Sortir Bebas Logam/Kawat",
    recommendedFor: "Mesin Presisi, Silinder, Optik, Plat Cetak",
    packaging: "Bal Press 25 kg & 50 kg",
  },
  {
    grade: "Majun Jahit Sambung",
    type: "Grade Ekonomis",
    composition: "Katun Kaos Perca Warna Campur",
    layers: "Sambung Memanjang (Jahit Rantai)",
    absorption: "Optimal untuk Cairan Umum & Coolant",
    metalFree: "100% Sortir Bebas Logam/Kawat",
    recommendedFor: "Pabrik Manufaktur, Mesin Bubut, Workshop",
    packaging: "Bal Press 25 kg & 50 kg",
  },
  {
    grade: "Majun Jahit Tumpuk",
    type: "Grade Heavy Duty",
    composition: "Perca Katun Tebal Berlapis",
    layers: "3 sampai 5 Lapis (Jahit Silang Padat)",
    absorption: "Maksimal (Oli Kental SAE 40/90 & Grease)",
    metalFree: "100% Sortir Bebas Logam/Kawat",
    recommendedFor: "Bengkel Alat Berat, Galangan Kapal, Baja",
    packaging: "Bal Press 25 kg & 50 kg",
  },
  {
    grade: "Sarung Tangan Benang",
    type: "Alat Pelindung Diri (APD)",
    composition: "Benang Katun Rajut TC 7 Benang",
    layers: "Rajutan Presisi Tebal",
    absorption: "Cengkeraman Kuat & Tahan Gesek",
    metalFree: "Standar Keselamatan Kerja K3",
    recommendedFor: "Operator Mesin, Logistik, Bongkar Muat",
    packaging: "Karung 50 Lusin (600 Pasang)",
  },
];

const procurementFaqs = [
  {
    q: "Apakah CV. DARMIN MAJUN dapat menerbitkan Faktur Pajak PPN 11% dan Surat Jalan resmi?",
    a: "Ya. CV. DARMIN MAJUN adalah entitas badan usaha resmi dengan NPWP terdaftar. Kami menerbitkan Faktur Pajak elektronik (e-Faktur PPN 11%), Surat Penawaran Harga (SPH), dan Surat Jalan resmi bermaterai untuk kebutuhan audit administrasi purchasing pabrik Anda.",
  },
  {
    q: "Bagaimana jika terjadi selisih timbangan saat bal press sampai di gudang pabrik kami?",
    a: "Kami menjamin transparansi timbangan tanpa toleransi susut. Saat armada tiba, tim penerima berhak menimbang ulang setiap bal press disaksikan bersama supir kami. Jika terdapat selisih riil, invoice faktur langsung disesuaikan dengan berat bersih yang diterima di lokasi.",
  },
  {
    q: "Apakah pabrik kami bisa meminta sampel fisik gratis sebelum menerbitkan Purchase Order (PO)?",
    a: "Bisa. Kami menyediakan paket sampel fisik uji mutu seberat 1 kg (berisi lembaran putih, jahit sambung, dan jahit tumpuk) yang kami kirimkan langsung ke alamat pabrik Anda tanpa dipungut biaya sampel.",
  },
  {
    q: "Apakah tersedia fasilitas pembayaran tempo (Term of Payment / TOP) untuk pabrik?",
    a: "Tersedia fasilitas pembayaran tempo (TOP 14 hingga 30 hari kalender) untuk mitra industri yang melakukan kontrak pasokan berkala minimal 200 kg per bulan, setelah kelengkapan verifikasi legalitas (NIB & NPWP) disetujui.",
  },
  {
    q: "Berapa batas minimal pemesanan untuk mendapatkan pengiriman gratis armada truk DARMIN?",
    a: "Untuk area Bandung Raya, Cimahi, dan kawasan industri Karawang serta Jabodetabek, pemesanan minimal 100 kg sudah mendapatkan fasilitas gratis ongkos kirim armada truk internal kami.",
  },
];

function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function StatCounter({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const match = value.match(/^([\d.,]+)\s*(.*)$/);
  const targetNumber = match ? parseFloat(match[1].replace(/,/g, "")) || 0 : 0;
  const suffix = match ? match[2] || "" : value;

  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1200;
    const steps = 25;
    const stepTime = duration / steps;
    const increment = targetNumber / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(targetNumber);
        clearInterval(interval);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepTime);

    return () => clearInterval(interval);
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
  const [selectedSectorTab, setSelectedSectorTab] = useState("semua");
  const [activeHeroTab, setActiveHeroTab] = useState<"bahan" | "serap" | "bal">("bahan");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Calculator State
  const [homeQty, setHomeQty] = useState(100);
  const [homeProduct, setHomeProduct] = useState("majun-putih-lembaran");

  const HOME_PRICES: Record<string, { label: string; price: number }> = {
    "majun-putih-lembaran": { label: "Majun Putih Lembaran", price: 18000 },
    "majun-jahit-sambung": { label: "Majun Jahit Sambung", price: 14000 },
    "majun-jahit-tumpuk": { label: "Majun Jahit Tumpuk", price: 16000 },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  const [loadMap, setLoadMap] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoadMap(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const categories = ["Semua", "Kain Majun", "Alat Pelindung"];

  let productsList = defaultProducts;
  try {
    const rawProductsJson = data.products?.list || "";
    if (rawProductsJson) {
      const parsed = JSON.parse(rawProductsJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsList = parsed;
      }
    }
  } catch (e) {
    console.error("Gagal membaca produk:", e);
  }

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

  const heroBadge = data.hero?.badge || "Distributor Resmi Sejak 2019";
  const heroTitle = data.hero?.title || "Kain Majun Industri Berkualitas";
  const heroSubtitle = data.hero?.subtitle || "Pasokan Rutin Pabrik & Workshop";
  const heroDesc = data.hero?.description || "Distributor kain majun katun putih dan warna siap kirim dalam kuantiti bal press 25 kg dan 50 kg. Daya serap oli tinggi, disortir manual bebas kancing dan kawat, dengan jaminan timbangan pas.";
  const rawHeroImage = data.hero?.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80";
  const heroImage = (rawHeroImage.startsWith("http://") || rawHeroImage.startsWith("https://") || rawHeroImage.startsWith("/"))
    ? rawHeroImage
    : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80";

  const rawWaNumber = data.hero?.wa_number || "6281234567890";
  const waNumber = rawWaNumber.replace(/[^0-9+]/g, "");

  const stats = [
    { value: data.stats?.exp_years || "5+", label: "Tahun Beroperasi" },
    { value: data.stats?.customers || "100+", label: "Mitra Pabrik & Toko" },
    { value: data.stats?.stock || "10 Ton", label: "Kapasitas Stok Gudang" },
    { value: data.stats?.response || "24 Jam", label: "Respon Permintaan" },
  ];

  const trust = [
    data.about?.trust1 || defaultTrust[0],
    data.about?.trust2 || defaultTrust[1],
    data.about?.trust3 || defaultTrust[2],
    data.about?.trust4 || defaultTrust[3],
    data.about?.trust5 || defaultTrust[4],
    data.about?.trust6 || defaultTrust[5],
  ];

  const aboutTitle = data.about?.title || "Pasokan Terjadwal Langsung dari Pusat Sortir";
  const aboutDesc = data.about?.description || "CV. DARMIN MAJUN adalah distributor dan pusat sortir kain perca industri di Jawa Barat. Kami memproses bahan katun pilihan dari industri garmen nasional, memastikan setiap bal bebas logam tajam dan siap pakai untuk area pabrik, perkapalan, perbengkelan, dan distributor bahan bangunan.";

  const address = data.about?.address || "Jl. Industri Maju No. 18, Bandung";
  const hours = data.about?.hours || "08.00 - 17.00 WIB";
  const phone = data.about?.phone || "0812-3456-7890";
  const stock = data.about?.stock || "± 10 Ton Ready Stock";

  const bongkaranTitle = data.jual_bongkaran?.title || "Jual Sisa Perca atau Stok Gudang Konveksi? Kami Beli Tunai";
  const bongkaranDesc = data.jual_bongkaran?.description || "Kami membeli sisa potongan kain kaos katun, reject produksi, dan stok bongkaran gudang konveksi Anda. Armada kami datang menjemput ke lokasi, timbang langsung secara transparan dengan timbangan digital terkalibrasi, dan langsung bayar di tempat.";

  const ctaTitle = data.cta?.title || "Konsultasikan Kebutuhan Pasokan Pabrik Anda";
  const ctaSubtitle = data.cta?.subtitle || "Hubungi perwakilan distribusi CV. DARMIN MAJUN untuk sampel bahan fisik gratis, simulasi tonase, dan penawaran harga grosir.";

  const companyName = data.footer?.company_name || "CV. DARMIN MAJUN";
  const footerDesc = data.footer?.description || "Pusat sortir dan distributor kain majun putih, jahit sambung, jahit tumpuk, dan sarung tangan industri untuk kebutuhan manufaktur dan perbengkelan di seluruh Pulau Jawa.";
  const footerAddress = data.footer?.address || "Jl. Industri Maju No. 18, Bandung";
  const hoursWeekday = data.footer?.hours_weekday || "Senin - Jumat: 08.00 - 17.00";
  const hoursSaturday = data.footer?.hours_saturday || "Sabtu: 08.00 - 14.00";
  const hoursSunday = data.footer?.hours_sunday || "Minggu: Tutup";

  const rawMapsEmbed = data.maps?.embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d106.7419172!3d-6.2416776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjAuMCJTIDEwNsKwNDQnMzAuOSJF!5e0!3m2!1sid!2sid";
  const mapsEmbed = (rawMapsEmbed.startsWith("http://") || rawMapsEmbed.startsWith("https://")) 
    ? rawMapsEmbed 
    : "about:blank";

  const rawMapsLink = data.maps?.maps_link || "https://maps.app.goo.gl/aJDEdUZwJ8M3wnEP9?g_st=ic";
  const mapsLink = (rawMapsLink.startsWith("http://") || rawMapsLink.startsWith("https://"))
    ? rawMapsLink
    : "#";

  const locationName = data.maps?.location_name || "Gudang & Fasilitas Sortir";
  const locationSubtitle = data.maps?.location_subtitle || "Kawasan Pergudangan Logistik Industri";

  const filteredSectors = selectedSectorTab === "semua"
    ? defaultIndustrySectors
    : defaultIndustrySectors.filter((s) => s.id === selectedSectorTab);

  // Quick Calculator Computations
  const selectedProductInfo = HOME_PRICES[homeProduct] || HOME_PRICES["majun-putih-lembaran"];
  const calcBalCount = Math.ceil(homeQty / 25);
  const calcSubtotal = homeQty * selectedProductInfo.price;
  const isFreeDelivery = homeQty >= 100;
  const quickWaText = encodeURIComponent(
    `Halo CV. DARMIN MAJUN,\n\nSaya ingin memesan simulasi pasokan:\n- Produk: ${selectedProductInfo.label}\n- Volume: ${homeQty} kg (± ${calcBalCount} Bal Press)\n- Estimasi Proforma: ${fmt(calcSubtotal)}\n- Status Kirim: ${isFreeDelivery ? "Fasilitas Armada Truk DARMIN" : "Pengiriman Ekspedisi Kargo"}\n\nMohon konfirmasi stok dan pengiriman Surat Penawaran Harga (SPH) resmi. Terima kasih!`,
  );

  return (
    <div className="min-h-screen bg-zinc-100/60 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 transition-colors duration-200">
      {/* Navbar */}
      <SiteNavbar companyName={companyName} />

      <main className="overflow-x-hidden">
        {/* HERO SECTION: Grounded Industrial B2B Layout */}
        <section className="relative border-b border-zinc-200/90 dark:border-zinc-800 bg-[#f4f5f7] dark:bg-[#0d0f12] px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
              {/* Left Column: Authoritative B2B Copy */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-amber-600/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold tracking-wider text-amber-800 dark:text-amber-400 uppercase shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    {heroBadge}
                  </div>
                  <h1 className="mt-4 text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-zinc-950 dark:text-white leading-[1.12]">
                    {heroTitle}
                    <span className="block mt-1.5 text-zinc-600 dark:text-zinc-400 font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-[2.25rem]">
                      {heroSubtitle}
                    </span>
                  </h1>
                </div>

                <div
                  className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 max-w-xl prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: heroDesc }}
                />

                {/* Primary Actions with comfortable >=44px tap targets */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px] h-12 px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    <a
                      href={`https://wa.me/${waNumber}?text=Halo%20CV.%20DARMIN%20MAJUN,%20saya%20ingin%20konsultasi%20pasokan%20kain%20majun%20untuk%20perusahaan%20kami.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4" /> Hubungi Sales Distribusi
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px] h-12 px-6 gap-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
                  >
                    <a href="#kalkulator-cepat">
                      <Calculator className="h-4 w-4 text-amber-500" /> Hitung Kebutuhan Tonase
                    </a>
                  </Button>
                </div>

                {/* Concrete Verification Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-900">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Sortir Bersih Bebas Kawat</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Kemasan Bal Press 25 & 50 kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Faktur Resmi & SPH Siap</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tangible Industrial Interactive Inspection Frame */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-xl border border-zinc-300/90 dark:border-zinc-750 bg-white dark:bg-zinc-900 overflow-hidden shadow-lg shadow-zinc-900/5 dark:shadow-black/30">
                  {/* Image Display */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                    <img
                      src={heroImage}
                      alt="Gudang pasokan kain majun katun CV. DARMIN MAJUN"
                      className="h-full w-full object-cover"
                      {...{ fetchPriority: "high" }}
                    />
                    <div className="absolute top-3 left-3 bg-zinc-950/90 border border-zinc-800 px-3 py-1 rounded-md text-[11px] font-mono font-semibold text-emerald-400 flex items-center gap-1.5 shadow-md">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Gudang Utama Bandung · Siap Muat
                    </div>
                    <div className="absolute bottom-3 right-3 bg-zinc-900/90 border border-zinc-700/80 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold text-amber-400 backdrop-blur-sm">
                      Ready Stock ± 10 Ton
                    </div>
                  </div>

                  {/* Interactive Inspection Tabs */}
                  <div className="p-5 space-y-4">
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                      <button
                        onClick={() => setActiveHeroTab("bahan")}
                        className={`min-h-[44px] flex-1 pb-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                          activeHeroTab === "bahan"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400"
                            : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        Bahan & Sortir
                      </button>
                      <button
                        onClick={() => setActiveHeroTab("serap")}
                        className={`min-h-[44px] flex-1 pb-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                          activeHeroTab === "serap"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400"
                            : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        Daya Serap
                      </button>
                      <button
                        onClick={() => setActiveHeroTab("bal")}
                        className={`min-h-[44px] flex-1 pb-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                          activeHeroTab === "bal"
                            ? "border-amber-500 text-amber-600 dark:text-amber-400"
                            : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        }`}
                      >
                        Kemasan Bal
                      </button>
                    </div>

                    {/* Tab Content 1: Bahan */}
                    {activeHeroTab === "bahan" && (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Komposisi Serat</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">100% Katun Kaos (Combed/Carded)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Penyortiran Fisik</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Sortir Manual Bebas Logam & Kawat</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-zinc-500 dark:text-zinc-400">Toleransi Kadar Air</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">&lt; 8% (Kering & Tidak Lembab)</span>
                        </div>
                      </div>
                    )}

                    {/* Tab Content 2: Serap */}
                    {activeHeroTab === "serap" && (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Retensi Cairan Oli</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Hingga 3.2x Berat Sendiri Kain</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Cairan Target</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Oli SAE 40/90, Gemuk, Coolant, Solvent</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-zinc-500 dark:text-zinc-400">Karakter Permukaan</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Lembut & Bebas Goresan Mikron</span>
                        </div>
                      </div>
                    )}

                    {/* Tab Content 3: Bal */}
                    {activeHeroTab === "bal" && (
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Standar Kemasan</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Karung Press Strapping Baja (25 & 50 kg)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                          <span className="text-zinc-500 dark:text-zinc-400">Jaminan Timbangan</span>
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100">Timbangan Digital Tertera di Karung</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-zinc-500 dark:text-zinc-400">Kapasitas Muat</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">± 10 Ton Ready Stock di Gudang</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAND: High Contrast Industrial Metrics */}
        <section className="border-b border-zinc-200 dark:border-zinc-900 bg-zinc-100/70 dark:bg-zinc-900/40 px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((s) => (
                <div key={s.label} className="p-3">
                  <p className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white font-mono">
                    <StatCounter value={s.value} />
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TENTANG KAMI & LOKASI GUDANG */}
        <section id="tentang" className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                    PROFIL DISTRIBUSI & FASILITAS SORTIR
                  </div>
                  <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {aboutTitle}
                  </h2>
                </div>

                <div
                  className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 prose dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: aboutDesc }}
                />

                <ul className="space-y-3 pt-2">
                  {trust.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warehouse Location Info Box */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden shadow-lg">
                  <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
                    {loadMap ? (
                      <iframe
                        src={mapsEmbed}
                        className="h-full w-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Peta Lokasi Gudang CV. DARMIN MAJUN"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-500 text-xs">
                        <MapPin className="h-5 w-5 animate-pulse text-zinc-400" />
                        <span>Memuat koordinat gudang...</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{locationName}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{locationSubtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/60">
                        <span className="text-zinc-500">Alamat</span>
                        <span className="font-medium text-right max-w-[220px]">{address}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/60">
                        <span className="text-zinc-500">Jam Operasional</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800/60">
                        <span className="text-zinc-500">Kontak Telepon</span>
                        <span className="font-medium">{phone}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-500">Kapasitas Muat</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{stock}</span>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="w-full min-h-[44px] mt-2 gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-semibold rounded-xl"
                    >
                      <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-3.5 w-3.5" /> Buka Navigasi di Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WIDGET KALKULATOR INSTAN DI BERANDA: Menutup gap fitur langsung */}
        <section id="kalkulator-cepat" className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/80 dark:bg-zinc-900/40 px-6 py-14 sm:py-20 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 text-center max-w-2xl mx-auto mb-10">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                SIMULASI PENGADAAN CEPAT
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Hitung Kebutuhan Bal Press & Estimasi Biaya
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Geser volume kebutuhan bulanan pabrik Anda untuk melihat simulasi jumlah bal press kemasan 25 kg dan estimasi anggaran proforma.
              </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-10 shadow-sm">
              <div className="grid gap-8 md:grid-cols-12 items-center">
                {/* Controls (7 cols) */}
                <div className="md:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">
                      1. Pilih Jenis Material
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.entries(HOME_PRICES).map(([key, item]) => (
                        <button
                          key={key}
                          onClick={() => setHomeProduct(key)}
                          className={`min-h-[44px] p-2.5 rounded-xl border text-left text-xs transition-colors ${
                            homeProduct === key
                              ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold"
                              : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          <p className="line-clamp-1">{item.label}</p>
                          <p className="text-[10px] opacity-75 mt-0.5">{fmt(item.price)}/kg</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider font-mono">
                        2. Volume Pesanan (kg)
                      </label>
                      <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-500">
                        {homeQty} kg
                      </span>
                    </div>

                    <input
                      type="range"
                      min="25"
                      max="1500"
                      step="25"
                      value={homeQty}
                      onChange={(e) => setHomeQty(parseInt(e.target.value) || 25)}
                      className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />

                    <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                      <span>Min: 25 kg (1 Bal)</span>
                      <span>500 kg</span>
                      <span>Max: 1.500 kg (60 Bal)</span>
                    </div>
                  </div>
                </div>

                {/* Live Output Card (5 cols) */}
                <div className="md:col-span-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6 space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-500">Jumlah Bal Press:</span>
                      <span className="font-mono font-bold text-zinc-900 dark:text-white">{calcBalCount} Bal (25 kg/bal)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-500">Harga Satuan:</span>
                      <span className="font-mono text-zinc-900 dark:text-white">{fmt(selectedProductInfo.price)}/kg</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-500">Fasilitas Antar:</span>
                      <span className={`font-semibold ${isFreeDelivery ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {isFreeDelivery ? "Gratis Armada DARMIN" : "Kargo Reguler"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Estimasi Proforma:</p>
                    <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {fmt(calcSubtotal)}
                    </p>
                  </div>

                  <Button
                    asChild
                    className="w-full min-h-[48px] gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
                  >
                    <a
                      href={`https://wa.me/${waNumber}?text=${quickWaText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4" /> Pesan Volume Ini via WA
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KATALOG PRODUK: Structured B2B technical product cards */}
        <section id="produk" className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                  KATALOG MATERIAL INDUSTRI
                </div>
                <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                  Pilihan Kain Majun & APD Standar Kerja
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Lap perca katun industri dari sisa garmen pilihan. Mengoptimalkan penyerapan oli, air, gemuk, dan pelarut kimia pada lini produksi, perkapalan, dan bengkel.
                </p>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-64 sm:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Cari spesifikasi produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="relative w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full min-h-[44px] pl-3 pr-8 py-2 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-200 appearance-none cursor-pointer focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Desktop / Tablet Product Carousel */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="hidden sm:block relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                      }}
                    >
                      {filteredProducts.map((p) => {
                        const slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
                        return (
                          <div
                            key={p.name}
                            className="shrink-0 px-2.5 flex"
                            style={{ width: `${100 / visibleItems}%` }}
                          >
                            <div className="flex flex-col w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 overflow-hidden shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-200 dark:bg-zinc-900">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute top-3 right-3 bg-zinc-950/90 border border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono text-emerald-400 font-semibold">
                                  Bal Press Ready
                                </div>
                              </div>

                              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                                    {p.category}
                                  </span>
                                  <h3 className="mt-1 text-base font-bold text-zinc-950 dark:text-white line-clamp-1">
                                    {p.name}
                                  </h3>
                                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">
                                    {p.desc}
                                  </p>
                                </div>

                                <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                    Aplikasi Utama:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {p.uses.slice(0, 3).map((u) => (
                                      <span
                                        key={u}
                                        className="inline-flex items-center gap-1 rounded bg-zinc-200/60 dark:bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700/50"
                                      >
                                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 dark:text-emerald-400" />
                                        {u}
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2 pt-2">
                                    <Button
                                      asChild
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 min-h-[44px] text-xs border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
                                    >
                                      <Link href={`/produk/${slug}`}>
                                        Spesifikasi <ArrowRight className="h-3 w-3" />
                                      </Link>
                                    </Button>
                                    <Button
                                      asChild
                                      size="sm"
                                      className="flex-1 min-h-[44px] text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                                    >
                                      <a
                                        href={`https://wa.me/${waNumber}?text=Halo,%20saya%20ingin%20minta%20penawaran%20harga%20untuk%20${encodeURIComponent(p.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        Minta Penawaran
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {filteredProducts.length > visibleItems && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={prevSlide}
                          disabled={currentIndex === 0}
                          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${
                            currentIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                          aria-label="Produk sebelumnya"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextSlide}
                          disabled={currentIndex >= filteredProducts.length - visibleItems}
                          className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${
                            currentIndex >= filteredProducts.length - visibleItems ? "opacity-30 cursor-not-allowed" : ""
                          }`}
                          aria-label="Produk berikutnya"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="text-xs font-mono text-zinc-500">
                        Menampilkan {currentIndex + 1} - {Math.min(currentIndex + visibleItems, filteredProducts.length)} dari {filteredProducts.length} produk
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Vertical Stack */}
                <div className="block sm:hidden space-y-4">
                  {filteredProducts.slice(0, 4).map((p) => {
                    const slug = p.name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");
                    return (
                      <div
                        key={p.name}
                        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-4 space-y-3 shadow-sm"
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-20 w-24 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-900 shrink-0"
                            loading="lazy"
                          />
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                              {p.category}
                            </span>
                            <h3 className="text-sm font-bold text-zinc-950 dark:text-white line-clamp-1">
                              {p.name}
                            </h3>
                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                              {p.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex-1 min-h-[44px] text-xs border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 rounded-xl"
                          >
                            <Link href={`/produk/${slug}`}>Detail</Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            className="flex-1 min-h-[44px] text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                          >
                            <a
                              href={`https://wa.me/${waNumber}?text=Halo,%20saya%20tanya%20${encodeURIComponent(p.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Tanya Harga
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Tidak ada produk yang sesuai dengan pencarian.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("Semua");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-mono text-amber-500 hover:underline"
                >
                  Reset Filter & Pencarian
                </button>
              </div>
            )}
          </div>
        </section>

        {/* TABEL KOMPARASI GRADE MATERIAL INDUSTRI (Technical Comparison Matrix) */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/80 dark:bg-zinc-900/30 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                MATRIKS SPESIFIKASI TEKNIS
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Panduan Perbandingan Antar Grade Majun
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tabel teknis untuk mempermudah purchasing dan kepala mekanik dalam memilih material yang paling sesuai dengan beban kerja mesin.
              </p>
            </div>

            <div className="space-y-2">
              <div className="sm:hidden flex items-center justify-end gap-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <span>Geser ke samping untuk spesifikasi lengkap &rarr;</span>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Grade & Tipe</th>
                    <th className="py-3.5 px-4 font-bold">Struktur Lapis</th>
                    <th className="py-3.5 px-4 font-bold">Daya Serap</th>
                    <th className="py-3.5 px-4 font-bold">Bebas Logam</th>
                    <th className="py-3.5 px-4 font-bold">Aplikasi Utama</th>
                    <th className="py-3.5 px-4 font-bold">Standar Kemasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {technicalMatrix.map((m) => (
                    <tr key={m.grade} className="hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-zinc-950 dark:text-white">
                        <p>{m.grade}</p>
                        <p className="text-[10px] font-mono text-amber-600 dark:text-amber-500 font-normal">{m.type}</p>
                      </td>
                      <td className="py-3.5 px-4">{m.layers}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">{m.absorption}</td>
                      <td className="py-3.5 px-4">{m.metalFree}</td>
                      <td className="py-3.5 px-4">{m.recommendedFor}</td>
                      <td className="py-3.5 px-4 font-mono text-zinc-500 dark:text-zinc-400">{m.packaging}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

        {/* STANDAR PENERAPAN & PENGGUNAAN SEKTOR INDUSTRI */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 mb-8">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                STANDAR TEKNIS SEKTOR PENGGUNA
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Penerapan Spesifik Berdasarkan Standar Industri
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                Setiap sektor operasional memiliki persyaratan kebersihan dan toleransi kotoran yang berbeda. Kami menyesuaikan spesifikasi kain majun untuk menjamin keamanan kerja mesin dan efisiensi konsumsi material.
              </p>
            </div>

            {/* Filter Buttons for Sectors */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedSectorTab("semua")}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedSectorTab === "semua"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                Semua Sektor ({defaultIndustrySectors.length})
              </button>
              {defaultIndustrySectors.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectorTab(sec.id)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedSectorTab === sec.id
                      ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                      : "bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  {sec.sector.split("&")[0].trim()}
                </button>
              ))}
            </div>

            {/* Sector Use Case Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSectors.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                          {sec.category}
                        </span>
                        <div className="flex h-8 w-8 min-h-[32px] min-w-[32px] items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-zinc-950 dark:text-white leading-snug">
                        {sec.sector}
                      </h3>

                      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {sec.need}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                      <div>
                        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                          Rekomendasi Material:
                        </p>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {sec.bestProduct}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        {sec.specs.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-700 dark:text-zinc-300">
                            <ShieldCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full min-h-[44px] mt-2 text-xs border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
                      >
                        <a
                          href={`https://wa.me/${waNumber}?text=Halo,%20kami%20membutuhkan%20kain%20majun%20untuk%20sektor%20${encodeURIComponent(sec.sector)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Konsultasikan Spek Sektor Ini
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ALUR PENGADAAN & DISTRIBUSI B2B */}
        <section id="cara-order" className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/70 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8 scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-2 mb-10 text-center max-w-2xl mx-auto">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                ALUR PENGADAAN B2B & LOGISTIK
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Tahapan Pemesanan & Distribusi Terjadwal
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Skema pengadaan yang dirancang khusus untuk memenuhi standar administrasi purchasing dan operasional gudang manufaktur Anda.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {defaultWorkflow.map((item) => (
                <div
                  key={item.step}
                  className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-5 space-y-4 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <span className="text-2xl font-black font-mono text-zinc-400 dark:text-zinc-600">
                        {item.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-zinc-950 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {item.subtitle}
                    </p>

                    <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                    <Clock className="h-3 w-3" />
                    <span>Layanan Cepat Terverifikasi</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ TEKNIS PURCHASING PABRIK (R-28 Compliant: Real Factory Objections) */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900/40 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                INFORMASI ADMINISTRASI PENGADAAN
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Pertanyaan Seputar Pengadaan & Pembayaran Pabrik
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Jawaban atas pertanyaan umum seputar faktur pajak, jaminan timbangan, sampel fisik uji mutu, dan tempo pembayaran.
              </p>
            </div>

            <div className="space-y-3">
              {procurementFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900 overflow-hidden shadow-sm transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full min-h-[52px] p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-zinc-200/70 dark:hover:bg-zinc-850/60 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-zinc-200 dark:border-zinc-800/80">
                        <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* KEMITRAAN KONVEKSI: Jual Sisa Bongkaran Kain */}
        <section className="border-b border-zinc-200/90 dark:border-zinc-900 bg-zinc-100/70 dark:bg-zinc-950 px-6 py-12 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 p-6 sm:p-10 shadow-lg">
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                    <Recycle className="h-3.5 w-3.5" /> Kemitraan Konveksi & Garmen
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                    {bongkaranTitle}
                  </h2>
                  <div
                    className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 prose dark:prose-invert max-w-2xl"
                    dangerouslySetInnerHTML={{ __html: bongkaranDesc }}
                  />

                  <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Penjemputan Armada Gratis (Min. 100 kg)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Timbangan Digital Terbuka di Tempat
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" /> Pembayaran Tunai atau Transfer Langsung
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 lg:items-end">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto min-h-[48px] px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
                  >
                    <Link href="/jual-bongkaran">
                      Jadwalkan Penjemputan <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    Jadwal Penjemputan: Senin s/d Sabtu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA: Final Direct Procurement Action */}
        <section className="bg-zinc-50 dark:bg-zinc-950 px-6 py-14 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/90 dark:bg-zinc-900/80 p-6 sm:p-12 text-center space-y-6 shadow-xl">
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                PUSAT LAYANAN DISTRIBUSI RESMI
              </div>
              <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
                {ctaTitle}
              </h2>
            </div>

            <div
              className="text-xs sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto prose dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: ctaSubtitle }}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                className="w-full sm:w-auto min-h-[48px] px-6 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md"
              >
                <a
                  href={`https://wa.me/${waNumber}?text=Halo%20CV.%20DARMIN%20MAJUN,%20kami%20ingin%20permintaan%20penawaran%20harga%20resmi.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" /> Hubungi Sales via WhatsApp
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto min-h-[48px] px-6 gap-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
              >
                <Link href="/kalkulator">
                  <Calculator className="h-4 w-4 text-amber-500" /> Simulasi Biaya Distributor
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto min-h-[48px] px-6 gap-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl"
              >
                <Link href="/lacak-pesanan">
                  <Truck className="h-4 w-4 text-amber-500" /> Lacak Surat Jalan Kargo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter
        companyName={companyName}
        address={footerAddress}
        phone={phone}
        email="darminmajun@gmail.com"
        hoursWeekday={hoursWeekday}
        hoursSaturday={hoursSaturday}
        hoursSunday={hoursSunday}
        footerDesc={footerDesc}
      />
    </div>
  );
}
