import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, ShieldCheck, Truck, HelpCircle, Phone, PackageCheck } from "lucide-react";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_PRODUCTS = [
  {
    name: "Majun Lembaran (Tanpa Jahit)",
    category: "Kain Majun",
    desc: "Kain katun potongan utuh tanpa sambungan jahitan. Daya serap cairan dan pelarut tinggi, tidak meninggalkan serpihan debu perca. Standar wajib untuk perakitan blok mesin presisi, komponen silinder, bearing, optik, dan kaca.",
    uses: ["Mesin presisi & bearing", "Perakitan blok mesin otomotif", "Elektronik & optik", "Laboratorium & kaca"],
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Majun Jahit Sambung",
    category: "Kain Majun",
    desc: "Potongan perca katun kaos dijahit menyambung memanjang dengan jahitan rapi. Pilihan pasokan paling ekonomis dengan daya serap optimal untuk pembersihan rutin di workshop manufaktur dan gudang.",
    uses: ["Pabrik manufaktur", "Bengkel otomotif", "Workshop perbaikan mesin", "Perawatan lantai gudang"],
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Majun Jahit Tumpuk",
    category: "Kain Majun",
    desc: "3 hingga 5 lapis kain perca katun dijahit silang padat. Sangat tebal, tahan robek saat mengusap pelat baja tajam, dan memiliki kapasitas tampung cairan tinggi untuk oli kental SAE 40/90, gemuk (grease), dan residu solar.",
    uses: ["Bengkel alat berat", "Galangan kapal & marine", "Pabrik baja & stamping", "Mesin bubut & CNC milling"],
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sarung Tangan Industri",
    category: "Alat Pelindung",
    desc: "Sarung tangan rajut katun tebal untuk proteksi tangan teknisi dan operator. Memberikan daya cengkeram optimal pada perkakas licin dan melindungi kulit dari gesekan permukaan kasar.",
    uses: ["Operator mesin pabrik", "Gudang & logistik kargo", "Konstruksi baja & fabrikasi", "Pertanian & perikanan"],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Alat Pelindung Diri (APD)",
    category: "Alat Pelindung",
    desc: "Kacamata safety standar industri, masker pelindung partikel debu, dan perlengkapan keselamatan kerja K3 sebagai pendukung operasional tenaga kerja pabrik.",
    uses: ["Semua lini manufaktur", "Bengkel bubut & las", "Area berdebu & kimia", "Warehouse"],
    image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=800&q=80",
  },
];

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

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
    console.error("Gagal mengambil data produk:", e);
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => slugify(p.name) === slug);
  if (!product) return { title: "Produk Tidak Ditemukan" };
  return {
    title: `${product.name} | CV. DARMIN MAJUN`,
    description: product.desc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => slugify(p.name) === slug);

  if (!product) notFound();

  const waNumber = await getWaNumber();
  const waLink = `https://wa.me/${waNumber}?text=Halo%20CV.%20DARMIN%20MAJUN,%20kami%20ingin%20minta%20penawaran%20harga%20dan%20stok%20untuk%20produk%20*${encodeURIComponent(product.name)}*`;
  const sampleLink = `https://wa.me/${waNumber}?text=Halo,%20kami%20dari%20pihak%20perusahaan%20ingin%20meminta%20sampel%20fisik%20uji%20mutu%20untuk%20*${encodeURIComponent(product.name)}*`;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-amber-500 selection:text-zinc-950 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Back button */}
          <div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors py-2"
            >
              <ArrowLeft className="h-4 w-4 text-amber-500" />
              Kembali ke Katalog Produk
            </Link>
          </div>

          {/* Product Detail Layout */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 p-6 sm:p-10 shadow-sm">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              {/* Product Photo: 5 cols */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-700 dark:border-zinc-800 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold text-emerald-400">
                    Stok Gudang Siap Muat
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-950 p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Sortir Ketat Manual Bebas Logam</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <Truck className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Kemasan Bal Press 25 kg & 50 kg</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                    <PackageCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <span>Faktur Resmi & Surat Penawaran (SPH)</span>
                  </div>
                </div>
              </div>

              {/* Product Info: 7 cols */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-500 uppercase">
                    {product.category}
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
                    {product.name}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {product.desc}
                </p>

                {/* Uses List */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Aplikasi Rekomendasi Sektor:
                  </h3>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {product.uses.map((use: string) => (
                      <div
                        key={use}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-700 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <span>{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Action Buttons */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="flex-1 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md"
                  >
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <Phone className="h-4 w-4" /> Minta Penawaran Harga
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="flex-1 min-h-[48px] border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl text-xs sm:text-sm"
                  >
                    <a href={sampleLink} target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="h-4 w-4 text-zinc-400" /> Minta Sampel Fisik Uji Mutu
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
