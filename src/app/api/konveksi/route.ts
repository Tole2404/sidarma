import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeKonveksi } from "@/lib/bongkaran-serializers";

export async function GET() {
  try {
    await requireAuth();
    const konveksis = await prisma.konveksi.findMany({
      include: {
        bongkarans: {
          select: { quantityKg: true, totalCost: true, purchaseDate: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(konveksis.map(serializeKonveksi));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) return badRequest("Nama konveksi wajib diisi.");

    const created = await prisma.konveksi.create({
      data: {
        name,
        picName: String(body.picName ?? "").trim() || null,
        phone: String(body.phone ?? "").trim() || null,
        address: String(body.address ?? "").trim() || null,
        notes: String(body.notes ?? "").trim() || null,
        isActive: body.isActive !== false,
      },
      include: {
        bongkarans: { select: { quantityKg: true, totalCost: true, purchaseDate: true } },
      },
    });

    return NextResponse.json(serializeKonveksi(created), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
