import { Prisma, type PrismaClient, BongkaranStatus } from "@prisma/client";
import { decimal, roundMoney, roundQuantity, recomputeProductLedger } from "@/lib/majun-domain";

type DbClient = Prisma.TransactionClient | PrismaClient;

export const ZERO = decimal(0);

/** Hitung amount-amount untuk transaksi bongkaran. */
export function calculateBongkaranAmounts(input: {
  quantityKg: Prisma.Decimal.Value;
  pricePerKg: Prisma.Decimal.Value;
  transportExpense?: Prisma.Decimal.Value;
  additionalExpense?: Prisma.Decimal.Value;
}) {
  const quantityKg = roundQuantity(decimal(input.quantityKg));
  const pricePerKg = roundMoney(decimal(input.pricePerKg));
  const transportExpense = roundMoney(decimal(input.transportExpense ?? 0));
  const additionalExpense = roundMoney(decimal(input.additionalExpense ?? 0));
  const subtotal = roundMoney(quantityKg.times(pricePerKg));
  const totalCost = roundMoney(subtotal.plus(transportExpense).plus(additionalExpense));
  const costPerKgEffective = quantityKg.lessThanOrEqualTo(0)
    ? ZERO
    : totalCost.div(quantityKg).toDecimalPlaces(4, Prisma.Decimal.ROUND_HALF_UP);

  return {
    quantityKg,
    pricePerKg,
    transportExpense,
    additionalExpense,
    subtotal,
    totalCost,
    costPerKgEffective,
  };
}

/** Hitung alokasi HPP per batch sortir. */
export function calculateSortAllocation(input: {
  inputKg: Prisma.Decimal.Value;
  outputPutihKg: Prisma.Decimal.Value;
  outputWarnaKg: Prisma.Decimal.Value;
  laborExpense?: Prisma.Decimal.Value;
  costPerKgEffective: Prisma.Decimal.Value;
}) {
  const inputKg = roundQuantity(decimal(input.inputKg));
  const outputPutihKg = roundQuantity(decimal(input.outputPutihKg));
  const outputWarnaKg = roundQuantity(decimal(input.outputWarnaKg));
  const laborExpense = roundMoney(decimal(input.laborExpense ?? 0));
  const costPerKgEffective = decimal(input.costPerKgEffective);

  const wasteKg = roundQuantity(inputKg.minus(outputPutihKg).minus(outputWarnaKg));
  const totalOutputKg = outputPutihKg.plus(outputWarnaKg);

  const inputCost = roundMoney(inputKg.times(costPerKgEffective).plus(laborExpense));

  let unitCostPutih = ZERO;
  let unitCostWarna = ZERO;

  if (totalOutputKg.greaterThan(0)) {
    const costPutih = roundMoney(inputCost.times(outputPutihKg).div(totalOutputKg));
    const costWarna = roundMoney(inputCost.minus(costPutih)); // sisanya, hindari floating
    if (outputPutihKg.greaterThan(0)) {
      unitCostPutih = costPutih.div(outputPutihKg).toDecimalPlaces(4, Prisma.Decimal.ROUND_HALF_UP);
    }
    if (outputWarnaKg.greaterThan(0)) {
      unitCostWarna = costWarna.div(outputWarnaKg).toDecimalPlaces(4, Prisma.Decimal.ROUND_HALF_UP);
    }
  }

  return {
    inputKg,
    outputPutihKg,
    outputWarnaKg,
    wasteKg,
    laborExpense,
    totalCost: inputCost,
    unitCostPutih,
    unitCostWarna,
  };
}

/** Pastikan ada produk system Majun Putih & Majun Warna. */
export async function ensureMajunProducts(tx: DbClient) {
  const putih = await tx.product.upsert({
    where: { code: "MAJUN_PUTIH" },
    update: {},
    create: { code: "MAJUN_PUTIH", name: "Majun Putih" },
  });
  const warna = await tx.product.upsert({
    where: { code: "MAJUN_WARNA" },
    update: {},
    create: { code: "MAJUN_WARNA", name: "Majun Warna" },
  });
  return { putih, warna };
}

/** Update status bongkaran berdasarkan progress sortedQuantityKg. */
export function deriveBongkaranStatus(
  quantityKg: Prisma.Decimal,
  sortedQuantityKg: Prisma.Decimal,
  current: BongkaranStatus,
): BongkaranStatus {
  if (current === BongkaranStatus.CANCELLED) return current;
  if (sortedQuantityKg.lessThanOrEqualTo(0)) return BongkaranStatus.PENDING_SORT;
  if (sortedQuantityKg.greaterThanOrEqualTo(quantityKg)) return BongkaranStatus.SORTED;
  return BongkaranStatus.IN_PROGRESS;
}

/** Recompute ledger Majun Putih & Warna setelah perubahan inventory dari sortir. */
export async function recomputeMajunLedger(tx: DbClient) {
  const products = await tx.product.findMany({
    where: { code: { in: ["MAJUN_PUTIH", "MAJUN_WARNA"] } },
    select: { id: true },
  });
  for (const p of products) {
    await recomputeProductLedger(tx, p.id);
  }
}
