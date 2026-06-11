import { Prisma } from "@prisma/client";
import { decimalToNumber } from "@/lib/majun-serializers";

export interface KonveksiRecord {
  id: string;
  name: string;
  picName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bongkaranCount: number;
  totalQuantityKg: number;
  totalSpending: number;
  lastTransactionAt: string | null;
}

export type BongkaranStatusValue = "PENDING_SORT" | "IN_PROGRESS" | "SORTED" | "CANCELLED";

export interface BongkaranSortRecord {
  id: string;
  bongkaranId: string;
  sortDate: string;
  inputKg: number;
  outputPutihKg: number;
  outputWarnaKg: number;
  wasteKg: number;
  laborExpense: number;
  totalCost: number;
  unitCostPutih: number;
  unitCostWarna: number;
  yieldPercent: number;
  notes: string | null;
  createdAt: string;
}

export interface BongkaranRecord {
  id: string;
  konveksiId: string;
  konveksiName: string;
  purchaseDate: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
  transportExpense: number;
  additionalExpense: number;
  totalCost: number;
  costPerKgEffective: number;
  sortedQuantityKg: number;
  remainingKg: number;
  status: BongkaranStatusValue;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  sorts?: BongkaranSortRecord[];
}

export function serializeKonveksi(k: {
  id: string;
  name: string;
  picName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  bongkarans?: { quantityKg: Prisma.Decimal; totalCost: Prisma.Decimal; purchaseDate: Date }[];
}): KonveksiRecord {
  const bongkarans = k.bongkarans ?? [];
  const totalQuantityKg = bongkarans.reduce((s, b) => s + decimalToNumber(b.quantityKg), 0);
  const totalSpending = bongkarans.reduce((s, b) => s + decimalToNumber(b.totalCost), 0);
  const lastTransactionAt = bongkarans.length
    ? new Date(Math.max(...bongkarans.map((b) => b.purchaseDate.getTime()))).toISOString()
    : null;

  return {
    id: k.id,
    name: k.name,
    picName: k.picName,
    phone: k.phone,
    address: k.address,
    notes: k.notes,
    isActive: k.isActive,
    createdAt: k.createdAt.toISOString(),
    updatedAt: k.updatedAt.toISOString(),
    bongkaranCount: bongkarans.length,
    totalQuantityKg: Number(totalQuantityKg.toFixed(2)),
    totalSpending: Number(totalSpending.toFixed(2)),
    lastTransactionAt,
  };
}

export function serializeBongkaranSort(s: {
  id: string;
  bongkaranId: string;
  sortDate: Date;
  inputKg: Prisma.Decimal;
  outputPutihKg: Prisma.Decimal;
  outputWarnaKg: Prisma.Decimal;
  wasteKg: Prisma.Decimal;
  laborExpense: Prisma.Decimal;
  totalCost: Prisma.Decimal;
  unitCostPutih: Prisma.Decimal;
  unitCostWarna: Prisma.Decimal;
  notes: string | null;
  createdAt: Date;
}): BongkaranSortRecord {
  const inputKg = decimalToNumber(s.inputKg);
  const outputPutihKg = decimalToNumber(s.outputPutihKg);
  const outputWarnaKg = decimalToNumber(s.outputWarnaKg);
  const yieldPercent = inputKg > 0 ? Number((((outputPutihKg + outputWarnaKg) / inputKg) * 100).toFixed(2)) : 0;

  return {
    id: s.id,
    bongkaranId: s.bongkaranId,
    sortDate: s.sortDate.toISOString(),
    inputKg,
    outputPutihKg,
    outputWarnaKg,
    wasteKg: decimalToNumber(s.wasteKg),
    laborExpense: decimalToNumber(s.laborExpense),
    totalCost: decimalToNumber(s.totalCost),
    unitCostPutih: decimalToNumber(s.unitCostPutih),
    unitCostWarna: decimalToNumber(s.unitCostWarna),
    yieldPercent,
    notes: s.notes,
    createdAt: s.createdAt.toISOString(),
  };
}

export function serializeBongkaran(b: {
  id: string;
  konveksiId: string;
  purchaseDate: Date;
  quantityKg: Prisma.Decimal;
  pricePerKg: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  transportExpense: Prisma.Decimal;
  additionalExpense: Prisma.Decimal;
  totalCost: Prisma.Decimal;
  costPerKgEffective: Prisma.Decimal;
  sortedQuantityKg: Prisma.Decimal;
  status: "PENDING_SORT" | "IN_PROGRESS" | "SORTED" | "CANCELLED";
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  konveksi: { name: string };
  sorts?: Parameters<typeof serializeBongkaranSort>[0][];
}): BongkaranRecord {
  const quantityKg = decimalToNumber(b.quantityKg);
  const sortedQuantityKg = decimalToNumber(b.sortedQuantityKg);
  return {
    id: b.id,
    konveksiId: b.konveksiId,
    konveksiName: b.konveksi.name,
    purchaseDate: b.purchaseDate.toISOString(),
    quantityKg,
    pricePerKg: decimalToNumber(b.pricePerKg),
    subtotal: decimalToNumber(b.subtotal),
    transportExpense: decimalToNumber(b.transportExpense),
    additionalExpense: decimalToNumber(b.additionalExpense),
    totalCost: decimalToNumber(b.totalCost),
    costPerKgEffective: decimalToNumber(b.costPerKgEffective),
    sortedQuantityKg,
    remainingKg: Number(Math.max(0, quantityKg - sortedQuantityKg).toFixed(2)),
    status: b.status,
    notes: b.notes,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    sorts: b.sorts ? b.sorts.map(serializeBongkaranSort) : undefined,
  };
}
