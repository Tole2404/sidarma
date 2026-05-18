import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/majun-serializers";
import { serverError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    return serverError(error);
  }
}
