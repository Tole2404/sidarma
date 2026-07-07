import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, ShieldCheck, Truck, HelpCircle } from "lucide-react";
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
    console.error("Failed to fetch products:", e);
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
    title: `${product.name} | CV. SIDARMA MAJUN`,
    description: product.desc,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find((p: any) => slugify(p.name) === slug);

  if (!product) notFound();

  const waNumber = await getWaNumber();
  const waLink = `https://wa.me/${waNumber}?text=Halo%20CV.%20SIDARMA%20MAJUN,%20saya%20tertarik%20dengan%20produk%20*${encodeURIComponent(product.name)}*`;

  return (
    <div className="min-h-screen bg-zinc-55/40 dark:bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Dynamic ambient blur decorations */}
      <div className="absolute top-1/4 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <SiteNavbar />

      <main className="relative z-10 flex-1 py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back button pill */}
          <div className="mb-8">
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 px-4.5 py-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-primary" /> Kembali ke Katalog
            </Link>
          </div>

          {/* Product Detail Container */}
          <div className="grid gap-6 md:grid-cols-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-8 shadow-sm">
            {/* Left side: Product Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-55/30 dark:bg-zinc-950 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute top-4 right-4">
                <span className="rounded-full bg-emerald-500/90 backdrop-blur-sm px-3.5 py-1 text-xs font-semibold text-white shadow-sm border border-emerald-400/20">
                  Ready Stock
                </span>
              </div>
            </div>

            {/* Right side: Product Metadata (Clean natural spacing) */}
            <div className="flex flex-col gap-5 justify-start py-1">
              <div>
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {product.category}
                </div>

                {/* Product Name */}
                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
                  {product.name}
                </h1>

                {/* Product Description */}
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {product.desc}
                </p>

                {/* Uses List as Micro-Cards */}
                <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5 font-mono">
                    Sangat Cocok Untuk:
                  </h3>
                  <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                    {product.uses.map((use: string) => (
                      <div
                        key={use}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/40 dark:border-zinc-800/50 transition-colors hover:bg-zinc-100/40 dark:hover:bg-zinc-900/20"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-1 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Garansi kualitas potongan & daya serap optimal</span>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-500 -mt-1">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  <span>Mendukung pengiriman tonase besar ke seluruh wilayah</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
                  <Button asChild size="lg" className="flex-1 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl gap-2 shadow-lg shadow-primary/20 h-11">
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-4.5 w-4.5" /> Tanya Harga via WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl gap-2 font-bold text-xs h-11">
                    <a href={`https://wa.me/${waNumber}?text=Halo,%20saya%20ingin%20meminta%20sampel%20produk%20*${encodeURIComponent(product.name)}*`} target="_blank" rel="noopener noreferrer">
                      <HelpCircle className="h-4.5 w-4.5" /> Minta Sampel
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
