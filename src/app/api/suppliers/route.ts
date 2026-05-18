import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeSupplier } from "@/lib/majun-serializers";

export async function GET() {
  try {
    await requireAuth();

    const suppliers = await prisma.supplier.findMany({
      include: {
        purchases: {
          select: {
            totalExpense: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(suppliers.map(serializeSupplier));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const name = String(body.name ?? "").trim();

    if (!name) {
      return badRequest("Nama supplier wajib diisi.");
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        phone: String(body.phone ?? "").trim() || null,
        address: String(body.address ?? "").trim() || null,
        notes: String(body.notes ?? "").trim() || null,
      },
      include: {
        purchases: {
          select: {
            totalExpense: true,
          },
        },
      },
    });

    return NextResponse.json(serializeSupplier(supplier), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
