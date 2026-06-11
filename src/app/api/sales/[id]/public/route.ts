import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: { select: { storeName: true } },
        product: { select: { name: true } },
      },
    });

    if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: sale.id,
      customerName: sale.customer.storeName,
      productName: sale.product.name,
      quantityKg: Number(sale.quantityKg),
      saleDate: sale.saleDate.toISOString(),
      paymentStatus: sale.paymentStatus,
      notes: sale.notes,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
