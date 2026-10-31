prisma
model SalesOrder {
  id            String   @id @default(uuid())
  customerId    String
  paymentStatus String   // UNPAID, PARTIAL, PAID
  totalAmount   Decimal  @db.Decimal(12, 2)
  createdAt     DateTime @default(now())
  
  customer      Customer @relation(fields: [customerId], references: [id])

  // Cegah Seq Scan filter piutang & sortir tanggal
  @@index([paymentStatus, createdAt(sort: Desc)])
  @@index([customerId])
}

model InventoryStock {
  id          String   @id @default(uuid())
  productCode String   @unique
  clothType   String   // PUTIH, WARNA
  stockKg     Decimal  @db.Decimal(10, 2)
  updatedAt   DateTime @updatedAt

  // Optimasi agregasi stok per tipe kain
  @@index([clothType])
}

model BaleBongkaran {
  id          String   @id @default(uuid())
  supplierId  String
  bongkarDate DateTime @default(now())
  rendemenPct Decimal  @db.Decimal(5, 2)

  supplier    Supplier @relation(fields: [supplierId], references: [id])

  // Optimasi tracking rendemen supplier
  @@index([supplierId, bongkarDate(sort: Desc)])
}