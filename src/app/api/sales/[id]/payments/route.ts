import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { decimal, syncSalePaymentStatus, toStoredDate } from "@/lib/majun-domain";
import { decimalToNumber, serializeSale, serializeSalePayment } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
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

    if (!sale) {
      return notFound("Penjualan tidak ditemukan.");
    }

    return NextResponse.json(sale.salePayments.map(serializeSalePayment));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const paymentDate = String(body.paymentDate ?? "").trim();
    const amount = decimal(body.amount ?? 0);

    if (!paymentDate) {
      return badRequest("Tanggal pembayaran wajib diisi.");
    }

    if (amount.lessThanOrEqualTo(0)) {
      return badRequest("Jumlah pembayaran harus lebih dari 0.");
    }

    const existing = await prisma.sale.findUnique({
      where: { id },
      select: {
        id: true,
        outstandingAmount: true,
      },
    });

    if (!existing) {
      return notFound("Penjualan tidak ditemukan.");
    }

    if (amount.greaterThan(decimal(existing.outstandingAmount))) {
      return badRequest("Jumlah pembayaran melebihi sisa tagihan.");
    }

    const sale = await prisma.$transaction(async (tx) => {
      await tx.salePayment.create({
        data: {
          saleId: id,
          paymentDate: toStoredDate(paymentDate),
          amount,
          notes: String(body.notes ?? "").trim() || null,
          createdById: session.user.id,
        },
      });

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

    return NextResponse.json(serializeSale(sale), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
