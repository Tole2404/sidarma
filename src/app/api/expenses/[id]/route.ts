import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { decimal, roundMoney, toStoredDate } from "@/lib/majun-domain";
import { serializeExpense } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const categoryId = String(body.categoryId ?? "").trim();
    const expenseDate = String(body.expenseDate ?? "").trim();
    const description = String(body.description ?? "").trim();
    const amount = roundMoney(decimal(body.amount ?? 0));

    if (!categoryId || !expenseDate || !description) {
      return badRequest("Kategori, tanggal, dan deskripsi wajib diisi.");
    }

    if (amount.lessThanOrEqualTo(0)) {
      return badRequest("Jumlah pengeluaran harus lebih dari 0.");
    }

    const existing = await prisma.expense.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Pengeluaran tidak ditemukan.");
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        categoryId,
        expenseDate: toStoredDate(expenseDate),
        amount,
        description,
      },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json(serializeExpense(expense));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.expense.findUnique({ where: { id } });

    if (!existing) {
      return notFound("Pengeluaran tidak ditemukan.");
    }

    await prisma.expense.delete({ where: { id } });

    return NextResponse.json({ message: "Pengeluaran berhasil dihapus." });
  } catch (error) {
    return serverError(error);
  }
}
