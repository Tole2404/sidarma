# Fitur: Pembelian Bongkaran dari Konveksi

> Modul baru untuk mengelola pemasukan **bahan baku mentah** dari konveksi/garment (sisa potongan kain produksi) sebelum diolah menjadi kain majun siap jual.

---

## Latar Belakang

Saat ini sistem sudah punya:

- **Purchase** — pembelian dari supplier dalam bentuk **majun jadi** (sudah disortir, sudah dalam karung).
- **Sale** — penjualan kain majun ke customer.

Yang belum ada: alur **dari hulu** — yaitu pembelian **kain bongkaran** mentah dari konveksi/garment. Bongkaran adalah campuran potongan kain perca dari proses produksi konveksi yang belum disortir berdasarkan warna/jenis. Setelah masuk gudang, bongkaran harus disortir manual oleh pekerja menjadi:

- Majun putih (siap jual)
- Majun warna (siap jual)
- Sisa / reject (kain rusak, tidak terpakai)

Modul ini melengkapi alur bisnis:

```
Konveksi → [Bongkaran] → Sortir → [Majun Putih / Warna / Sisa] → Customer
              ▲                          ▲                            ▲
        (Bongkaran)                 (Stok Majun)                   (Sale)
```

---

## Tujuan

1. Mencatat pembelian kain bongkaran dari konveksi secara terpisah dari Purchase reguler.
2. Tracking sumber konveksi sebagai vendor (siapa, harga, frekuensi).
3. Mencatat proses **sortir** yang mengkonversi 1 transaksi bongkaran menjadi N kg majun putih + N kg majun warna + N kg sisa.
4. Menjaga akurasi HPP (cost basis) majun yang berasal dari bongkaran agar laporan profit penjualan tetap valid.
5. Laporan: rendemen sortir (yield), biaya rata-rata per kg majun dari bongkaran, performa per konveksi.

---

## Entitas Baru

### 1. `Konveksi`

Vendor khusus yang menjual bongkaran. Dipisah dari `Supplier` agar reporting dan UX-nya beda. Alternatif: pakai field `type` di Supplier (`SUPPLIER_MAJUN` | `KONVEKSI`). Pilih salah satu di tahap design.

Field minimal:

- `id`, `name` (unique), `phone`, `address`
- `picName` (nama PIC / kontak person)
- `notes`
- `isActive` (boolean)
- `createdAt`, `updatedAt`

### 2. `Bongkaran` (transaksi pembelian)

1 record = 1 kali ambil/beli bongkaran dari satu konveksi.

Field:

- `id`
- `konveksiId` (FK → Konveksi)
- `purchaseDate` (tanggal ambil)
- `quantityKg` (total kg bongkaran masuk)
- `pricePerKg` (harga beli per kg)
- `subtotal` = quantityKg × pricePerKg
- `transportExpense` (ongkos angkut/jemput)
- `additionalExpense` (biaya tambahan, mis. bongkar muat)
- `totalCost` = subtotal + transportExpense + additionalExpense
- `costPerKgEffective` = totalCost / quantityKg (HPP per kg bongkaran)
- `notes`
- `status`: `PENDING_SORT` | `IN_PROGRESS` | `SORTED` | `CANCELLED`
- `sortedQuantityKg` (akumulasi kg yang sudah disortir, untuk validasi)
- `remainingKg` = quantityKg - sortedQuantityKg
- `createdById` (FK → User)
- `createdAt`, `updatedAt`

Aturan:

- Saat dibuat, `status = PENDING_SORT` dan menambah stok produk virtual **"Bongkaran (mentah)"** sebesar `quantityKg`.
- Tidak bisa langsung dijual ke customer. Harus melewati proses sortir dulu.
- Tidak bisa dihapus jika sudah pernah disortir (status ≠ PENDING_SORT). Gunakan cancel atau reverse.

### 3. `BongkaranSort` (proses sortir)

1 record = 1 batch sortir dari 1 transaksi Bongkaran. Satu transaksi bongkaran bisa disortir bertahap (multi-batch) jika quantity besar.

Field:

- `id`
- `bongkaranId` (FK → Bongkaran)
- `sortDate`
- `inputKg` (jumlah kg bongkaran yang disortir di batch ini, ≤ remainingKg)
- `outputPutihKg` (hasil majun putih)
- `outputWarnaKg` (hasil majun warna)
- `wasteKg` = inputKg − outputPutihKg − outputWarnaKg (sisa/reject)
- `laborExpense` (upah sortir untuk batch ini, opsional)
- `notes`
- `createdById`
- `createdAt`, `updatedAt`

Validasi:

- `outputPutihKg + outputWarnaKg ≤ inputKg`
- `inputKg ≤ remainingKg` dari Bongkaran terkait
- Selisih = `wasteKg` dihitung otomatis

Alokasi HPP (cost allocation):

- Total cost batch ini = `inputKg × bongkaran.costPerKgEffective + laborExpense`
- HPP putih per kg dan warna per kg dialokasikan **proporsional terhadap output** (waste tidak dialokasikan):
  - `costPutih = totalCost × (outputPutihKg / (outputPutihKg + outputWarnaKg))`
  - `costWarna = totalCost × (outputWarnaKg / (outputPutihKg + outputWarnaKg))`
  - `unitCostPutih = costPutih / outputPutihKg`
  - `unitCostWarna = costWarna / outputWarnaKg`
- Bila `outputPutihKg + outputWarnaKg = 0`, batch ditolak (semua jadi waste = abnormal).

Efek inventory:

- Bongkaran (mentah) **berkurang** sebesar `inputKg`.
- Produk Majun Putih **bertambah** sebesar `outputPutihKg` dengan cost basis `unitCostPutih` (dipakai untuk update averageCostPerKg).
- Produk Majun Warna **bertambah** sebesar `outputWarnaKg` dengan cost basis `unitCostWarna`.
- Waste tidak diinventarisasi (langsung dianggap loss). Catat di laporan waste rate.

### 4. `Product` — tambah produk virtual

Tambah satu produk system baru dengan kode `BONGKARAN` dan `name = "Bongkaran (Mentah)"` agar bisa dipakai sebagai parent inventoryMovement. Tidak perlu skema baru, cukup seed.

### 5. `InventoryMovement` — tambah tipe baru

Reuse model yang ada. Tambah enum value:

- `BONGKARAN_INBOUND` — masuk bongkaran mentah
- `BONGKARAN_SORT_OUT` — keluar dari stok bongkaran karena disortir
- `SORT_OUTPUT` — masuk ke stok majun (putih/warna) hasil sortir

Atau pakai `INBOUND`/`OUTBOUND` yang sudah ada dan tambahkan kolom `sourceType` (`PURCHASE` | `BONGKARAN` | `SORT`) agar lebih netral. Pilih saat design fase.

---

## Alur UI / UX

### Halaman `/konveksi`

CRUD konveksi (mirip `/suppliers` dan `/customers`).

- List konveksi + ringkasan: total kg bongkaran masuk, total nilai, last transaction.
- Form tambah/edit.
- Detail: history transaksi bongkaran dari konveksi tersebut.

### Halaman `/bongkaran`

List transaksi bongkaran + ringkasan stok bongkaran mentah saat ini.

Card stat di atas:

- Total stok bongkaran mentah (kg)
- Bongkaran menunggu sortir (jumlah transaksi & kg)
- Total bongkaran bulan ini (kg & rupiah)
- Rendemen rata-rata bulan ini (% output / input)

Tabel kolom:

- Tanggal
- Konveksi
- Quantity (kg)
- Harga/kg
- Total cost
- Sudah disortir (kg) / Sisa (kg) — visual progress bar
- Status badge (`Menunggu`, `Sebagian`, `Selesai`)
- Aksi: Detail, Sortir, Edit (bila masih PENDING_SORT), Cancel

Form tambah:

- Pilih konveksi (combo)
- Tanggal
- Quantity (kg) + harga/kg → auto subtotal
- Transport expense, additional expense
- Notes
- Auto: total cost & cost/kg ditampilkan live

### Halaman `/bongkaran/[id]` (detail + proses sortir)

Section atas: ringkasan bongkaran (data utama, status, sisa kg).

Section bawah: list batch sortir + tombol "Sortir Batch Baru".

Form sortir batch:

- Tanggal
- Input kg (max = remainingKg)
- Output putih (kg)
- Output warna (kg)
- Waste (kg) — readonly, auto = input − output putih − output warna
- Labor expense
- Preview alokasi HPP per kategori
- Notes

Setelah submit:

- Update inventory (kurangi bongkaran, tambah majun)
- Update averageCostPerKg produk majun putih/warna sesuai weighted average
- Update status bongkaran berdasar `remainingKg`

### Dashboard widget

- Card: "Stok Bongkaran" (kg + rupiah)
- Card: "Rendemen Bulan Ini" (%)
- Top konveksi (by kg dalam 30 hari)

---

## API Routes

```
GET    /api/konveksi
POST   /api/konveksi
GET    /api/konveksi/[id]
PATCH  /api/konveksi/[id]
DELETE /api/konveksi/[id]

GET    /api/bongkaran
POST   /api/bongkaran
GET    /api/bongkaran/[id]
PATCH  /api/bongkaran/[id]
DELETE /api/bongkaran/[id]

POST   /api/bongkaran/[id]/sort         -> create sort batch
GET    /api/bongkaran/[id]/sort         -> list sort batches
DELETE /api/bongkaran/[id]/sort/[batchId] -> reverse batch (mengembalikan stok)
```

Semua write endpoint butuh `requireAuth()`.

---

## Rumus & Logika Penting

```
costPerKgEffective = (qty × price + transport + additional) / qty

Per batch sortir:
inputCost      = inputKg × bongkaran.costPerKgEffective + laborExpense
totalOutputKg  = outputPutihKg + outputWarnaKg
costPutih      = inputCost × (outputPutihKg / totalOutputKg)
costWarna      = inputCost × (outputWarnaKg / totalOutputKg)
unitCostPutih  = costPutih / outputPutihKg
unitCostWarna  = costWarna / outputWarnaKg

Update product.averageCostPerKg pakai weighted average:
newAvg = (oldStock × oldAvg + newKg × unitCost) / (oldStock + newKg)

Yield (rendemen):
yieldPercent = (outputPutihKg + outputWarnaKg) / inputKg × 100
wastePercent = wasteKg / inputKg × 100
```

---

## Laporan Tambahan

Tambahkan ke modul reporting (atau dashboard):

1. **Yield report per konveksi** — rata-rata persentase output putih/warna/waste tiap konveksi. Membantu menilai konveksi mana yang materialnya bagus.
2. **Cost report bongkaran vs purchase** — perbandingan HPP majun dari bongkaran vs dari pembelian langsung (Purchase reguler). Untuk menentukan strategi sourcing.
3. **Waste rate** — laporan waste total (kg & rupiah) per periode.
4. **Pending sort aging** — bongkaran yang sudah lebih dari N hari belum disortir (alarm operasional).

---

## Migrasi Data

- Tidak ada data lama yang perlu dimigrasi. Modul baru bersifat additive.
- Seed: tambahkan satu produk system `BONGKARAN` saat seeding.
- Konveksi awal bisa diinput manual via UI atau seed.

---

## Edge Cases & Validasi

- Bongkaran dengan `remainingKg = 0` tidak bisa di-sort lagi.
- Edit bongkaran hanya boleh saat `status = PENDING_SORT` dan belum ada batch sortir.
- Hapus konveksi: tolak bila masih ada bongkaran terkait (FK Restrict).
- Cancel bongkaran (`status = CANCELLED`): hanya boleh bila belum ada sortir. Inventory bongkaran mentah dikembalikan.
- Reverse batch sortir: kembalikan stok majun (decrement) & stok bongkaran (increment), revert averageCostPerKg dengan recompute dari history bila memungkinkan, atau snapshot.
- Floating point: gunakan Decimal (`@db.Decimal`) konsisten dengan model existing.

---

## Permission

- ADMIN: full akses
- USER: read + create bongkaran + sortir, tapi tidak bisa hapus/cancel transaksi (opsional, bisa disesuaikan)

---

## Acceptance Criteria

1. Admin dapat membuat konveksi dan menampilkannya di list.
2. Admin dapat membuat transaksi bongkaran dari konveksi → stok bongkaran mentah bertambah.
3. Admin dapat memproses sortir → stok bongkaran berkurang, stok majun putih/warna bertambah dengan HPP yang benar.
4. Sortir bisa dilakukan bertahap (multi-batch) sampai `remainingKg = 0`.
5. Status bongkaran otomatis terupdate berdasar progress sortir.
6. Dashboard menampilkan stok bongkaran mentah dan rendemen rata-rata.
7. Laporan profit Sale tetap akurat menggunakan averageCostPerKg yang sudah memperhitungkan kontribusi bongkaran.
8. Tidak boleh menjual majun melebihi stok yang tercatat (validasi existing tetap berlaku).

---

## Open Questions

Sebelum implementasi, klarifikasi dulu:

1. **Konveksi vs Supplier** — pisah jadi tabel sendiri atau gabung ke `Supplier` dengan kolom `type`?
2. **Waste handling** — apakah waste dijual lagi ke pihak ketiga (mis. tukang loak), atau hanya dibuang? Kalau dijual, perlu modul tambahan kecil.
3. **Multi-batch sortir** — apakah selalu multi-batch, atau biasanya sekali sortir habis? Ini menentukan kompleksitas UI.
4. **Sumber lain** — selain konveksi, apakah bongkaran bisa juga dari sumber lain (mis. pabrik tekstil, pengepul)? Bila ya, mungkin lebih cocok tipe sumber yang fleksibel.
5. **Pembayaran konveksi** — apakah selalu cash/bayar di tempat, atau bisa hutang? Kalau bisa hutang, butuh `BongkaranPayment` mirip `SalePayment`.
6. **Grade/kualitas bongkaran** — apakah perlu grade A/B/C seperti BalePrice? Bisa berdampak ke harga beli.

---

## Estimasi Pengerjaan

| Fase | Estimasi |
|------|----------|
| Schema Prisma + migration | 0.5 hari |
| API konveksi + bongkaran + sortir | 1.5 hari |
| UI list + detail + form bongkaran | 1.5 hari |
| UI form sortir + alokasi HPP | 1 hari |
| Dashboard widget + laporan | 0.5 hari |
| QA + validasi edge case | 0.5 hari |
| **Total** | **~5.5 hari** |

---

*Dokumen ini adalah requirements awal. Setelah klarifikasi Open Questions, lanjut ke fase Design + Tasks (spec format Kiro) untuk implementasi terstruktur.*
