import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeExpenseCategory } from "@/lib/majun-serializers";
import { serverError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();

    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories.map(serializeExpenseCategory));
  } catch (error) {
    return serverError(error);
  }
}
