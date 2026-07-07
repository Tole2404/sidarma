import { prisma } from "@/lib/db";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";

/**
 * Default theme tokens. Hex value harus konsisten dengan globals.css default.
 * Token ini di-override CSS variables Tailwind v4 (--color-zinc-*, --color-amber-*, dst).
 */
export const DEFAULT_THEME: Record<string, string> = {
  // Netral / Slate (background, border, surface, text)
  "zinc-50": "#F8FAFC",
  "zinc-100": "#F1F5F9",
  "zinc-200": "#E2E8F0",
  "zinc-300": "#CBD5E1",
  "zinc-400": "#94A3B8",
  "zinc-500": "#64748B",
  "zinc-600": "#475569",
  "zinc-700": "#334155",
  "zinc-800": "#1E293B",
  "zinc-900": "#0F172A",
  "zinc-950": "#090D1F",

  // Brand / Primary Action
  "primary": "#3874FF",
  "primary-hover": "#1E56E3",

  // Aksen / Brand (Safety Amber)
  "amber-500": "#F59E0B",
  "amber-600": "#D97706",
  "amber-700": "#B45309",

  // Status
  "emerald-500": "#10B981",
  "emerald-600": "#059669",
  "rose-500": "#F43F5E",
  "rose-600": "#E11D48",
  "blue-500": "#3B82F6",
  "blue-600": "#2563EB",
};

export const THEME_TOKEN_KEYS = Object.keys(DEFAULT_THEME);

/**
 * Preset palette siap pakai (sumber: color.md).
 */
export const THEME_PRESETS: Record<string, { label: string; description: string; tokens: Partial<Record<string, string>> }> = {
  industrial: {
    label: "Industrial Steel (Default)",
    description: "Tema asli SIDARMA — Slate + Safety Amber.",
    tokens: { ...DEFAULT_THEME },
  },
  professionalDark: {
    label: "Professional Dark",
    description: "Latar gelap, aksen teal — cocok untuk dashboard.",
    tokens: {
      "zinc-50": "#EEEEEE",
      "zinc-100": "#E5E7EB",
      "zinc-200": "#D1D5DB",
      "zinc-700": "#393E46",
      "zinc-800": "#2D3239",
      "zinc-900": "#222831",
      "zinc-950": "#1A1F26",
      "amber-500": "#00ADB5",
      "amber-600": "#008B92",
      "amber-700": "#006A70",
    },
  },
  cleanBusiness: {
    label: "Clean Business",
    description: "Netral terang, profesional, minimalis.",
    tokens: {
      "zinc-50": "#F8F9FA",
      "zinc-100": "#E9ECEF",
      "zinc-200": "#DEE2E6",
      "zinc-500": "#6C757D",
      "zinc-700": "#495057",
      "zinc-900": "#212529",
      "zinc-950": "#0F1418",
      "amber-500": "#0D6EFD",
      "amber-600": "#0B5ED7",
      "amber-700": "#0A58CA",
    },
  },
  warmProfessional: {
    label: "Warm Professional",
    description: "Hangat, ramah, dengan aksen oranye.",
    tokens: {
      "zinc-50": "#F5F5F5",
      "zinc-100": "#ECECEC",
      "zinc-200": "#DDDDDD",
      "zinc-700": "#3D3D3D",
      "zinc-900": "#1F1F1F",
      "zinc-950": "#141414",
      "amber-500": "#FF6B35",
      "amber-600": "#E5552A",
      "amber-700": "#C7461F",
    },
  },
  modernNeutral: {
    label: "Modern Neutral",
    description: "Tone biru tua dengan aksen merah CTA.",
    tokens: {
      "zinc-50": "#F1F3F8",
      "zinc-100": "#E2E6EF",
      "zinc-700": "#16213E",
      "zinc-800": "#13182E",
      "zinc-900": "#0F3460",
      "zinc-950": "#1A1A2E",
      "amber-500": "#E94560",
      "amber-600": "#C8344C",
      "amber-700": "#A02839",
    },
  },
};

/**
 * Default SEO tokens — fallback ke metadata yang ada di layout/page sebelumnya.
 */
export type SeoTokens = {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterHandle: string;
  canonical: string;
  themeColor: string;
};

export const DEFAULT_SEO: Record<string, SeoTokens> = {
  default: {
    title: "CV. SIDARMA MAJUN — Distributor Kain Majun Terpercaya",
    titleTemplate: "%s | CV. SIDARMA MAJUN",
    description:
      "Distributor & supplier kain majun putih dan warna berkualitas. Harga langsung dari distributor, stok 10 ton, pengiriman cepat ke seluruh Jawa.",
    keywords:
      "kain majun, kain majun murah, distributor kain majun, jual kain majun, kain lap industri, kain majun putih, kain majun warna, majun jahit sambung, majun lembaran, kain perca",
    ogImage: "/og-image.png",
    ogTitle: "CV. SIDARMA MAJUN — Distributor Kain Majun Terpercaya",
    ogDescription:
      "Distributor kain majun putih & warna. Harga distributor, stok siap kirim.",
    twitterHandle: "",
    canonical: "",
    themeColor: "#0d9488",
  },
  home: {
    title: "CV. SIDARMA MAJUN — Distributor Kain Majun Putih & Warna Terpercaya",
    titleTemplate: "",
    description:
      "Distributor kain majun putih dan warna. Harga langsung dari pabrik, stok 10 ton, pengiriman cepat ke seluruh Jawa. Majun lembaran, jahit sambung, jahit tumpuk, sarung tangan industri.",
    keywords: "",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
  artikel: {
    title: "Artikel & Blog — Pusat Edukasi Kain Majun",
    titleTemplate: "",
    description:
      "Tips, panduan, dan wawasan seputar industri kain majun, cleaning service, dan kebutuhan tekstil industri.",
    keywords: "artikel kain majun, blog kain majun, tips industri",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
  karir: {
    title: "Karir — Bergabung dengan CV. SIDARMA MAJUN",
    titleTemplate: "",
    description:
      "Lowongan kerja terbuka di CV. SIDARMA MAJUN. Bergabunglah bersama kami untuk membangun bisnis distribusi kain majun terpercaya.",
    keywords: "lowongan kerja, karir, sidarma majun",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
  kalkulator: {
    title: "Kalkulator Harga Kain Majun",
    titleTemplate: "",
    description:
      "Hitung estimasi harga kain majun, ongkos kirim, dan dampak ESG dari pemesanan Anda secara cepat dan transparan.",
    keywords: "kalkulator kain majun, harga kain majun",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
  jualBongkaran: {
    title: "Jual Kain Bongkaran Konveksi — CV. SIDARMA MAJUN",
    titleTemplate: "",
    description:
      "Kami beli kain bongkaran konveksi: sisa potongan, kain reject, sample, dan stok gudang. Harga terbaik, jemput gratis, bayar tunai di tempat.",
    keywords: "jual bongkaran konveksi, jual kain bongkaran, beli kain perca, kain reject konveksi, limbah konveksi",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
  lacak: {
    title: "Lacak Pesanan — CV. SIDARMA MAJUN",
    titleTemplate: "",
    description: "Lacak status pesanan kain majun Anda secara real-time.",
    keywords: "lacak pesanan, tracking",
    ogImage: "",
    ogTitle: "",
    ogDescription: "",
    twitterHandle: "",
    canonical: "",
    themeColor: "",
  },
};

export const SEO_PAGES = Object.keys(DEFAULT_SEO) as Array<keyof typeof DEFAULT_SEO>;

export const SITE_SETTINGS_TAG = "site-settings";

const SEO_SECTION_PREFIX = "seo_";

function seoSection(page: string) {
  return `${SEO_SECTION_PREFIX}${page}`;
}

export const ALLOWED_SETTING_SECTIONS = [
  // Landing CMS sections (existing)
  "catalog_banner",
  "hero",
  "stats",
  "products",
  "about",
  "order",
  "cta",
  "footer",
  "maps",
  "social",
  "jual_bongkaran",
  "testimonials",
  "karir",
  // New: theme + SEO
  "theme",
  "seo_default",
  "seo_home",
  "seo_artikel",
  "seo_karir",
  "seo_kalkulator",
  "seo_jualBongkaran",
  "seo_lacak",
] as const;

async function loadSettingsRaw(): Promise<Record<string, Record<string, string>>> {
  try {
    const rows = await prisma.landingSetting.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });
    return rows.reduce((acc, r) => {
      if (!acc[r.section]) acc[r.section] = {};
      acc[r.section][r.key] = r.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);
  } catch {
    return {};
  }
}

const cachedLoadSettings = unstable_cache(loadSettingsRaw, ["site-settings"], {
  tags: [SITE_SETTINGS_TAG],
  revalidate: 300,
});

/** Server-only: ambil semua setting (cached). Aman dipanggil di RSC. */
export async function getAllSettings() {
  return cachedLoadSettings();
}

/** Ambil theme tokens (merge default + override DB). */
export async function getThemeSettings(): Promise<Record<string, string>> {
  const all = await getAllSettings();
  const stored = all["theme"] || {};
  return { ...DEFAULT_THEME, ...stored };
}

/** Ambil SEO tokens untuk halaman tertentu (merge default + override DB).
 *  Field kosong di DB akan di-fallback ke default yang sesuai (default.* untuk default page,
 *  selain itu tetap kosong agar metadata kebagian fallback dari default page).
 */
export async function getSeoSettings(page: keyof typeof DEFAULT_SEO = "default"): Promise<SeoTokens> {
  const all = await getAllSettings();
  const stored = all[seoSection(page)] || {};
  const baseDefault = DEFAULT_SEO[page] ?? DEFAULT_SEO.default;
  const merged: SeoTokens = { ...baseDefault };
  for (const key of Object.keys(merged) as Array<keyof SeoTokens>) {
    const v = stored[key];
    if (typeof v === "string" && v.trim().length > 0) {
      merged[key] = v;
    }
  }
  return merged;
}

/** Ambil SEO global default (untuk root layout). */
export async function getGlobalSeo(): Promise<SeoTokens> {
  return getSeoSettings("default");
}

/** Build CSS string untuk override theme variables. */
export function buildThemeCss(tokens: Record<string, string>): string {
  const entries = Object.entries(tokens)
    .filter(([k, v]) => DEFAULT_THEME[k] !== undefined && /^#([0-9a-fA-F]{3}){1,2}$/.test(v))
    .map(([k, v]) => `--color-${k}: ${v};`)
    .join(" ");
  return `:root{${entries}}`;
}

/** Util untuk admin route: panggil setelah save agar cache di-invalidate. */
export function invalidateSiteSettingsCache() {
  try {
    revalidateTag(SITE_SETTINGS_TAG, "max");
    revalidatePath("/");
  } catch {
    // best-effort, abaikan kalau di luar konteks request
  }
}

/** Util utk build keyword array dari string CSV. */
export function csvToArray(csv: string): string[] {
  return csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export { seoSection };
