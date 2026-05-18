import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

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
    const allowedSections = ["hero", "stats", "about", "order", "cta", "footer", "maps"];
    for (const s of settings) {
      if (!allowedSections.includes(s.section)) {
        return NextResponse.json({ error: `Invalid section: ${s.section}` }, { status: 400 });
      }
      // Sanitize value - strip HTML/script tags
      s.value = s.value.replace(/<[^>]*>/g, "").trim();
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving landing settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}