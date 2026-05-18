import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildDashboardData, serializeStockProduct, sortActivitiesDescending } from "@/lib/majun-serializers";
import { serverError } from "@/lib/api-response";

export async function GET() {
  try {
    await requireAuth();

    const [
      salesAggregate,
      purchasesAggregate,
      expensesAggregate,
      products,
      recentPurchases,
      recentSales,
      recentExpenses,
      allSales,
      allPurchases,
      allExpenses,
    ] = await Promise.all([
      prisma.sale.aggregate({
        _sum: {
          totalTransactionValue: true,
          estimatedProfit: true,
        },
      }),
      prisma.purchase.aggregate({
        _sum: {
          totalExpense: true,
        },
      }),
      prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
      prisma.purchase.findMany({
        include: {
          supplier: { select: { name: true } },
          product: { select: { name: true } },
        },
        orderBy: [{ purchaseDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      }),
      prisma.sale.findMany({
        include: {
          customer: { select: { storeName: true } },
          product: { select: { name: true } },
        },
        orderBy: [{ saleDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      }),
      prisma.expense.findMany({
        include: {
          category: { select: { name: true } },
        },
        orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
        take: 5,
      }),
      prisma.sale.findMany({
        select: {
          saleDate: true,
          totalTransactionValue: true,
        },
        orderBy: { saleDate: "asc" },
      }),
      prisma.purchase.findMany({
        select: {
          purchaseDate: true,
          totalExpense: true,
        },
        orderBy: { purchaseDate: "asc" },
      }),
      prisma.expense.findMany({
        select: {
          expenseDate: true,
          amount: true,
        },
        orderBy: { expenseDate: "asc" },
      }),
    ]);

    const recentActivities = sortActivitiesDescending([
      ...recentPurchases.map((purchase) => ({
        id: purchase.id,
        type: "PURCHASE" as const,
        title: `Pembelian ${purchase.product.name}`,
        subtitle: purchase.supplier.name,
        date: purchase.purchaseDate.toISOString(),
        amount: Number(purchase.totalExpense.toString()),
      })),
      ...recentSales.map((sale) => ({
        id: sale.id,
        type: "SALE" as const,
        title: `Penjualan ${sale.product.name}`,
        subtitle: sale.customer.storeName,
        date: sale.saleDate.toISOString(),
        amount: Number(sale.totalTransactionValue.toString()),
      })),
      ...recentExpenses.map((expense) => ({
        id: expense.id,
        type: "EXPENSE" as const,
        title: expense.category.name,
        subtitle: expense.description,
        date: expense.expenseDate.toISOString(),
        amount: Number(expense.amount.toString()),
      })),
    ]).slice(0, 8);

    return NextResponse.json({
      totalSales: Number((salesAggregate._sum.totalTransactionValue ?? 0).toString()),
      totalPurchases: Number((purchasesAggregate._sum.totalExpense ?? 0).toString()),
      totalExpenses: Number((expensesAggregate._sum.amount ?? 0).toString()),
      estimatedProfit: Number((salesAggregate._sum.estimatedProfit ?? 0).toString()),
      stockSummary: products.map(serializeStockProduct),
      recentActivities,
      salesHistory: allSales.map((s) => ({
        date: s.saleDate.toISOString(),
        amount: Number(s.totalTransactionValue.toString()),
      })),
      purchasesHistory: allPurchases.map((p) => ({
        date: p.purchaseDate.toISOString(),
        amount: Number(p.totalExpense.toString()),
      })),
      expensesHistory: allExpenses.map((e) => ({
        date: e.expenseDate.toISOString(),
        amount: Number(e.amount.toString()),
      })),
    });
  } catch (error) {
    return serverError(error);
  }
}
