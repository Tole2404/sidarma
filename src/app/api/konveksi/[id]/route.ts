import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeKonveksi } from "@/lib/bongkaran-serializers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const konveksi = await prisma.konveksi.findUnique({
      where: { id },
      include: {
        bongkarans: { select: { quantityKg: true, totalCost: true, purchaseDate: true } },
      },
    });
    if (!konveksi) return notFound("Konveksi tidak ditemukan.");
    return NextResponse.json(serializeKonveksi(konveksi));
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) return badRequest("Nama tidak boleh kosong.");
      data.name = name;
    }
    if ("picName" in body) data.picName = String(body.picName ?? "").trim() || null;
    if ("phone" in body) data.phone = String(body.phone ?? "").trim() || null;
    if ("address" in body) data.address = String(body.address ?? "").trim() || null;
    if ("notes" in body) data.notes = String(body.notes ?? "").trim() || null;
    if ("isActive" in body) data.isActive = Boolean(body.isActive);

    const updated = await prisma.konveksi.update({
      where: { id },
      data,
      include: {
        bongkarans: { select: { quantityKg: true, totalCost: true, purchaseDate: true } },
      },
    });
    return NextResponse.json(serializeKonveksi(updated));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const count = await prisma.bongkaran.count({ where: { konveksiId: id } });
    if (count > 0) {
      return badRequest("Konveksi masih punya transaksi bongkaran. Tidak bisa dihapus.");
    }
    await prisma.konveksi.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
