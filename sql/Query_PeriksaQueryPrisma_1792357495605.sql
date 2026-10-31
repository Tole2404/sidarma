prisma
model Sale {
  id           String   @id @default(cuid())
  saleId       String   @unique
  customerId   String
  productId    String
  quantityKg   Float
  pricePerKg   Float
  total        Float
  outstanding  Float
  status       String   // UNPAID, PARTIAL, PAID
  date         DateTime @default(now())
  createdAt    DateTime @default(now())

  customer     Customer @relation(fields: [customerId], references: [id])
  product      Product  @relation(fields: [productId], references: [id])

  // Indeks komposit filter piutang dan foreign key
  @@index([status, date])
  @@index([customerId])
  @@index([productId])
}

model Product {
  id           String   @id @default(cuid())
  code         String   @unique
  name         String
  stockKg      Float    @default(0)
  avgCostPerKg Float    @default(0)

  sales        Sale[]

  @@index([code])
}

model Bongkaran {
  id         String   @id @default(cuid())
  clothType  String   // PUTIH, WARNA
  grade      String
  baleCount  Int
  weightKg   Float
  wasteKg    Float
  createdAt  DateTime @default(now())

  // Indeks filter jenis kain dan urutan waktu
  @@index([clothType, createdAt(sort: Desc)])
}