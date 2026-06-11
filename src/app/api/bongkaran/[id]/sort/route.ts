import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { badRequest, notFound, serverError } from "@/lib/api-response";
import { prisma } from "@/lib/db";
import { BongkaranStatus, Prisma } from "@prisma/client";
import { toStoredDate, decimal, recomputeProductLedger } from "@/lib/majun-domain";
import {
  calculateSortAllocation,
  deriveBongkaranStatus,
  ensureMajunProducts,
} from "@/lib/bongkaran-domain";
import { serializeBongkaranSort } from "@/lib/bongkaran-serializers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAuth();
    const { id } = await params;
    const sorts = await prisma.bongkaranSort.findMany({
      where: { bongkaranId: id },
      orderBy: [{ sortDate: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(sorts.map(serializeBongkaranSort));
  } catch (error) {
    return serverError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const sortDate = String(body.sortDate ?? "").trim();
    if (!sortDate) return badRequest("Tanggal sortir wajib diisi.");

    const bongkaran = await prisma.bongkaran.findUnique({ where: { id } });
    if (!bongkaran) return notFound("Bongkaran tidak ditemukan.");
    if (bongkaran.status === BongkaranStatus.CANCELLED) {
      return badRequest("Bongkaran sudah dibatalkan.");
    }

    const remainingKg = decimal(bongkaran.quantityKg).minus(bongkaran.sortedQuantityKg);
    const allocation = calculateSortAllocation({
      inputKg: body.inputKg,
      outputPutihKg: body.outputPutihKg,
      outputWarnaKg: body.outputWarnaKg,
      laborExpense: body.laborExpense,
      costPerKgEffective: bongkaran.costPerKgEffective,
    });

    if (allocation.inputKg.lessThanOrEqualTo(0)) {
      return badRequest("Input kg harus lebih dari 0.");
    }
    if (allocation.inputKg.greaterThan(remainingKg)) {
      return badRequest(`Input kg melebihi sisa bongkaran (${remainingKg.toFixed(2)} kg).`);
    }
    if (allocation.outputPutihKg.plus(allocation.outputWarnaKg).greaterThan(allocation.inputKg)) {
      return badRequest("Total output putih + warna tidak boleh melebihi input.");
    }
    if (allocation.outputPutihKg.plus(allocation.outputWarnaKg).lessThanOrEqualTo(0)) {
      return badRequest("Output putih atau warna harus diisi (tidak boleh semua jadi waste).");
    }

    const result = await prisma.$transaction(async (tx) => {
      const { putih, warna } = await ensureMajunProducts(tx);

      const sort = await tx.bongkaranSort.create({
        data: {
          bongkaranId: id,
          sortDate: toStoredDate(sortDate),
          inputKg: allocation.inputKg,
          outputPutihKg: allocation.outputPutihKg,
          outputWarnaKg: allocation.outputWarnaKg,
          wasteKg: allocation.wasteKg,
          laborExpense: allocation.laborExpense,
          totalCost: allocation.totalCost,
          unitCostPutih: allocation.unitCostPutih,
          unitCostWarna: allocation.unitCostWarna,
          notes: String(body.notes ?? "").trim() || null,
          createdById: session.user.id,
        },
      });

      // Inventory movements: tambah majun putih + warna sebagai INBOUND.
      // Cost basis = totalCost dialokasikan proporsional.
      const totalOutputKg = allocation.outputPutihKg.plus(allocation.outputWarnaKg);
      if (allocation.outputPutihKg.greaterThan(0)) {
        const costPutih = allocation.unitCostPutih.times(allocation.outputPutihKg).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
        await tx.inventoryMovement.create({
          data: {
            productId: putih.id,
            occurredAt: toStoredDate(sortDate),
            movementType: "INBOUND",
            quantityKg: allocation.outputPutihKg,
            inboundTotalCost: costPutih,
            notes: `Hasil sortir bongkaran #${sort.id.slice(0, 8)}`,
          },
        });
      }
      if (allocation.outputWarnaKg.greaterThan(0)) {
        const costWarna = allocation.totalCost.minus(
          allocation.unitCostPutih.times(allocation.outputPutihKg),
        ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
        // fallback bila total output kg = 0 (sudah dicegah di atas tapi defensif)
        const finalCostWarna = totalOutputKg.greaterThan(0)
          ? costWarna
          : decimal(0);
        await tx.inventoryMovement.create({
          data: {
            productId: warna.id,
            occurredAt: toStoredDate(sortDate),
            movementType: "INBOUND",
            quantityKg: allocation.outputWarnaKg,
            inboundTotalCost: finalCostWarna,
            notes: `Hasil sortir bongkaran #${sort.id.slice(0, 8)}`,
          },
        });
      }

      // Update bongkaran progress + status
      const newSorted = decimal(bongkaran.sortedQuantityKg).plus(allocation.inputKg);
      const newStatus = deriveBongkaranStatus(
        decimal(bongkaran.quantityKg),
        newSorted,
        bongkaran.status,
      );
      await tx.bongkaran.update({
        where: { id },
        data: { sortedQuantityKg: newSorted, status: newStatus },
      });

      // Recompute ledger untuk Putih & Warna
      await recomputeProductLedger(tx, putih.id);
      await recomputeProductLedger(tx, warna.id);

      return sort;
    });

    return NextResponse.json(serializeBongkaranSort(result), { status: 201 });
  } catch (error) {
    return serverError(error);
  }
}
