import { PaymentStatus, Prisma, type PrismaClient } from "@prisma/client";

type DbClient = Prisma.TransactionClient | PrismaClient;

export function decimal(value: Prisma.Decimal.Value = 0) {
  return new Prisma.Decimal(value);
}

export function roundQuantity(value: Prisma.Decimal) {
  return value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function roundMoney(value: Prisma.Decimal) {
  return value.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function toStoredDate(dateString: string) {
  return new Date(`${dateString}T12:00:00.000Z`);
}

export function calculatePurchaseAmounts(input: {
  quantityKg: Prisma.Decimal.Value;
  pricePerKg: Prisma.Decimal.Value;
  transportExpense?: Prisma.Decimal.Value;
}) {
  const quantityKg = roundQuantity(decimal(input.quantityKg));
  const pricePerKg = roundMoney(decimal(input.pricePerKg));
  const transportExpense = roundMoney(decimal(input.transportExpense ?? 0));
  const subtotal = roundMoney(quantityKg.times(pricePerKg));
  const totalExpense = roundMoney(subtotal.plus(transportExpense));

  return {
    quantityKg,
    pricePerKg,
    transportExpense,
    subtotal,
    totalExpense,
  };
}

export function calculateSaleAmounts(input: {
  quantityKg: Prisma.Decimal.Value;
  sellingPricePerKg: Prisma.Decimal.Value;
  deliveryExpense?: Prisma.Decimal.Value;
  additionalExpense?: Prisma.Decimal.Value;
}) {
  const quantityKg = roundQuantity(decimal(input.quantityKg));
  const sellingPricePerKg = roundMoney(decimal(input.sellingPricePerKg));
  const deliveryExpense = roundMoney(decimal(input.deliveryExpense ?? 0));
  const additionalExpense = roundMoney(decimal(input.additionalExpense ?? 0));
  const subtotal = roundMoney(quantityKg.times(sellingPricePerKg));
  const totalTransactionValue = roundMoney(subtotal.minus(deliveryExpense).minus(additionalExpense));

  return {
    quantityKg,
    sellingPricePerKg,
    deliveryExpense,
    additionalExpense,
    subtotal,
    totalTransactionValue,
  };
}

export async function syncSalePaymentStatus(tx: DbClient, saleId: string) {
  const sale = await tx.sale.findUnique({
    where: { id: saleId },
    select: {
      id: true,
      totalTransactionValue: true,
    },
  });

  if (!sale) {
    throw new Error("Sale not found");
  }

  const aggregate = await tx.salePayment.aggregate({
    where: { saleId },
    _sum: { amount: true },
  });

  const totalTransactionValue = decimal(sale.totalTransactionValue);
  const amountPaid = roundMoney(decimal(aggregate._sum.amount ?? 0));
  const outstandingAmount = amountPaid.greaterThanOrEqualTo(totalTransactionValue)
    ? decimal(0)
    : roundMoney(totalTransactionValue.minus(amountPaid));

  let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;

  if (amountPaid.greaterThan(0) && outstandingAmount.greaterThan(0)) {
    paymentStatus = PaymentStatus.PARTIAL;
  }

  if (outstandingAmount.equals(0) && totalTransactionValue.greaterThan(0)) {
    paymentStatus = PaymentStatus.PAID;
  }

  await tx.sale.update({
    where: { id: saleId },
    data: {
      amountPaid,
      outstandingAmount,
      paymentStatus,
    },
  });
}

export async function recomputeProductLedger(tx: DbClient, productId: string) {
  const movements = await tx.inventoryMovement.findMany({
    where: { productId },
    orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }, { id: "asc" }],
    include: {
      sale: {
        select: {
          id: true,
          subtotal: true,
          deliveryExpense: true,
          additionalExpense: true,
        },
      },
    },
  });

  let stock = decimal(0);
  let inventoryValue = decimal(0);

  for (const movement of movements) {
    const quantityKg = roundQuantity(decimal(movement.quantityKg));

    if (movement.movementType === "INBOUND") {
      const inboundTotalCost = roundMoney(decimal(movement.inboundTotalCost ?? 0));
      stock = roundQuantity(stock.plus(quantityKg));
      inventoryValue = roundMoney(inventoryValue.plus(inboundTotalCost));
      continue;
    }

    // Mengizinkan stok negatif (tidak dicegat)
    const currentAverageCost = stock.lessThanOrEqualTo(0) ? decimal(0) : roundMoney(inventoryValue.div(stock));
    const estimatedCogs = roundMoney(currentAverageCost.times(quantityKg));

    if (movement.sale) {
      const subtotal = decimal(movement.sale.subtotal);
      const deliveryExpense = decimal(movement.sale.deliveryExpense);
      const additionalExpense = decimal(movement.sale.additionalExpense);
      const estimatedProfit = roundMoney(
        subtotal.minus(deliveryExpense).minus(additionalExpense).minus(estimatedCogs),
      );

      await tx.sale.update({
        where: { id: movement.sale.id },
        data: {
          costBasisPerKgSnapshot: currentAverageCost,
          estimatedCogs,
          estimatedProfit,
        },
      });
    }

    stock = roundQuantity(stock.minus(quantityKg));
    inventoryValue = roundMoney(inventoryValue.minus(estimatedCogs));

    if (stock.lessThanOrEqualTo(0)) {
      inventoryValue = decimal(0);
    }
  }

  const averageCostPerKg = stock.lessThanOrEqualTo(0) ? decimal(0) : roundMoney(inventoryValue.div(stock));

  await tx.product.update({
    where: { id: productId },
    data: {
      currentStockKg: stock,
      averageCostPerKg,
    },
  });
}
