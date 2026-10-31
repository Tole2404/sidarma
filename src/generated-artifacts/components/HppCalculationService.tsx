export interface StockCostItem {
  currentStockKg: number;
  avgCostPerKg: number;
}

export interface IncomingStockItem {
  quantityKg: number;
  costPerKg: number;
}

export interface BaleProcessingInput {
  baleCostTotal: number;
  operationalCost: number;
  yields: {
    grade: string;
    weightKg: number;
    valueAllocationRatio: number; // Proporsi alokasi biaya (0.0 - 1.0)
  }[];
}

export interface YieldCostResult {
  grade: string;
  weightKg: number;
  costPerKg: number;
  totalCost: number;
}

/**
 * Hitung Moving Average HPP setelah barang masuk.
 * Menolak stok negatif atau total kuantitas nol.
 */
export function calculateMovingAverageHpp(
  current: StockCostItem,
  incoming: IncomingStockItem
): number {
  if (incoming.quantityKg <= 0 || incoming.costPerKg < 0) {
    throw new Error("Invalid incoming stock quantity or cost");
  }

  // Jika stok lama minus/nol, HPP ikut harga masuk baru
  const validCurrentStock = Math.max(0, current.currentStockKg);
  const currentTotalVal = validCurrentStock * Math.max(0, current.avgCostPerKg);
  const incomingTotalVal = incoming.quantityKg * incoming.costPerKg;
  const newTotalStock = validCurrentStock + incoming.quantityKg;

  if (newTotalStock === 0) return 0;

  return Math.round((currentTotalVal + incomingTotalVal) / newTotalStock);
}

/**
 * Alokasi HPP hasil bongkaran bal majun berdasarkan rasio bobot & nilai.
 */
export function calculateBaleYieldHpp(
  input: BaleProcessingInput
): YieldCostResult[] {
  const totalProcessingCost = input.baleCostTotal + input.operationalCost;
  const totalRatio = input.yields.reduce((sum, y) => sum + y.valueAllocationRatio, 0);

  if (totalRatio === 0) {
    throw new Error("Total value allocation ratio must be greater than zero");
  }

  return input.yields.map((item) => {
    const allocatedCost = totalProcessingCost * (item.valueAllocationRatio / totalRatio);
    const costPerKg = item.weightKg > 0 ? Math.round(allocatedCost / item.weightKg) : 0;

    return {
      grade: item.grade,
      weightKg: item.weightKg,
      costPerKg,
      totalCost: Math.round(allocatedCost),
    };
  });
}