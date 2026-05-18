import { Prisma } from "@prisma/client";
import {
  ActivityRecord,
  BalePriceRecord,
  CustomerRecord,
  DashboardData,
  ExpenseCategoryOption,
  ExpenseRecord,
  ProductOption,
  PurchaseRecord,
  SalePaymentRecord,
  SaleRecord,
  StockMovementRecord,
  StockProduct,
  SupplierRecord,
} from "@/lib/majun-types";

export function decimalToNumber(value: Prisma.Decimal | number | string | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  return Number(value.toString());
}

export function serializeProduct(product: { id: string; code: string; name: string; currentStockKg: Prisma.Decimal; averageCostPerKg: Prisma.Decimal }): ProductOption {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    currentStockKg: decimalToNumber(product.currentStockKg),
    averageCostPerKg: decimalToNumber(product.averageCostPerKg),
  };
}

export function serializeStockProduct(product: { id: string; code: string; name: string; currentStockKg: Prisma.Decimal; averageCostPerKg: Prisma.Decimal }): StockProduct {
  const currentStockKg = decimalToNumber(product.currentStockKg);
  const averageCostPerKg = decimalToNumber(product.averageCostPerKg);

  return {
    id: product.id,
    code: product.code,
    name: product.name,
    currentStockKg,
    averageCostPerKg,
    totalInventoryValue: Number((currentStockKg * averageCostPerKg).toFixed(2)),
  };
}

export function serializeSupplier(supplier: {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  purchases?: { totalExpense: Prisma.Decimal }[];
}): SupplierRecord {
  return {
    id: supplier.id,
    name: supplier.name,
    phone: supplier.phone,
    address: supplier.address,
    notes: supplier.notes,
    createdAt: supplier.createdAt.toISOString(),
    updatedAt: supplier.updatedAt.toISOString(),
    purchaseCount: supplier.purchases?.length ?? 0,
    totalPurchaseValue: Number((supplier.purchases ?? []).reduce((sum, purchase) => sum + decimalToNumber(purchase.totalExpense), 0).toFixed(2)),
  };
}

export function serializeCustomer(customer: {
  id: string;
  storeName: string;
  ownerName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  preferredBalePriceId?: string | null;
  preferredBalePrice?: {
    clothType: "PUTIH" | "WARNA";
    grade: "A1" | "B2" | "C3";
    pricePerBal: Prisma.Decimal;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  sales?: { totalTransactionValue: Prisma.Decimal; outstandingAmount: Prisma.Decimal }[];
}): CustomerRecord {
  const balePricePerKg = customer.preferredBalePrice ? Number((decimalToNumber(customer.preferredBalePrice.pricePerBal) / 100).toFixed(2)) : null;

  const balePriceLabel = customer.preferredBalePrice ? `${customer.preferredBalePrice.clothType === "PUTIH" ? "Kain Putih" : "Kain Warna"} ${customer.preferredBalePrice.grade}` : null;

  return {
    id: customer.id,
    storeName: customer.storeName,
    ownerName: customer.ownerName,
    phone: customer.phone,
    address: customer.address,
    notes: customer.notes,
    preferredBalePriceId: customer.preferredBalePriceId ?? null,
    preferredBalePriceLabel: balePriceLabel,
    preferredBalePricePerKg: balePricePerKg,
    createdAt: customer.createdAt.toISOString(),
    updatedAt: customer.updatedAt.toISOString(),
    saleCount: customer.sales?.length ?? 0,
    totalSalesValue: Number((customer.sales ?? []).reduce((sum, sale) => sum + decimalToNumber(sale.totalTransactionValue), 0).toFixed(2)),
    outstandingAmount: Number((customer.sales ?? []).reduce((sum, sale) => sum + decimalToNumber(sale.outstandingAmount), 0).toFixed(2)),
  };
}

export function serializePurchase(purchase: {
  id: string;
  supplierId: string;
  productId: string;
  purchaseDate: Date;
  quantityKg: Prisma.Decimal;
  pricePerKg: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  transportExpense: Prisma.Decimal;
  totalExpense: Prisma.Decimal;
  notes: string | null;
  supplier: { name: string };
  product: { name: string };
}): PurchaseRecord {
  return {
    id: purchase.id,
    supplierId: purchase.supplierId,
    supplierName: purchase.supplier.name,
    productId: purchase.productId,
    productName: purchase.product.name,
    purchaseDate: purchase.purchaseDate.toISOString(),
    quantityKg: decimalToNumber(purchase.quantityKg),
    pricePerKg: decimalToNumber(purchase.pricePerKg),
    subtotal: decimalToNumber(purchase.subtotal),
    transportExpense: decimalToNumber(purchase.transportExpense),
    totalExpense: decimalToNumber(purchase.totalExpense),
    notes: purchase.notes,
  };
}

export function serializeSalePayment(payment: { id: string; paymentDate: Date; amount: Prisma.Decimal; notes: string | null }): SalePaymentRecord {
  return {
    id: payment.id,
    paymentDate: payment.paymentDate.toISOString(),
    amount: decimalToNumber(payment.amount),
    notes: payment.notes,
  };
}

export function serializeSale(sale: {
  id: string;
  customerId: string;
  productId: string;
  saleDate: Date;
  quantityKg: Prisma.Decimal;
  sellingPricePerKg: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  deliveryExpense: Prisma.Decimal;
  additionalExpense: Prisma.Decimal;
  totalTransactionValue: Prisma.Decimal;
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  amountPaid: Prisma.Decimal;
  outstandingAmount: Prisma.Decimal;
  costBasisPerKgSnapshot: Prisma.Decimal;
  estimatedCogs: Prisma.Decimal;
  estimatedProfit: Prisma.Decimal;
  notes: string | null;
  customer: { storeName: string };
  product: { name: string };
  salePayments?: { id: string; paymentDate: Date; amount: Prisma.Decimal; notes: string | null }[];
}): SaleRecord {
  return {
    id: sale.id,
    customerId: sale.customerId,
    customerName: sale.customer.storeName,
    productId: sale.productId,
    productName: sale.product.name,
    saleDate: sale.saleDate.toISOString(),
    quantityKg: decimalToNumber(sale.quantityKg),
    sellingPricePerKg: decimalToNumber(sale.sellingPricePerKg),
    subtotal: decimalToNumber(sale.subtotal),
    deliveryExpense: decimalToNumber(sale.deliveryExpense),
    additionalExpense: decimalToNumber(sale.additionalExpense),
    totalTransactionValue: decimalToNumber(sale.totalTransactionValue),
    paymentStatus: sale.paymentStatus,
    amountPaid: decimalToNumber(sale.amountPaid),
    outstandingAmount: decimalToNumber(sale.outstandingAmount),
    costBasisPerKgSnapshot: decimalToNumber(sale.costBasisPerKgSnapshot),
    estimatedCogs: decimalToNumber(sale.estimatedCogs),
    estimatedProfit: decimalToNumber(sale.estimatedProfit),
    notes: sale.notes,
    payments: (sale.salePayments ?? []).map(serializeSalePayment),
  };
}

export function serializeExpenseCategory(category: { id: string; name: string }): ExpenseCategoryOption {
  return {
    id: category.id,
    name: category.name,
  };
}

export function serializeBalePrice(item: { id: string; clothType: "PUTIH" | "WARNA"; grade: "A1" | "B2" | "C3"; pricePerBal: Prisma.Decimal; notes: string | null; createdAt: Date; updatedAt: Date }): BalePriceRecord {
  return {
    id: item.id,
    clothType: item.clothType,
    grade: item.grade,
    pricePerBal: decimalToNumber(item.pricePerBal),
    notes: item.notes,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function serializeExpense(expense: { id: string; categoryId: string; expenseDate: Date; amount: Prisma.Decimal; description: string; category: { name: string } }): ExpenseRecord {
  return {
    id: expense.id,
    categoryId: expense.categoryId,
    categoryName: expense.category.name,
    expenseDate: expense.expenseDate.toISOString(),
    amount: decimalToNumber(expense.amount),
    description: expense.description,
  };
}

export function serializeStockMovement(movement: {
  id: string;
  occurredAt: Date;
  movementType: "INBOUND" | "OUTBOUND";
  quantityKg: Prisma.Decimal;
  inboundTotalCost: Prisma.Decimal | null;
  notes: string | null;
  product: { name: string };
  purchase?: { supplier: { name: string } } | null;
  sale?: { customer: { storeName: string } } | null;
  productId: string;
}): StockMovementRecord {
  return {
    id: movement.id,
    productId: movement.productId,
    productName: movement.product.name,
    occurredAt: movement.occurredAt.toISOString(),
    movementType: movement.movementType,
    quantityKg: decimalToNumber(movement.quantityKg),
    inboundTotalCost: movement.inboundTotalCost ? decimalToNumber(movement.inboundTotalCost) : null,
    sourceLabel: movement.purchase ? `Pembelian dari ${movement.purchase.supplier.name}` : movement.sale ? `Penjualan ke ${movement.sale.customer.storeName}` : "Pergerakan stok",
    notes: movement.notes,
  };
}

export function buildDashboardData(input: DashboardData): DashboardData {
  return input;
}

export function sortActivitiesDescending(activities: ActivityRecord[]) {
  return [...activities].sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}
