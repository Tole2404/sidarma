import { NextResponse } from "next/server";
import { BaleClothType, BaleGrade } from "@prisma/client";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { serializeBalePrice } from "@/lib/majun-serializers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;
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

    const existing = await prisma.balePrice.findUnique({ where: { id } });
    if (!existing) {
      return notFound("Data harga bal tidak ditemukan.");
    }

    const item = await prisma.balePrice.update({
      where: { id },
      data: {
        clothType: clothTypeValue as BaleClothType,
        grade: gradeValue as BaleGrade,
        pricePerBal,
        notes,
      },
    });

    return NextResponse.json(serializeBalePrice(item));
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const existing = await prisma.balePrice.findUnique({ where: { id } });
    if (!existing) {
      return notFound("Data harga bal tidak ditemukan.");
    }

    await prisma.balePrice.delete({ where: { id } });
    return NextResponse.json({ message: "Data harga bal berhasil dihapus." });
  } catch (error) {
    return serverError(error);
  }
}
