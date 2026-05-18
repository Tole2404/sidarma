import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculatePurchaseAmounts, recomputeProductLedger, toStoredDate } from "@/lib/majun-domain";
import { serializePurchase } from "@/lib/majun-serializers";

export async function GET() {
  try {
    await requireAuth();

    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: [{ purchaseDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(purchases.map(serializePurchase));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const supplierId = String(body.supplierId ?? "").trim();
    const productId = String(body.productId ?? "").trim();
    const purchaseDate = String(body.purchaseDate ?? "").trim();

    if (!supplierId || !productId || !purchaseDate) {
      return badRequest("Supplier, produk, dan tanggal pembelian wajib diisi.");
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

    const purchase = await prisma.$transaction(async (tx) => {
      const created = await tx.purchase.create({
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
          createdById: session.user.id,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          purchaseId: created.id,
          occurredAt: toStoredDate(purchaseDate),
          movementType: "INBOUND",
          quantityKg,
          inboundTotalCost: totalExpense,
          notes,
        },
      });

      await recomputeProductLedger(tx, productId);

      return tx.purchase.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          supplier: { select: { name: true } },
          product: { select: { name: true } },
        },
      });
    });

    return NextResponse.json(serializePurchase(purchase), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
