import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculateBongkaranAmounts } from "@/lib/bongkaran-domain";
import { toStoredDate } from "@/lib/majun-domain";
import { serializeBongkaran } from "@/lib/bongkaran-serializers";
import { BongkaranStatus } from "@prisma/client";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const bongkaran = await prisma.bongkaran.findUnique({
      where: { id },
      include: {
        konveksi: { select: { name: true } },
        sorts: { orderBy: [{ sortDate: "desc" }, { createdAt: "desc" }] },
      },
    });
    if (!bongkaran) return notFound("Transaksi bongkaran tidak ditemukan.");
    return NextResponse.json(serializeBongkaran(bongkaran));
  } catch (error) {
    return serverError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const existing = await prisma.bongkaran.findUnique({
      where: { id },
      select: { status: true, sortedQuantityKg: true },
    });
    if (!existing) return notFound("Transaksi tidak ditemukan.");

    if (existing.status !== BongkaranStatus.PENDING_SORT || Number(existing.sortedQuantityKg) > 0) {
      return badRequest("Bongkaran sudah disortir/cancelled, tidak bisa diedit.");
    }

    const body = await request.json();
    const amounts = calculateBongkaranAmounts({
      quantityKg: body.quantityKg,
      pricePerKg: body.pricePerKg,
      transportExpense: body.transportExpense,
      additionalExpense: body.additionalExpense,
    });

    if (amounts.quantityKg.lessThanOrEqualTo(0) || amounts.pricePerKg.lessThanOrEqualTo(0)) {
      return badRequest("Quantity dan harga per kg harus lebih dari 0.");
    }

    const purchaseDate = String(body.purchaseDate ?? "").trim();
    const data: Record<string, unknown> = {
      konveksiId: String(body.konveksiId ?? ""),
      quantityKg: amounts.quantityKg,
      pricePerKg: amounts.pricePerKg,
      subtotal: amounts.subtotal,
      transportExpense: amounts.transportExpense,
      additionalExpense: amounts.additionalExpense,
      totalCost: amounts.totalCost,
      costPerKgEffective: amounts.costPerKgEffective,
      notes: String(body.notes ?? "").trim() || null,
    };
    if (purchaseDate) data.purchaseDate = toStoredDate(purchaseDate);

    const updated = await prisma.bongkaran.update({
      where: { id },
      data,
      include: {
        konveksi: { select: { name: true } },
        sorts: { orderBy: [{ sortDate: "desc" }, { createdAt: "desc" }] },
      },
    });
    return NextResponse.json(serializeBongkaran(updated));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const existing = await prisma.bongkaran.findUnique({
      where: { id },
      select: { status: true, sortedQuantityKg: true },
    });
    if (!existing) return notFound("Transaksi tidak ditemukan.");
    if (Number(existing.sortedQuantityKg) > 0) {
      return badRequest("Bongkaran sudah pernah disortir, tidak bisa dihapus. Hapus batch sortirnya dulu.");
    }
    await prisma.bongkaran.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error);
  }
}
