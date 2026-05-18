import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculateSaleAmounts, decimal, recomputeProductLedger, toStoredDate } from "@/lib/majun-domain";
import { serializeSale } from "@/lib/majun-serializers";

export async function GET() {
  try {
    await requireAuth();

    const sales = await prisma.sale.findMany({
      include: {
        customer: { select: { storeName: true } },
        product: { select: { name: true } },
        salePayments: {
          orderBy: [{ paymentDate: "desc" }, { createdAt: "desc" }],
          select: {
            id: true,
            paymentDate: true,
            amount: true,
            notes: true,
          },
        },
      },
      orderBy: [{ saleDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(sales.map(serializeSale));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const customerId = String(body.customerId ?? "").trim();
    const productId = String(body.productId ?? "").trim();
    const saleDate = String(body.saleDate ?? "").trim();

    if (!customerId || !productId || !saleDate) {
      return badRequest("Customer, produk, dan tanggal penjualan wajib diisi.");
    }

    const { quantityKg, sellingPricePerKg, deliveryExpense, additionalExpense, subtotal, totalTransactionValue } =
      calculateSaleAmounts({
        quantityKg: body.quantityKg,
        sellingPricePerKg: body.sellingPricePerKg,
        deliveryExpense: body.deliveryExpense,
        additionalExpense: body.additionalExpense,
      });

    if (quantityKg.lessThanOrEqualTo(0) || sellingPricePerKg.lessThanOrEqualTo(0)) {
      return badRequest("Jumlah kg dan harga jual per kg harus lebih dari 0.");
    }

    const notes = String(body.notes ?? "").trim() || null;

    const sale = await prisma.$transaction(async (tx) => {
      const created = await tx.sale.create({
        data: {
          customerId,
          productId,
          saleDate: toStoredDate(saleDate),
          quantityKg,
          sellingPricePerKg,
          subtotal,
          deliveryExpense,
          additionalExpense,
          totalTransactionValue,
          amountPaid: decimal(0),
          outstandingAmount: totalTransactionValue,
          notes,
          createdById: session.user.id,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          saleId: created.id,
          occurredAt: toStoredDate(saleDate),
          movementType: "OUTBOUND",
          quantityKg,
          notes,
        },
      });

      await recomputeProductLedger(tx, productId);

      return tx.sale.findUniqueOrThrow({
        where: { id: created.id },
        include: {
          customer: { select: { storeName: true } },
          product: { select: { name: true } },
          salePayments: {
            orderBy: [{ paymentDate: "desc" }, { createdAt: "desc" }],
            select: {
              id: true,
              paymentDate: true,
              amount: true,
              notes: true,
            },
          },
        },
      });
    });

    return NextResponse.json(serializeSale(sale), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stok")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}
