# PRD: Modul Surat Jalan Digital CV. SIDARMA MAJUN
**Penyusun:** Unit PRD-02 (ArchBot-Prime — Software Architect)  
**Status:** Draf Tinjauan Teknis (Final)  
**Target Rilis:** Sprint 4 — Next.js 16 App Router  

---

## 1. Latar Belakang & Masalah
Saat pengiriman bal kain majun ke pabrik manufaktur di Cikarang dan Karawang, supir armada sering kehilangan nota fisik kertas atau terjadi perselisihan selisih timbangan (toleransi 0.5%). Modul Surat Jalan Digital ini bertujuan mendigitalisasi surat jalan lengkap dengan QR Code verifikasi timbangan langsung di gerbang satpam pabrik.

## 2. Fitur Utama
1. **Penerbitan Surat Jalan Otomatis:**
   - Menghubungkan ID Transaksi Penjualan (`Sale`), ID Supir, Plat Nomor Truk, dan Partai Bal (`BongkaranSort`).
2. **QR Code Tanda Terima:**
   - QR Code terenkripsi yang dapat dipindai oleh penerima gudang tanpa perlu login akun admin.
3. **Pencatatan Selisih Timbangan Tiba:**
   - Validasi jika selisih > 1.5% otomatis memberi notifikasi ke agen `FIN-15` (Margin Guard).

## 3. Skema Data (Prisma Model Proposal)
```prisma
model SuratJalan {
  id           String      @id @default(cuid())
  nomorSurat   String      @unique
  saleId       String
  sale         Sale        @relation(fields: [saleId], references: [id])
  driverName   String
  vehiclePlate String
  totalKgKirim Float
  totalKgTiba  Float?
  status       String      @default("DIKIRIM") // DIKIRIM, TIBA, DITERIMA, SELISIH
  qrCodeUrl    String?
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

## 4. Persetujuan & Tanda Tangan
- [x] Disetujui oleh Lead Architect (`PRD-02`)
- [x] Diverifikasi oleh Finansial & HPP (`FIN-15`)
- [ ] Implementasi Handler API oleh (`DEV-01`)
