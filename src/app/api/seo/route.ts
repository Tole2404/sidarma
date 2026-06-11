import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  DEFAULT_SEO,
  invalidateSiteSettingsCache,
  SEO_PAGES,
  seoSection,
} from "@/lib/site-settings";

const ALLOWED_KEYS = new Set<keyof (typeof DEFAULT_SEO)["default"]>([
  "title",
  "titleTemplate",
  "description",
  "keywords",
  "ogImage",
  "ogTitle",
  "ogDescription",
  "twitterHandle",
  "canonical",
  "themeColor",
]);

export async function GET() {
  try {
    const rows = await prisma.landingSetting.findMany({
      where: { section: { startsWith: "seo_" } },
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });

    const grouped: Record<string, Record<string, string>> = {};
    for (const r of rows) {
      const page = r.section.replace(/^seo_/, "");
      if (!grouped[page]) grouped[page] = {};
      grouped[page][r.key] = r.value;
    }

    return NextResponse.json({
      pages: SEO_PAGES,
      defaults: DEFAULT_SEO,
      stored: grouped,
    });
  } catch (error) {
    console.error("Error fetching SEO:", error);
    return NextResponse.json({ error: "Failed to fetch SEO" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => null);
    const page = String(body?.page ?? "");
    const data = (body?.data ?? {}) as Record<string, string>;

    if (!SEO_PAGES.includes(page as (typeof SEO_PAGES)[number])) {
      return NextResponse.json({ error: "Invalid page" }, { status: 400 });
    }

    const section = seoSection(page);
    const updates: { key: string; value: string }[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (!ALLOWED_KEYS.has(key as keyof (typeof DEFAULT_SEO)["default"])) continue;
      const safe = String(value ?? "").replace(/<[^>]*>/g, "").trim();
      updates.push({ key, value: safe });
    }

    await Promise.all(
      updates.map((u) =>
        prisma.landingSetting.upsert({
          where: { section_key: { section, key: u.key } },
          update: { value: u.value },
          create: { section, key: u.key, value: u.value },
        }),
      ),
    );

    invalidateSiteSettingsCache();
    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error saving SEO:", error);
    return NextResponse.json({ error: "Failed to save SEO" }, { status: 500 });
  }
}
