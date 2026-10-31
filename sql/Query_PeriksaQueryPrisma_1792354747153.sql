prisma
model SalesOrder {
  id           String        @id @default(uuid())
  customerName String
  customerId   String?
  status       PaymentStatus @default(UNPAID)
  totalAmount  Decimal       @db.Decimal(12, 2)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  // Composite index: percepat filter dashboard piutang & sort tanggal
  @@index([status, createdAt(sort: Desc)])
  // Foreign key index: percepat join tabel customer
  @@index([customerId])
}

model InventoryStock {
  id          String   @id @default(uuid())
  productCode String
  warehouseId String?
  quantityKg  Decimal  @db.Decimal(10, 2)
  updatedAt   DateTime @updatedAt

  // Composite unique / index: lookup cepat saldo stok
  @@unique([productCode, warehouseId])
  @@index([productCode])
}

model BongkaranBale {
  id           String   @id @default(uuid())
  batchNumber  String   @unique
  supplierId   String
  tanggalBongkar DateTime @default(now())

  // Index untuk filter riwayat per supplier
  @@index([supplierId, tanggalBongkar(sort: Desc)])
}