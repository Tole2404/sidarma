import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeSupplier } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name ?? "").trim();

    if (!name) {
      return badRequest("Nama supplier wajib diisi.");
    }

    const existing = await prisma.supplier.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Supplier tidak ditemukan.");
    }

    const supplier = await prisma.supplier.update({
      where: { id },
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

    return NextResponse.json(serializeSupplier(supplier));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.supplier.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Supplier tidak ditemukan.");
    }

    await prisma.supplier.delete({ where: { id } });

    return NextResponse.json({ message: "Supplier berhasil dihapus." });
  } catch (error) {
    return serverError(error);
  }
}
