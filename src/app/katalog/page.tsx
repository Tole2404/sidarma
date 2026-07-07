import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import KatalogClient from "./KatalogClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Katalog Produk Kain Majun & APD | CV. SIDARMA MAJUN",
  description: "Lihat katalog lengkap kain majun lembaran, jahit sambung, jahit tumpuk, dan alat pelindung diri (APD) industri berkualitas tinggi dari CV. SIDARMA MAJUN.",
};

const DEFAULT_PRODUCTS = [
  {
    name: "Majun Lembaran (Tanpa Jahit)",
    category: "Kain Majun",
    desc: "Kain potongan utuh tanpa sambungan. Daya serap tinggi, tidak meninggalkan serat. Ideal untuk mesin presisi & permukaan kaca.",
    uses: ["Mesin presisi & optik", "Lab & farmasi", "Elektronik & semikonduktor", "Kaca & cermin"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Majun Jahit Sambung",
    category: "Kain Majun",
    desc: "Potongan perca dijahit menyambung memanjang. Ekonomis, berdaya serap optimal. Pilihan hemat untuk kebutuhan volume tinggi.",
    uses: ["Pabrik & gudang", "Bengkel otomotif", "Cleaning service", "Pertanian & perikanan"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Majun Jahit Tumpuk",
    category: "Kain Majun",
    desc: "Beberapa lapis kain perca dijahit bertumpuk. Tebal, kuat, dan sangat efektif untuk membersihkan oli dan kotoran berat.",
    uses: ["Bengkel berat & kapal", "Industri minyak & gas", "Pabrik baja & logam", "Konstruksi"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sarung Tangan Industri",
    category: "Alat Pelindung",
    desc: "Sarung tangan benang katun untuk perlindungan tangan pekerja. Nyaman dipakai seharian, daya cengkeram optimal.",
    uses: ["Pabrik manufaktur", "Gudang & logistik", "Konstruksi", "Pertanian"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Alat Pelindung Diri (APD)",
    category: "Alat Pelindung",
    desc: "Masker, kacamata safety, dan perlengkapan APD standar industri sebagai pelengkap keamanan kerja.",
    uses: ["Semua sektor industri", "Rumah sakit & klinik", "Laboratorium", "Pabrik kimia"],
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80",
  },
];

async function getProducts() {
  try {
    const setting = await prisma.landingSetting.findFirst({
      where: { section: "products", key: "list" },
    });
    if (setting?.value) {
      const parsed = JSON.parse(setting.value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to fetch products for catalog:", e);
  }
  return DEFAULT_PRODUCTS;
}

async function getWaNumber() {
  try {
    const setting = await prisma.landingSetting.findFirst({
      where: { section: "hero", key: "wa_number" },
    });
    if (setting?.value) {
      return setting.value.replace(/[^0-9+]/g, "");
    }
  } catch {}
  return "6281234567890";
}

async function getBannerSettings() {
  const banner = {
    badge: "Katalog Lengkap",
    title: "Produk Kain Majun & APD Industri",
    titleStyle: "",
    description: "Menyediakan kain lap majun katun lembaran, jahit sambung, jahit tumpuk, serta alat keselamatan kerja berkualitas tinggi dengan harga produsen terjangkau.",
    bgImage: "",
  };

  try {
    const rows = await prisma.landingSetting.findMany({
      where: { section: "catalog_banner" },
    });
    rows.forEach((row) => {
      if (row.key === "badge" && row.value) banner.badge = row.value;
      if (row.key === "title" && row.value) banner.title = row.value;
      if (row.key === "title_style" && row.value) banner.titleStyle = row.value;
      if (row.key === "description" && row.value) banner.description = row.value;
      if (row.key === "bg_image" && row.value) banner.bgImage = row.value;
    });
  } catch (e) {
    console.error("Failed to load catalog banner settings:", e);
  }

  return banner;
}

export default async function KatalogPage() {
  const products = await getProducts();
  const waNumber = await getWaNumber();
  const banner = await getBannerSettings();

  return <KatalogClient products={products} waNumber={waNumber} banner={banner} />;
}
