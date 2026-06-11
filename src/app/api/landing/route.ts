import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import {
  ALLOWED_SETTING_SECTIONS,
  invalidateSiteSettingsCache,
} from "@/lib/site-settings";

export async function GET() {
  try {
    const settings = await prisma.landingSetting.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });

    // Group by section
    const grouped = settings.reduce((acc, s) => {
      if (!acc[s.section]) acc[s.section] = {};
      acc[s.section][s.key] = s.value;
      return acc;
    }, {} as Record<string, Record<string, string>>);

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching landing settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Require authentication for writing
    await requireAuth();

    const body = await req.json();
    const { settings } = body as {
      settings: { section: string; key: string; value: string }[];
    };

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    // Validate allowed sections
    for (const s of settings) {
      if (!ALLOWED_SETTING_SECTIONS.includes(s.section as typeof ALLOWED_SETTING_SECTIONS[number])) {
        return NextResponse.json({ error: `Invalid section: ${s.section}` }, { status: 400 });
      }
      // Sanitize value - strip HTML/script tags untuk konten teks biasa.
      // Untuk theme/seo, value adalah hex/string sederhana, jadi tetap aman.
      s.value = String(s.value ?? "").replace(/<[^>]*>/g, "").trim();
    }

    // Use upsert for each setting
    await Promise.all(
      settings.map((s) =>
        prisma.landingSetting.upsert({
          where: {
            section_key: {
              section: s.section,
              key: s.key,
            },
          },
          update: { value: s.value },
          create: {
            section: s.section,
            key: s.key,
            value: s.value,
          },
        })
      )
    );

    invalidateSiteSettingsCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Error saving landing settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
