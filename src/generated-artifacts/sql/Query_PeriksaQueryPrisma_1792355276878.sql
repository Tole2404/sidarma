prisma
model SalesOrder {
  id            String        @id @default(uuid())
  customerName  String
  paymentStatus PaymentStatus // UNPAID, PARTIAL, PAID
  totalAmount   Decimal       @db.Decimal(12, 2)
  paidAmount    Decimal       @db.Decimal(12, 2)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  // Index percepat filter piutang macet dan urutan transaksi terbaru
  @@index([paymentStatus, createdAt(sort: Desc)])
  @@index([customerName])
}

model InventoryStock {
  id            String   @id @default(uuid())
  productCode   String   @unique
  productName   String
  stockKg       Float    @default(0)
  avgHpp        Decimal  @db.Decimal(12, 2)
  updatedAt     DateTime @updatedAt

  @@index([productCode])
}

model InventoryLedger {
  id          String   @id @default(uuid())
  productId   String
  movementKg  Float
  costPerKg   Decimal  @db.Decimal(12, 2)
  createdAt   DateTime @default(now())

  // Index percepat kalkulasi mutasi kartu stok
  @@index([productId, createdAt(sort: Desc)])
}

model BongkaranBale {
  id          String   @id @default(uuid())
  batchNumber String   @unique
  supplierId  String
  clothType   String   // PUTIH, WARNA
  wasteKg     Float
  createdAt   DateTime @default(now())

  // Index percepat agregasi rendemen per supplier dan waktu
  @@index([supplierId, createdAt(sort: Desc)])
  @@index([clothType])
}