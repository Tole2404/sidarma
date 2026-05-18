import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { serializeStockMovement, serializeStockProduct } from "@/lib/majun-serializers";
import { serverError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();

    const [products, recentMovements] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.inventoryMovement.findMany({
        include: {
          product: { select: { name: true } },
          purchase: { select: { supplier: { select: { name: true } } } },
          sale: { select: { customer: { select: { storeName: true } } } },
        },
        orderBy: [{ occurredAt: "desc" }, { createdAt: "desc" }],
        take: 20,
      }),
    ]);

    return NextResponse.json({
      products: products.map(serializeStockProduct),
      recentMovements: recentMovements.map(serializeStockMovement),
    });
  } catch (error) {
    return serverError(error);
  }
}
