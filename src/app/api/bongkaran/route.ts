import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { calculateBongkaranAmounts } from "@/lib/bongkaran-domain";
import { toStoredDate } from "@/lib/majun-domain";
import { serializeBongkaran } from "@/lib/bongkaran-serializers";

export async function GET() {
  try {
    await requireAuth();
    const bongkarans = await prisma.bongkaran.findMany({
      include: {
        konveksi: { select: { name: true } },
      },
      orderBy: [{ purchaseDate: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(bongkarans.map(serializeBongkaran));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const konveksiId = String(body.konveksiId ?? "").trim();
    const purchaseDate = String(body.purchaseDate ?? "").trim();

    if (!konveksiId || !purchaseDate) {
      return badRequest("Konveksi dan tanggal wajib diisi.");
    }

    const amounts = calculateBongkaranAmounts({
      quantityKg: body.quantityKg,
      pricePerKg: body.pricePerKg,
      transportExpense: body.transportExpense,
      additionalExpense: body.additionalExpense,
    });

    if (amounts.quantityKg.lessThanOrEqualTo(0) || amounts.pricePerKg.lessThanOrEqualTo(0)) {
      return badRequest("Quantity dan harga per kg harus lebih dari 0.");
    }

    const created = await prisma.bongkaran.create({
      data: {
        konveksiId,
        purchaseDate: toStoredDate(purchaseDate),
        quantityKg: amounts.quantityKg,
        pricePerKg: amounts.pricePerKg,
        subtotal: amounts.subtotal,
        transportExpense: amounts.transportExpense,
        additionalExpense: amounts.additionalExpense,
        totalCost: amounts.totalCost,
        costPerKgEffective: amounts.costPerKgEffective,
        notes: String(body.notes ?? "").trim() || null,
        createdById: session.user.id,
      },
      include: { konveksi: { select: { name: true } } },
    });

    return NextResponse.json(serializeBongkaran(created), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
