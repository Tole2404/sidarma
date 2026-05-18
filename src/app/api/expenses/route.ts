import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { decimal, roundMoney, toStoredDate } from "@/lib/majun-domain";
import { serializeExpense } from "@/lib/majun-serializers";

export async function GET() {
  try {
    await requireAuth();

    const expenses = await prisma.expense.findMany({
      include: {
        category: { select: { name: true } },
      },
      orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(expenses.map(serializeExpense));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
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

    const expense = await prisma.expense.create({
      data: {
        categoryId,
        expenseDate: toStoredDate(expenseDate),
        amount,
        description,
        createdById: session.user.id,
      },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json(serializeExpense(expense), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
