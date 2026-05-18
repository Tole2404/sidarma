import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculateSaleAmounts, decimal, recomputeProductLedger, syncSalePaymentStatus, toStoredDate } from "@/lib/majun-domain";
import { decimalToNumber, serializeSale } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const customerId = String(body.customerId ?? "").trim();
    const productId = String(body.productId ?? "").trim();
    const saleDate = String(body.saleDate ?? "").trim();

    if (!customerId || !productId || !saleDate) {
      return badRequest("Customer, produk, dan tanggal penjualan wajib diisi.");
    }

    const existing = await prisma.sale.findUnique({
      where: { id },
      include: {
        inventoryMovement: true,
        salePayments: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!existing) {
      return notFound("Penjualan tidak ditemukan.");
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

    const totalPaid = existing.salePayments.reduce(
      (sum, payment) => sum + decimalToNumber(payment.amount),
      0,
    );

    if (totalPaid > decimalToNumber(totalTransactionValue)) {
      return badRequest("Total pembayaran yang sudah masuk melebihi nilai transaksi baru.");
    }

    const notes = String(body.notes ?? "").trim() || null;
    const affectedProductIds = [...new Set([existing.productId, productId])];

    const sale = await prisma.$transaction(async (tx) => {
      await tx.sale.update({
        where: { id },
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
          outstandingAmount: decimal(totalTransactionValue).minus(decimal(totalPaid)),
          notes,
        },
      });

      if (!existing.inventoryMovement) {
        throw new Error("Inventory movement penjualan tidak ditemukan.");
      }

      await tx.inventoryMovement.update({
        where: { saleId: id },
        data: {
          productId,
          occurredAt: toStoredDate(saleDate),
          quantityKg,
          notes,
        },
      });

      for (const affectedProductId of affectedProductIds) {
        await recomputeProductLedger(tx, affectedProductId);
      }

      await syncSalePaymentStatus(tx, id);

      return tx.sale.findUniqueOrThrow({
        where: { id },
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

    return NextResponse.json(serializeSale(sale));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stok")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.sale.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Penjualan tidak ditemukan.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.sale.delete({ where: { id } });
      await recomputeProductLedger(tx, existing.productId);
    });

    return NextResponse.json({ message: "Penjualan berhasil dihapus." });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stok")) {
      return badRequest(error.message);
    }

    return serverError(error);
  }
}
