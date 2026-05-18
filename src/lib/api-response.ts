import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function notFound(message: string) {
  return NextResponse.json({ message }, { status: 404 });
}

export function serverError(error: unknown, fallbackMessage = "Internal server error") {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Ada data dengan nilai unik yang sama. Silakan gunakan nilai lain." },
        { status: 400 },
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { message: "Data ini masih dipakai transaksi lain dan tidak bisa dihapus." },
        { status: 400 },
      );
    }

    if (error.code === "P2021") {
      return NextResponse.json(
        { message: "Tabel database belum tersedia. Jalankan migrasi Prisma terbaru." },
        { status: 500 },
      );
    }

    if (error.code === "P2022") {
      return NextResponse.json(
        { message: "Struktur kolom database belum sinkron. Jalankan migrasi Prisma terbaru." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
