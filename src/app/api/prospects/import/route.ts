import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prospects } = body;

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      return NextResponse.json(
        { success: false, error: "Daftar prospek yang akan diimpor tidak boleh kosong." },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of prospects) {
      const storeName = (item.storeName || "").trim();
      if (!storeName) continue;

      const ownerName = item.ownerName ? String(item.ownerName).trim() : null;
      const phone = item.phone ? String(item.phone).trim() : null;
      const address = item.address ? String(item.address).trim() : null;
      const notes = item.notes || `Prospek ${item.categoryLabel || "B2B"} - Estimasi: ${item.estimatedConsumptionKg || "50-200 kg"}. Rekomendasi: ${item.recommendedMajun || "Majun Katun"}`;

      // Check if customer with this exact storeName already exists
      const existing = await prisma.customer.findUnique({
        where: { storeName },
      });

      if (existing) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: {
            ownerName: existing.ownerName || ownerName,
            phone: existing.phone || phone,
            address: existing.address || address,
            notes: existing.notes ? `${existing.notes} | ${notes}` : notes,
          },
        });
        updatedCount++;
      } else {
        await prisma.customer.create({
          data: {
            storeName,
            ownerName,
            phone,
            address,
            notes,
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil memproses ${createdCount + updatedCount} prospek (${createdCount} customer baru, ${updatedCount} diperbarui).`,
      createdCount,
      updatedCount,
      totalProcessed: createdCount + updatedCount,
    });
  } catch (error: any) {
    console.error("Error in /api/prospects/import:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal mengimpor data prospek ke customer." },
      { status: 500 }
    );
  }
}
