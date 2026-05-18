import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeBalePrice } from "@/lib/majun-serializers";
import { BaleClothType, BaleGrade } from "@prisma/client";

export async function GET() {
  try {
    await requireAuth();

    const balePrices = await prisma.balePrice.findMany({
      orderBy: [{ clothType: "asc" }, { grade: "asc" }],
    });

    return NextResponse.json(balePrices.map(serializeBalePrice));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();

    const clothTypeValue = String(body.clothType ?? "").trim().toUpperCase();
    const gradeValue = String(body.grade ?? "").trim().toUpperCase();
    const pricePerBal = Number(body.pricePerBal);
    const notes = String(body.notes ?? "").trim() || null;

    if (!["PUTIH", "WARNA"].includes(clothTypeValue)) {
      return badRequest("Jenis kain harus PUTIH atau WARNA.");
    }

    if (!["A1", "B2", "C3"].includes(gradeValue)) {
      return badRequest("Grade harus A1, B2, atau C3.");
    }

    if (!Number.isFinite(pricePerBal) || pricePerBal < 0) {
      return badRequest("Harga per kilo harus berupa angka >= 0.");
    }

    const item = await prisma.balePrice.create({
      data: {
        clothType: clothTypeValue as BaleClothType,
        grade: gradeValue as BaleGrade,
        pricePerBal,
        notes,
      },
    });

    return NextResponse.json(serializeBalePrice(item), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
