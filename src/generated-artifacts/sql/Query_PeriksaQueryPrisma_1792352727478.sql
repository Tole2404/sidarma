> ⚡ **Diproses Langsung Melalui 9Router (ag/gemini-3.8-flash-high)**

### Bottleneck Query Prisma

| Query Path | Pola Akses | Masalah | Estimasi Latensi |
| :--- | :--- | :--- | :--- |
| `stockMovement.findMany` | Filter `product_name` (`Majun Putih`, `Majun Warna`) + sort `created_at` | Sequential scan tabel pergerakan stok. | 180ms - 450ms |
| `bongkaranBal.findMany` | Filter `supplier_id` (`CV Sumber Rejeki`) + `status` | Full table scan histori partai bal. | 220ms - 600ms |
| `balPrice.findFirst` | Filter `grade` (`WARNA C3`, `PUTIH C3`) + `is_active` | Scan tanpa index penentu harga aktif. | 85ms - 190ms |

---

### Usulan Index Prisma Schema

Ubah file `prisma/schema.prisma`:

```prisma
model StockMovement {
  id          String   @id @default(uuid())
  productName String   @map("product_name") // Majun Putih / Majun Warna
  quantityKg  Float    @map("quantity_kg")
  createdAt   DateTime @default(now()) @map("created_at")

  // Indeks komposit filter produk dan urutan waktu
  @@index([productName, createdAt(sort: Desc)])
  @@map("stock_movements")
}

model BongkaranBal {
  id             String    @id @default(uuid())
  supplierId     String    @map("supplier_id")
  grade          String    // WARNA A1, B2, C3, PUTIH C3
  jumlahBal      Int       @map("jumlah_bal")
  status         String    @default("PROSES") // PROSES, SELESAI
  tanggalBongkar DateTime  @default(now()) @map("tanggal_bongkar")

  // Indeks komposit filter supplier dan status bongkaran
  @@index([supplierId, status])
  @@index([tanggalBongkar(sort: Desc)])
  @@map("bongkaran_bal")
}

model BalPriceReference {
  id        String   @id @default(uuid())
  grade     String   @unique // WARNA C3, PUTIH C3, dll
  price     Decimal  @db.Decimal(12, 2)
  isActive  Boolean  @default(true) @map("is_active")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Indeks cari harga aktif per grade bal
  @@index([grade, isActive])
  @@map("bal_price_references")
}
```

---

### Migrasi Database (PostgreSQL)

Jalankan non-blocking index di production. Jangan kunci tabel saat write.

```sql
-- Non-blocking index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_stock_movements_product_date 
ON stock_movements (product_name, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bongkaran_bal_supplier_status 
ON bongkaran_bal (supplier_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bongkaran_bal_tanggal 
ON bongkaran_bal (tanggal_bongkar DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bal_prices_grade_active 
ON bal_price_references (grade, is_active);
```

---

### Verifikasi Eksekusi

Jalankan perintah ini:

```bash
# Buat migration file tanpa auto-apply
npx prisma migrate dev --create-only --name add_performance_indexes

# Validasi query plan via psql
psql $DATABASE_URL -c "EXPLAIN ANALYZE SELECT * FROM stock_movements WHERE product_name = 'Majun Putih' ORDER BY created_at DESC LIMIT 50;"
```

Pastikan output eksekusi berubah dari `Seq Scan` jadi `Index Scan using idx_stock_movements_product_date`. Target latensi: < 15ms.