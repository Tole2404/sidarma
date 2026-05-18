import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeCustomer } from "@/lib/majun-serializers";

export async function GET() {
  try {
    await requireAuth();

    let customers: Awaited<ReturnType<typeof prisma.customer.findMany>>;
    try {
      customers = await prisma.customer.findMany({
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
        orderBy: { storeName: "asc" },
      });
    } catch {
      customers = await prisma.customer.findMany({
        include: {
          sales: {
            select: {
              totalTransactionValue: true,
              outstandingAmount: true,
            },
          },
        },
        orderBy: { storeName: "asc" },
      });
    }

    return NextResponse.json(customers.map(serializeCustomer));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const storeName = String(body.storeName ?? "").trim();
    const preferredBalePriceId = String(body.preferredBalePriceId ?? "").trim() || null;

    if (!storeName) {
      return badRequest("Nama toko wajib diisi.");
    }

    const baseData = {
      storeName,
      ownerName: String(body.ownerName ?? "").trim() || null,
      phone: String(body.phone ?? "").trim() || null,
      address: String(body.address ?? "").trim() || null,
      notes: String(body.notes ?? "").trim() || null,
    };

    let customer: Awaited<ReturnType<typeof prisma.customer.create>>;
    try {
      customer = await prisma.customer.create({
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

      customer = await prisma.customer.create({
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

    return NextResponse.json(serializeCustomer(customer), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
