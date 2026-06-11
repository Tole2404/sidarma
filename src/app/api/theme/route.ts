import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  DEFAULT_THEME,
  invalidateSiteSettingsCache,
  THEME_PRESETS,
} from "@/lib/site-settings";

const HEX_RE = /^#([0-9a-fA-F]{3}){1,2}$/;

export async function GET() {
  try {
    const rows = await prisma.landingSetting.findMany({
      where: { section: "theme" },
      orderBy: { key: "asc" },
    });
    const stored = rows.reduce((acc, r) => {
      acc[r.key] = r.value;
      return acc;
    }, {} as Record<string, string>);
    return NextResponse.json({
      tokens: { ...DEFAULT_THEME, ...stored },
      defaults: DEFAULT_THEME,
      presets: THEME_PRESETS,
    });
  } catch (error) {
    console.error("Error fetching theme:", error);
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json().catch(() => null);
    const tokens = (body?.tokens ?? {}) as Record<string, string>;

    const updates: { key: string; value: string }[] = [];
    for (const [key, value] of Object.entries(tokens)) {
      if (DEFAULT_THEME[key] === undefined) continue;
      if (typeof value !== "string" || !HEX_RE.test(value)) continue;
      updates.push({ key, value: value.toUpperCase() });
    }

    if (!updates.length) {
      return NextResponse.json({ error: "Tidak ada token warna valid" }, { status: 400 });
    }

    await Promise.all(
      updates.map((u) =>
        prisma.landingSetting.upsert({
          where: { section_key: { section: "theme", key: u.key } },
          update: { value: u.value },
          create: { section: "theme", key: u.key, value: u.value },
        }),
      ),
    );

    invalidateSiteSettingsCache();
    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error saving theme:", error);
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await requireAuth();
    await prisma.landingSetting.deleteMany({ where: { section: "theme" } });
    invalidateSiteSettingsCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error resetting theme:", error);
    return NextResponse.json({ error: "Failed to reset theme" }, { status: 500 });
  }
}
