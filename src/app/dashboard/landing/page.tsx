"use client";

import { useState, useEffect } from "react";
import { Save, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/PageHeader";
import RichTextEditor from "@/components/RichTextEditor";

interface LandingData {
  [section: string]: {
    [key: string]: string;
  };
}

const SECTIONS = [
  { value: "catalog_banner", label: "Katalog (Hero Banner)" },
  { value: "hero", label: "Hero Section" },
  { value: "stats", label: "Statistik" },
  { value: "products", label: "Daftar Produk" },
  { value: "testimonials", label: "Daftar Testimoni" },
  { value: "about", label: "Tentang Kami" },
  { value: "order", label: "Cara Pemesanan" },
  { value: "cta", label: "CTA / Call to Action" },
  { value: "footer", label: "Footer" },
  { value: "maps", label: "Maps & Lokasi" },
  { value: "jual_bongkaran", label: "Jual Bongkaran (Konveksi)" },
];

const SECTION_FIELDS: Record<string, { key: string; label: string; multiline?: boolean; isImage?: boolean; isRichText?: boolean }[]> = {
  catalog_banner: [
    { key: "badge", label: "Badge Text" },
    { key: "title", label: "Judul Utama" },
    { key: "title_style", label: "Gaya Kustom Judul (CSS Inline, misal: color: #FFB300; font-size: 3rem;)" },
    { key: "description", label: "Deskripsi Banner", isRichText: true },
    { key: "bg_image", label: "Gambar Background Banner", isImage: true },
  ],
  hero: [
    { key: "badge", label: "Badge Text" },
    { key: "title", label: "Judul Utama" },
    { key: "subtitle", label: "Subtitle" },
    { key: "description", label: "Deskripsi", isRichText: true },
    { key: "image", label: "Gambar Hero", isImage: true },
    { key: "trust1", label: "Trust Badge 1" },
    { key: "trust2", label: "Trust Badge 2" },
    { key: "wa_number", label: "Nomor WhatsApp (tanpa 62, misal: 8123456789)" },
  ],
  stats: [
    { key: "exp_years", label: "Tahun Pengalaman (misal: 5+)" },
    { key: "customers", label: "Jumlah Customer (misal: 100+)" },
    { key: "stock", label: "Stok Tersedia (misal: 10 Ton)" },
    { key: "response", label: "Waktu Respon (misal: 24 Jam)" },
  ],
  about: [
    { key: "badge", label: "Badge" },
    { key: "title", label: "Judul" },
    { key: "description", label: "Deskripsi", isRichText: true },
    { key: "trust1", label: "Keunggulan 1" },
    { key: "trust2", label: "Keunggulan 2" },
    { key: "trust3", label: "Keunggulan 3" },
    { key: "trust4", label: "Keunggulan 4" },
    { key: "trust5", label: "Keunggulan 5" },
    { key: "trust6", label: "Keunggulan 6" },
    { key: "address", label: "Alamat" },
    { key: "hours", label: "Jam Operasional" },
    { key: "phone", label: "Telepon" },
    { key: "stock", label: "Stok" },
  ],
  order: [
    { key: "step1_title", label: "Step 1 - Judul" },
    { key: "step1_desc", label: "Step 1 - Deskripsi", isRichText: true },
    { key: "step2_title", label: "Step 2 - Judul" },
    { key: "step2_desc", label: "Step 2 - Deskripsi", isRichText: true },
    { key: "step3_title", label: "Step 3 - Judul" },
    { key: "step3_desc", label: "Step 3 - Deskripsi", isRichText: true },
  ],
  cta: [
    { key: "title", label: "Judul" },
    { key: "subtitle", label: "Subtitle", isRichText: true },
    { key: "wa_number", label: "Nomor WhatsApp" },
  ],
  footer: [
    { key: "company_name", label: "Nama Perusahaan" },
    { key: "description", label: "Deskripsi", isRichText: true },
    { key: "wa_label", label: "Label WhatsApp" },
    { key: "wa_number", label: "Nomor WhatsApp" },
    { key: "email_label", label: "Label Email" },
    { key: "email", label: "Alamat Email" },
    { key: "address", label: "Alamat" },
    { key: "hours_weekday", label: "Jam weekday" },
    { key: "hours_saturday", label: "Jam Sabtu" },
    { key: "hours_sunday", label: "Jam Minggu" },
  ],
  maps: [
    { key: "embed_url", label: "Google Maps Embed URL" },
    { key: "maps_link", label: "Link Google Maps (buka di Maps app)" },
    { key: "location_name", label: "Nama Lokasi" },
    { key: "location_subtitle", label: "Subtitle Lokasi" },
  ],
  jual_bongkaran: [
    { key: "badge", label: "Badge (atas judul)" },
    { key: "title", label: "Judul Utama" },
    { key: "subtitle", label: "Subtitle" },
    { key: "description", label: "Deskripsi", isRichText: true },
    { key: "wa_text", label: "Pesan WhatsApp Default", multiline: true },
  ],
};

export default function LandingCMS() {
  const [selectedSection, setSelectedSection] = useState("hero");
  const [data, setData] = useState<LandingData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for products modal
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null);
  const [editingProductData, setEditingProductData] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // States for testimonials modal
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState<number | null>(null);
  const [editingTestimonialData, setEditingTestimonialData] = useState<any | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/landing", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      
      // Pre-populate products list if missing
      if (!json.products || !json.products.list) {
        if (!json.products) json.products = {};
        json.products.list = JSON.stringify([
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
        ]);
      }

      // Pre-populate testimonials list if missing
      if (!json.testimonials || !json.testimonials.list) {
        if (!json.testimonials) json.testimonials = {};
        json.testimonials.list = JSON.stringify([
          {
            name: "Bapak Hendra",
            company: "CV. Maju Jaya Bengkel",
            role: "Owner",
            content: "Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan. Stok selalu tersedia dan pengiriman cepat.",
            rating: 5,
            avatar: "",
          },
          {
            name: "Ibu Sari",
            company: "PT. Bersih Semesta",
            role: "Purchasing Manager",
            content: "Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami. Harga distributor jauh lebih kompetitif dari pasar.",
            rating: 5,
            avatar: "",
          },
          {
            name: "Pak Doni",
            company: "Galangan Kapal Nusantara",
            role: "Site Manager",
            content: "Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal yang penuh oli berat, hasilnya memuaskan.",
            rating: 5,
            avatar: "",
          },
        ]);
      }

      setData(json);
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const sectionData = data[selectedSection] || {};
      const updates = Object.entries(sectionData).map(([key, value]) => ({
        section: selectedSection,
        key,
        value,
      }));

      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: updates }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  // Helper: langsung simpan list section ke database tanpa perlu klik tombol Simpan utama
  async function saveListToDB(section: string, listJson: string) {
    try {
      const res = await fetch("/api/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [{ section, key: "list", value: listJson }],
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Gagal menyimpan data ke database");
    }
  }

  function handleFieldChange(key: string, value: string) {
    setData((prev) => ({
      ...prev,
      [selectedSection]: {
        ...prev[selectedSection],
        [key]: value,
      },
    }));
    setSaved(false);
  }

  const currentFields = SECTION_FIELDS[selectedSection] || [];
  const currentData = data[selectedSection] || {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pengaturan"
        title="Landing Page CMS"
        description="Kelola konten landing page website"
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Mobile select dropdown */}
        <div className="block lg:hidden w-full space-y-1.5">
          <Label htmlFor="section-select" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Pilih Section
          </Label>
          <select
            id="section-select"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm focus:border-zinc-300 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            {SECTIONS.map((section) => (
              <option key={section.value} value={section.value}>
                {section.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Section selector */}
        <div className="hidden lg:block lg:w-64 shrink-0 space-y-1">
          <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Pilih Section
          </Label>
          <div className="rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
            {SECTIONS.map((section) => (
              <button
                key={section.value}
                onClick={() => setSelectedSection(section.value)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  selectedSection === section.value
                    ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <ChevronRight className="h-3.5 w-3.5" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Edit form */}
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {SECTIONS.find((s) => s.value === selectedSection)?.label}
                </h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Edit konten untuk section ini
                </p>
              </div>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-sm text-emerald-600 font-medium">
                    Tersimpan ✓
                  </span>
                )}
                {error && (
                  <span className="text-sm text-rose-600 font-medium">
                    {error}
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="gap-2"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-100" />
                  </div>
                ))}
              </div>
            ) : selectedSection === "products" ? (
              (() => {
                const rawList = data.products?.list || "";
                let parsedProducts: any[] = [];
                try {
                  if (rawList) {
                    parsedProducts = JSON.parse(rawList);
                  }
                } catch {}
                if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
                  parsedProducts = [
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
                }

                const handleProductsChange = async (newProducts: any[]) => {
                  const newListJson = JSON.stringify(newProducts);
                  setData((prev) => ({
                    ...prev,
                    products: {
                      list: newListJson,
                    },
                  }));
                  await saveListToDB("products", newListJson);
                };

                return (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-sm font-medium text-zinc-500">
                        Total {parsedProducts.length} Produk
                      </span>
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingProductData({
                            name: "",
                            category: "Kain Majun",
                            desc: "",
                            uses: [],
                            image: "",
                          });
                          setIsAddingProduct(true);
                        }}
                        size="sm"
                      >
                        + Tambah Produk
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                      {parsedProducts.map((p, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
                              {p.image ? (
                                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-xs text-zinc-400 font-bold">No img</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                              <p className="text-xs text-zinc-400 font-medium">{p.category}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 w-full sm:w-auto border-t pt-3 sm:border-t-0 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProductIndex(index);
                                setEditingProductData({ ...p });
                              }}
                              className="px-2.5 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = parsedProducts.filter((_, idx) => idx !== index);
                                handleProductsChange(list);
                              }}
                              className="px-2.5 py-1 text-xs border border-red-200 dark:border-red-950/30 text-red-650 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold transition-colors"
                            >
                              Hapus
                            </button>
                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => {
                                if (index === 0) return;
                                const list = [...parsedProducts];
                                const temp = list[index];
                                list[index] = list[index - 1];
                                list[index - 1] = temp;
                                handleProductsChange(list);
                              }}
                              className="p-1 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 transition-colors"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={index === parsedProducts.length - 1}
                              onClick={() => {
                                if (index === parsedProducts.length - 1) return;
                                const list = [...parsedProducts];
                                const temp = list[index];
                                list[index] = list[index + 1];
                                list[index + 1] = temp;
                                handleProductsChange(list);
                              }}
                              className="p-1 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 transition-colors"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : selectedSection === "testimonials" ? (
              (() => {
                const rawList = data.testimonials?.list || "";
                let parsedTestimonials: any[] = [];
                try {
                  if (rawList) {
                    parsedTestimonials = JSON.parse(rawList);
                  }
                } catch {}
                if (!Array.isArray(parsedTestimonials) || parsedTestimonials.length === 0) {
                  parsedTestimonials = [
                    {
                      name: "Bapak Hendra",
                      company: "CV. Maju Jaya Bengkel",
                      role: "Owner",
                      content: "Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan. Stok selalu tersedia dan pengiriman cepat.",
                      rating: 5,
                      avatar: "",
                    },
                    {
                      name: "Ibu Sari",
                      company: "PT. Bersih Semesta",
                      role: "Purchasing Manager",
                      content: "Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami. Harga distributor jauh lebih kompetitif dari pasar.",
                      rating: 5,
                      avatar: "",
                    },
                    {
                      name: "Pak Doni",
                      company: "Galangan Kapal Nusantara",
                      role: "Site Manager",
                      content: "Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal yang penuh oli berat, hasilnya memuaskan.",
                      rating: 5,
                      avatar: "",
                    },
                  ];
                }

                const handleTestimonialsChange = async (newList: any[]) => {
                  const newListJson = JSON.stringify(newList);
                  setData((prev) => ({
                    ...prev,
                    testimonials: {
                      list: newListJson,
                    },
                  }));
                  await saveListToDB("testimonials", newListJson);
                };

                return (
                   <div className="space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
                       <span className="text-sm font-medium text-zinc-500">
                         Total {parsedTestimonials.length} Testimoni
                       </span>
                       <Button
                         type="button"
                         onClick={() => {
                           setEditingTestimonialData({
                             name: "",
                             company: "",
                             role: "",
                             content: "",
                             rating: 5,
                             avatar: "",
                           });
                           setIsAddingTestimonial(true);
                         }}
                         size="sm"
                       >
                         + Tambah Testimoni
                       </Button>
                     </div>

                     <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                       {parsedTestimonials.map((t, index) => (
                         <div
                           key={index}
                           className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/40 transition-colors"
                         >
                           <div className="flex items-center gap-3">
                             <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 shadow-inner flex items-center justify-center">
                               {t.avatar ? (
                                 <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                               ) : (
                                 <span className="text-xs text-zinc-400 font-bold">{t.name.split(" ").slice(-1)[0][0]}</span>
                               )}
                             </div>
                             <div>
                               <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                               <p className="text-xs text-zinc-400 font-medium">{t.company}</p>
                             </div>
                           </div>

                           <div className="flex items-center justify-end gap-2 w-full sm:w-auto border-t pt-3 sm:border-t-0 sm:pt-0 border-zinc-100 dark:border-zinc-800">
                             <button
                               type="button"
                               onClick={() => {
                                 setEditingTestimonialIndex(index);
                                 setEditingTestimonialData({ ...t });
                               }}
                               className="px-2.5 py-1 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
                             >
                               Edit
                             </button>
                             <button
                               type="button"
                               onClick={() => {
                                 const list = parsedTestimonials.filter((_, idx) => idx !== index);
                                 handleTestimonialsChange(list);
                               }}
                               className="px-2.5 py-1 text-xs border border-red-200 dark:border-red-950/30 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold transition-colors"
                             >
                               Hapus
                             </button>
                             <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
                             <button
                               type="button"
                               disabled={index === 0}
                               onClick={() => {
                                 if (index === 0) return;
                                 const list = [...parsedTestimonials];
                                 const temp = list[index];
                                 list[index] = list[index - 1];
                                 list[index - 1] = temp;
                                 handleTestimonialsChange(list);
                               }}
                               className="p-1 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 transition-colors"
                             >
                               ↑
                             </button>
                             <button
                               type="button"
                               disabled={index === parsedTestimonials.length - 1}
                               onClick={() => {
                                 if (index === parsedTestimonials.length - 1) return;
                                 const list = [...parsedTestimonials];
                                 const temp = list[index];
                                 list[index] = list[index + 1];
                                 list[index + 1] = temp;
                                 handleTestimonialsChange(list);
                               }}
                               className="p-1 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 transition-colors"
                             >
                               ↓
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })()
            ) : (
              <div className="space-y-5">
                {currentFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium text-zinc-700">
                      {field.label}
                    </Label>
                    {field.isImage ? (
                      <div className="flex gap-2 items-center">
                        {currentData[field.key] && (
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-55 shadow-sm flex items-center justify-center">
                            <img
                              src={currentData[field.key]}
                              alt="Preview"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        )}
                        <Input
                          id={field.key}
                          value={currentData[field.key] || ""}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="flex-1"
                        />
                        <div className="relative shrink-0">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              
                              const formData = new FormData();
                              formData.append("file", file);
                              
                              try {
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData,
                                });
                                const json = await res.json();
                                if (json.success && json.url) {
                                  handleFieldChange(field.key, json.url);
                                } else {
                                  alert(json.error || "Gagal mengunggah gambar");
                                }
                              } catch {
                                alert("Gagal menghubungi server untuk mengunggah gambar");
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <Button type="button" variant="outline" size="sm" className="h-10 text-xs">
                            Upload File
                          </Button>
                        </div>
                      </div>
                    ) : field.isRichText ? (
                      <RichTextEditor
                        value={currentData[field.key] || ""}
                        onChange={(val) => handleFieldChange(field.key, val)}
                        placeholder={`Tulis ${field.label.toLowerCase()}...`}
                      />
                    ) : field.multiline ? (
                      <textarea
                        id={field.key}
                        value={currentData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={3}
                        className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-950 dark:focus:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:focus:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={currentData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={`Masukkan ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview link */}
          <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center">
            <p className="text-sm text-zinc-500">
              Lihat preview landing page:{" "}
              <a href="/" target="_blank" className="font-medium text-zinc-950 hover:underline">
                Buka di tab baru
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Modal Edit/Tambah Produk */}
      {(editingProductData !== null || isAddingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col p-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {isAddingProduct ? "Tambah Produk Baru" : "Edit Produk"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProductIndex(null);
                  setEditingProductData(null);
                  setIsAddingProduct(false);
                }}
                className="text-zinc-400 hover:text-zinc-650"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Produk</Label>
                  <Input
                    value={editingProductData?.name || ""}
                    onChange={(e) => setEditingProductData((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama Produk"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Kategori</Label>
                  <select
                    value={editingProductData?.category || "Kain Majun"}
                    onChange={(e) => setEditingProductData((prev: any) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-zinc-950 dark:focus:border-zinc-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Kain Majun" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">Kain Majun</option>
                    <option value="Alat Pelindung" className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">Alat Pelindung</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Deskripsi</Label>
                <textarea
                  value={editingProductData?.desc || ""}
                  onChange={(e) => setEditingProductData((prev: any) => ({ ...prev, desc: e.target.value }))}
                  rows={2}
                  className="flex min-h-[60px] w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 px-3 py-2 text-sm focus:border-zinc-950 dark:focus:border-zinc-700 focus:outline-none"
                  placeholder="Deskripsi singkat produk..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Cocok Untuk (pisahkan dengan koma)</Label>
                <Input
                  value={Array.isArray(editingProductData?.uses) ? editingProductData.uses.join(", ") : ""}
                  onChange={(e) => {
                    const usesVal = e.target.value.split(",").map(u => u.trim());
                    setEditingProductData((prev: any) => ({ ...prev, uses: usesVal }));
                  }}
                  placeholder="Penggunaan 1, Penggunaan 2..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Gambar Produk</Label>
                <div className="flex gap-2 items-center">
                  {editingProductData?.image && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                      <img
                        src={editingProductData.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <Input
                    value={editingProductData?.image || ""}
                    onChange={(e) => setEditingProductData((prev: any) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://images.unsplash.com/... atau upload"
                    className="flex-1"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const json = await res.json();
                          if (json.success && json.url) {
                            setEditingProductData((prev: any) => ({ ...prev, image: json.url }));
                          } else {
                            alert(json.error || "Gagal mengunggah gambar");
                          }
                        } catch {
                          alert("Gagal mengunggah gambar");
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button type="button" variant="outline" size="sm" className="h-10 text-xs">
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingProductIndex(null);
                  setEditingProductData(null);
                  setIsAddingProduct(false);
                }}
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto"
                onClick={async () => {
                  if (!editingProductData?.name || !editingProductData?.category || !editingProductData?.desc) {
                    alert("Nama, Kategori, dan Deskripsi harus diisi.");
                    return;
                  }
                  
                  // Read data list
                  const rawList = data.products?.list || "";
                  let parsedProducts: any[] = [];
                  try {
                    if (rawList) parsedProducts = JSON.parse(rawList);
                  } catch {}

                  // Apply fallback jika kosong
                  if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
                    parsedProducts = [
                      { name: "Majun Lembaran (Tanpa Jahit)", category: "Kain Majun", desc: "Kain potongan utuh tanpa sambungan. Daya serap tinggi.", uses: ["Mesin presisi & optik", "Lab & farmasi"], image: "" },
                      { name: "Majun Jahit Sambung", category: "Kain Majun", desc: "Potongan perca dijahit menyambung. Ekonomis dan berdaya serap optimal.", uses: ["Pabrik & gudang", "Bengkel otomotif"], image: "" },
                      { name: "Majun Jahit Tumpuk", category: "Kain Majun", desc: "Beberapa lapis kain perca dijahit bertumpuk. Tebal dan kuat.", uses: ["Bengkel berat & kapal", "Industri minyak & gas"], image: "" },
                      { name: "Sarung Tangan Industri", category: "Alat Pelindung", desc: "Sarung tangan benang katun untuk perlindungan tangan pekerja.", uses: ["Pabrik manufaktur", "Gudang & logistik"], image: "" },
                      { name: "Alat Pelindung Diri (APD)", category: "Alat Pelindung", desc: "Masker, kacamata safety, dan perlengkapan APD standar industri.", uses: ["Semua sektor industri", "Rumah sakit & klinik"], image: "" },
                    ];
                  }
                  
                  const list = [...parsedProducts];
                  if (isAddingProduct) {
                    list.push(editingProductData);
                  } else if (editingProductIndex !== null) {
                    list[editingProductIndex] = editingProductData;
                  }

                  const newListJson = JSON.stringify(list);

                  // Update state lokal
                  setData((prev) => ({
                    ...prev,
                    products: {
                      list: newListJson,
                    },
                  }));

                  // Langsung simpan ke database
                  await saveListToDB("products", newListJson);

                  setEditingProductIndex(null);
                  setEditingProductData(null);
                  setIsAddingProduct(false);
                }}
              >
                Simpan & Perbarui
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit/Tambah Testimonial */}
      {(editingTestimonialData !== null || isAddingTestimonial) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col p-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {isAddingTestimonial ? "Tambah Testimoni Baru" : "Edit Testimoni"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonialIndex(null);
                  setEditingTestimonialData(null);
                  setIsAddingTestimonial(false);
                }}
                className="text-zinc-400 hover:text-zinc-650"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Pelanggan</Label>
                  <Input
                    value={editingTestimonialData?.name || ""}
                    onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nama Pelanggan"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Perusahaan</Label>
                  <Input
                    value={editingTestimonialData?.company || ""}
                    onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, company: e.target.value }))}
                    placeholder="Perusahaan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Jabatan (Role)</Label>
                  <Input
                    value={editingTestimonialData?.role || ""}
                    onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, role: e.target.value }))}
                    placeholder="Misal: Owner, Purchasing"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Rating (Bintang)</Label>
                  <select
                    value={editingTestimonialData?.rating || 5}
                    onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:border-zinc-950 dark:focus:border-zinc-600 focus:outline-none cursor-pointer"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">{n} Bintang</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Isi Testimoni</Label>
                <textarea
                  value={editingTestimonialData?.content || ""}
                  onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 px-3 py-2 text-sm focus:border-zinc-950 dark:focus:border-zinc-700 focus:outline-none"
                  placeholder="Tulis testimoni pelanggan..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Foto/Avatar</Label>
                <div className="flex gap-2 items-center">
                  {editingTestimonialData?.avatar && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                      <img
                        src={editingTestimonialData.avatar}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <Input
                    value={editingTestimonialData?.avatar || ""}
                    onChange={(e) => setEditingTestimonialData((prev: any) => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://images.unsplash.com/... atau upload"
                    className="flex-1"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const json = await res.json();
                          if (json.success && json.url) {
                            setEditingTestimonialData((prev: any) => ({ ...prev, avatar: json.url }));
                          } else {
                            alert(json.error || "Gagal mengunggah gambar");
                          }
                        } catch {
                          alert("Gagal mengunggah gambar");
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button type="button" variant="outline" size="sm" className="h-10 text-xs">
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingTestimonialIndex(null);
                  setEditingTestimonialData(null);
                  setIsAddingTestimonial(false);
                }}
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-full sm:w-auto"
                onClick={async () => {
                  if (!editingTestimonialData?.name || !editingTestimonialData?.company || !editingTestimonialData?.content) {
                    alert("Nama, Perusahaan, dan Isi Testimoni harus diisi.");
                    return;
                  }
                  
                  // Read data list
                  const rawList = data.testimonials?.list || "";
                  let parsedTestimonials: any[] = [];
                  try {
                    if (rawList) parsedTestimonials = JSON.parse(rawList);
                  } catch {}

                  // Apply fallback jika kosong
                  if (!Array.isArray(parsedTestimonials) || parsedTestimonials.length === 0) {
                    parsedTestimonials = [
                      { name: "Bapak Hendra", company: "CV. Maju Jaya Bengkel", role: "Owner", content: "Sudah 3 tahun langganan SIDARMA. Kualitas majun putihnya konsisten, tidak pernah mengecewakan.", rating: 5, avatar: "" },
                      { name: "Ibu Sari", company: "PT. Bersih Semesta", role: "Purchasing Manager", content: "Sebagai cleaning service yang butuh stok rutin, SIDARMA jadi mitra terpercaya kami.", rating: 5, avatar: "" },
                      { name: "Pak Doni", company: "Galangan Kapal Nusantara", role: "Site Manager", content: "Majun jahit tumpuknya sangat kuat dan tahan lama. Kami pakai untuk pembersihan mesin kapal.", rating: 5, avatar: "" },
                    ];
                  }

                  const list = [...parsedTestimonials];
                  if (isAddingTestimonial) {
                    list.push(editingTestimonialData);
                  } else if (editingTestimonialIndex !== null) {
                    list[editingTestimonialIndex] = editingTestimonialData;
                  }

                  const newListJson = JSON.stringify(list);

                  // Update state lokal
                  setData((prev) => ({
                    ...prev,
                    testimonials: {
                      list: newListJson,
                    },
                  }));

                  // Langsung simpan ke database
                  await saveListToDB("testimonials", newListJson);

                  setEditingTestimonialIndex(null);
                  setEditingTestimonialData(null);
                  setIsAddingTestimonial(false);
                }}
              >
                Simpan & Perbarui
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}