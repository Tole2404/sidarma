// baleSorting.ts
export interface BaleSortingInput {
  baleWeightKg: number;
  whiteKg: number;
  colorKg: number;
  wasteKg: number;
}

export interface BaleSortingResult {
  whitePct: number;
  colorPct: number;
  wastePct: number;
  isWasteAnomaly: boolean;
}

export function calculateBaleYield(input: BaleSortingInput): BaleSortingResult {
  const { baleWeightKg, whiteKg, colorKg, wasteKg } = input;

  if (baleWeightKg <= 0) throw new Error("Bale weight must be positive");
  if (whiteKg < 0 || colorKg < 0 || wasteKg < 0) throw new Error("Weights cannot be negative");

  const sumOutputs = Number((whiteKg + colorKg + wasteKg).toFixed(4));
  if (Math.abs(sumOutputs - baleWeightKg) > 0.001) {
    throw new Error("Output sum does not match bale weight");
  }

  const wastePct = Number(((wasteKg / baleWeightKg) * 100).toFixed(2));
  const whitePct = Number(((whiteKg / baleWeightKg) * 100).toFixed(2));
  const colorPct = Number(((colorKg / baleWeightKg) * 100).toFixed(2));

  return {
    whitePct,
    colorPct,
    wastePct,
    isWasteAnomaly: wastePct > 20.0
  };
}