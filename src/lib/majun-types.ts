export type PaymentStatusValue = "UNPAID" | "PARTIAL" | "PAID";
export type ActivityType = "PURCHASE" | "SALE" | "EXPENSE";

export interface ProductOption {
  id: string;
  code: string;
  name: string;
  currentStockKg: number;
  averageCostPerKg: number;
}

export interface StockProduct extends ProductOption {
  totalInventoryValue: number;
}

export interface SupplierRecord {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  purchaseCount: number;
  totalPurchaseValue: number;
}

export interface CustomerRecord {
  id: string;
  storeName: string;
  ownerName: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  preferredBalePriceId: string | null;
  preferredBalePriceLabel: string | null;
  preferredBalePricePerKg: number | null;
  createdAt: string;
  updatedAt: string;
  saleCount: number;
  totalSalesValue: number;
  outstandingAmount: number;
}

export interface PurchaseRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productName: string;
  purchaseDate: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
  transportExpense: number;
  totalExpense: number;
  notes: string | null;
}

export interface SalePaymentRecord {
  id: string;
  paymentDate: string;
  amount: number;
  notes: string | null;
}

export interface SaleRecord {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  saleDate: string;
  quantityKg: number;
  sellingPricePerKg: number;
  subtotal: number;
  deliveryExpense: number;
  additionalExpense: number;
  totalTransactionValue: number;
  paymentStatus: PaymentStatusValue;
  amountPaid: number;
  outstandingAmount: number;
  costBasisPerKgSnapshot: number;
  estimatedCogs: number;
  estimatedProfit: number;
  notes: string | null;
  payments: SalePaymentRecord[];
}

export interface ExpenseCategoryOption {
  id: string;
  name: string;
}

export type BaleClothTypeValue = "PUTIH" | "WARNA";
export type BaleGradeValue = "A1" | "B2" | "C3";

export interface BalePriceRecord {
  id: string;
  clothType: BaleClothTypeValue;
  grade: BaleGradeValue;
  pricePerBal: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseRecord {
  id: string;
  categoryId: string;
  categoryName: string;
  expenseDate: string;
  amount: number;
  description: string;
}

export interface StockMovementRecord {
  id: string;
  productId: string;
  productName: string;
  occurredAt: string;
  movementType: "INBOUND" | "OUTBOUND";
  quantityKg: number;
  inboundTotalCost: number | null;
  sourceLabel: string;
  notes: string | null;
}

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  date: string;
  amount: number;
}

export interface DashboardData {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  estimatedProfit: number;
  stockSummary: StockProduct[];
  recentActivities: ActivityRecord[];
}
