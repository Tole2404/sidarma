import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculatePurchaseAmounts, recomputeProductLedger, toStoredDate } from "@/lib/majun-domain";
import { serializePurchase } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const supplierId = String(body.supplierId ?? "").trim();
    const productId = String(body.productId ?? "").trim();
    const purchaseDate = String(body.purchaseDate ?? "").trim();

    if (!supplierId || !productId || !purchaseDate) {
      return badRequest("Supplier, produk, dan tanggal pembelian wajib diisi.");
    }

    const existing = await prisma.purchase.findUnique({
      where: { id },
      include: { inventoryMovement: true },
    });

    if (!existing) {
      return notFound("Pembelian tidak ditemukan.");
    }

    const { quantityKg, pricePerKg, transportExpense, subtotal, totalExpense } =
      calculatePurchaseAmounts({
        quantityKg: body.quantityKg,
        pricePerKg: body.pricePerKg,
        transportExpense: body.transportExpense,
      });

    if (quantityKg.lessThanOrEqualTo(0) || pricePerKg.lessThanOrEqualTo(0)) {
      return badRequest("Jumlah kg dan harga per kg harus lebih dari 0.");
    }

    const notes = String(body.notes ?? "").trim() || null;
    const affectedProductIds = [...new Set([existing.productId, productId])];

    const purchase = await prisma.$transaction(async (tx) => {
      await tx.purchase.update({
        where: { id },
        data: {
          supplierId,
          productId,
          purchaseDate: toStoredDate(purchaseDate),
          quantityKg,
          pricePerKg,
          subtotal,
          transportExpense,
          totalExpense,
          notes,
        },
      });

      if (!existing.inventoryMovement) {
        throw new Error("Inventory movement pembelian tidak ditemukan.");
      }

      await tx.inventoryMovement.update({
        where: { purchaseId: id },
        data: {
          productId,
          occurredAt: toStoredDate(purchaseDate),
          quantityKg,
          inboundTotalCost: totalExpense,
          notes,
        },
      });

      for (const affectedProductId of affectedProductIds) {
        await recomputeProductLedger(tx, affectedProductId);
      }

      return tx.purchase.findUniqueOrThrow({
        where: { id },
        include: {
          supplier: { select: { name: true } },
          product: { select: { name: true } },
        },
      });
    });

    return NextResponse.json(serializePurchase(purchase));
  } catch (error) {
    if (error instanceof Error && error.message.includes("stok")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.purchase.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Pembelian tidak ditemukan.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.purchase.delete({ where: { id } });
      await recomputeProductLedger(tx, existing.productId);
    });

    return NextResponse.json({ message: "Pembelian berhasil dihapus." });
  } catch (error) {
    if (error instanceof Error && error.message.includes("stok")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}
