prisma
model SalesOrder {
  id            String   @id @default(uuid())
  customerId    String
  paymentStatus String
  createdAt     DateTime @default(now())

  // Query filter piutang dan jatuh tempo
  @@index([paymentStatus, createdAt(sort: Desc)])
  @@index([customerId, paymentStatus])
}

model StockMovement {
  id        String   @id @default(uuid())
  productId String
  createdAt DateTime @default(now())

  // Kalkulasi agregasi stok riil & mutasi per produk
  @@index([productId, createdAt(sort: Desc)])
}

model BongkaranBal {
  id        String   @id @default(uuid())
  clothType String
  createdAt DateTime @default(now())

  // Filter rendemen bal & histori bongkaran
  @@index([clothType, createdAt(sort: Desc)])
}