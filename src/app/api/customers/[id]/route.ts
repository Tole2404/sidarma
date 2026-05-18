import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeCustomer } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const storeName = String(body.storeName ?? "").trim();
    const preferredBalePriceId = String(body.preferredBalePriceId ?? "").trim() || null;

    if (!storeName) {
      return badRequest("Nama toko wajib diisi.");
    }

    const existing = await prisma.customer.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Customer tidak ditemukan.");
    }

    const baseData = {
      storeName,
      ownerName: String(body.ownerName ?? "").trim() || null,
      phone: String(body.phone ?? "").trim() || null,
      address: String(body.address ?? "").trim() || null,
      notes: String(body.notes ?? "").trim() || null,
    };

    let customer: Awaited<ReturnType<typeof prisma.customer.update>>;
    try {
      customer = await prisma.customer.update({
        where: { id },
        data: {
          ...baseData,
          preferredBalePriceId,
        },
        include: {
          preferredBalePrice: {
            select: {
              clothType: true,
              grade: true,
              pricePerBal: true,
            },
          },
          sales: {
            select: {
              totalTransactionValue: true,
              outstandingAmount: true,
            },
          },
        },
      });
    } catch (error) {
      if (preferredBalePriceId) {
        return serverError(error, "Tag harga bal belum bisa disimpan. Jalankan migrasi Prisma terbaru untuk customer.");
      }

      customer = await prisma.customer.update({
        where: { id },
        data: baseData,
        include: {
          sales: {
            select: {
              totalTransactionValue: true,
              outstandingAmount: true,
            },
          },
        },
      });
    }

    return NextResponse.json(serializeCustomer(customer));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.customer.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Customer tidak ditemukan.");
    }

    await prisma.customer.delete({ where: { id } });

    return NextResponse.json({ message: "Customer berhasil dihapus." });
  } catch (error) {
    return serverError(error);
  }
}
