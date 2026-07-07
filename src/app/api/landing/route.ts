import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
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

    if (!body || !Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    // Validate allowed sections
    for (const s of settings) {
      if (!ALLOWED_SETTING_SECTIONS.includes(s.section as typeof ALLOWED_SETTING_SECTIONS[number])) {
        return NextResponse.json({ error: `Invalid section: ${s.section}` }, { status: 400 });
      }
      
      if (s.section === "products" && s.key === "list") {
        try {
          const parsed = JSON.parse(s.value);
          if (Array.isArray(parsed)) {
            // Sanitize each field inside each product object
            const sanitized = parsed.map((p: any) => {
              const name = String(p.name ?? "").replace(/<[^>]*>/g, "").trim();
              const category = String(p.category ?? "").replace(/<[^>]*>/g, "").trim();
              const desc = String(p.desc ?? "").replace(/<[^>]*>/g, "").trim();
              const image = String(p.image ?? "").trim();
              
              // Validate image URL format
              const safeImage = (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/"))
                ? image
                : "";

              const uses = Array.isArray(p.uses)
                ? p.uses.map((u: any) => String(u ?? "").replace(/<[^>]*>/g, "").trim())
                : [];

              return { name, category, desc, image: safeImage, uses };
            });
            s.value = JSON.stringify(sanitized);
          } else {
            return NextResponse.json({ error: "Format daftar produk harus berupa array" }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ error: "Format JSON tidak valid untuk daftar produk" }, { status: 400 });
        }
      } else if (s.section === "testimonials" && s.key === "list") {
        try {
          const parsed = JSON.parse(s.value);
          if (Array.isArray(parsed)) {
            // Sanitize each field inside each testimonial object
            const sanitized = parsed.map((t: any) => {
              const name = String(t.name ?? "").replace(/<[^>]*>/g, "").trim();
              const company = String(t.company ?? "").replace(/<[^>]*>/g, "").trim();
              const role = String(t.role ?? "").replace(/<[^>]*>/g, "").trim();
              const content = String(t.content ?? "").replace(/<[^>]*>/g, "").trim();
              const rating = Number(t.rating) || 5;
              const avatar = String(t.avatar ?? "").trim();
              
              // Validate avatar URL format
              const safeAvatar = (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/"))
                ? avatar
                : "";

              return { name, company, role, content, rating, avatar: safeAvatar };
            });
            s.value = JSON.stringify(sanitized);
          } else {
            return NextResponse.json({ error: "Format testimoni harus berupa array" }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ error: "Format JSON tidak valid untuk testimoni" }, { status: 400 });
        }
      } else {
        // Sanitize value - strip HTML/script tags untuk konten teks biasa secara rekursif.
        let clean = String(s.value ?? "");
        while (/<[^>]*>/g.test(clean)) {
          clean = clean.replace(/<[^>]*>/g, "");
        }
        s.value = clean.trim();

        // Validasi URL untuk Google Maps Embed & Link
        if (s.section === "maps" && (s.key === "embed_url" || s.key === "maps_link")) {
          if (s.value && !s.value.startsWith("http://") && !s.value.startsWith("https://")) {
            return NextResponse.json(
              { error: `Format URL tidak valid untuk ${s.key}. Harus dimulai dengan http:// atau https://` },
              { status: 400 }
            );
          }
        }

        // Validasi URL untuk Gambar (hero image dll)
        if (s.key === "image" || s.key === "thumbnail" || s.key === "avatar") {
          if (s.value && !s.value.startsWith("http://") && !s.value.startsWith("https://") && !s.value.startsWith("/")) {
            return NextResponse.json(
              { error: `Format URL gambar tidak valid untuk ${s.key}.` },
              { status: 400 }
            );
          }
        }

        // Bersihkan nomor WhatsApp dari karakter berbahaya
        if (s.key === "wa_number") {
          s.value = s.value.replace(/[^0-9+]/g, "");
        }
      }
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
