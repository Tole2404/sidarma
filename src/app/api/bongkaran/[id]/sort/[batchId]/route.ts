import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { decimal, recomputeProductLedger } from "@/lib/majun-domain";
import { deriveBongkaranStatus, ensureMajunProducts } from "@/lib/bongkaran-domain";

type Params = { params: Promise<{ id: string; batchId: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id, batchId } = await params;

    const sort = await prisma.bongkaranSort.findUnique({ where: { id: batchId } });
    if (!sort || sort.bongkaranId !== id) return notFound("Batch sortir tidak ditemukan.");

    const bongkaran = await prisma.bongkaran.findUnique({ where: { id } });
    if (!bongkaran) return notFound("Bongkaran tidak ditemukan.");

    await prisma.$transaction(async (tx) => {
      const { putih, warna } = await ensureMajunProducts(tx);

      // Tambah inventoryMovement reverse: keluarkan kembali majun putih + warna
      // dengan menambah OUTBOUND sejumlah output yang pernah dimasukkan.
      // Cara cleaner: hapus inventoryMovement INBOUND yang dibuat oleh batch ini.
      // Tapi karena kita tidak punya FK langsung sort↔inventoryMovement,
      // kita pakai pendekatan: catat OUTBOUND counter untuk reverse.
      if (Number(sort.outputPutihKg) > 0) {
        await tx.inventoryMovement.create({
          data: {
            productId: putih.id,
            occurredAt: new Date(),
            movementType: "OUTBOUND",
            quantityKg: sort.outputPutihKg,
            notes: `Reverse batch sortir #${sort.id.slice(0, 8)}`,
          },
        });
      }
      if (Number(sort.outputWarnaKg) > 0) {
        await tx.inventoryMovement.create({
          data: {
            productId: warna.id,
            occurredAt: new Date(),
            movementType: "OUTBOUND",
            quantityKg: sort.outputWarnaKg,
            notes: `Reverse batch sortir #${sort.id.slice(0, 8)}`,
          },
        });
      }

      // Hapus batch sort
      await tx.bongkaranSort.delete({ where: { id: batchId } });

      // Update sortedQuantityKg
      const newSorted = decimal(bongkaran.sortedQuantityKg).minus(sort.inputKg);
      const safeSorted = newSorted.lessThan(0) ? decimal(0) : newSorted;
      const newStatus = deriveBongkaranStatus(
        decimal(bongkaran.quantityKg),
        safeSorted,
        bongkaran.status,
      );
      await tx.bongkaran.update({
        where: { id },
        data: { sortedQuantityKg: safeSorted, status: newStatus },
      });

      await recomputeProductLedger(tx, putih.id);
      await recomputeProductLedger(tx, warna.id);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Stok")) {
      return badRequest(error.message);
    }
    return serverError(error);
  }
}
