### 🧭 PRODUCT REQUIREMENT DOCUMENT (PRD)
**Nama Fitur:** Digital Surat Jalan & Dispatch Tracking System
**Status:** Ready for Engineering Review | **Prioritas:** P1 (High Impact)

#### 1. Latar Belakang Masalah:
Sopir truk pengantar sering kesulitan mengonfirmasi tanda terima barang dari pabrik pembeli. Masih memakai kertas fisik yang rentan hilang atau basah di jalan.

#### 2. User Stories:
- **Sebagai Sopir Truk:** Saya bisa membuka link surat jalan di HP dan meminta tanda tangan digital / foto bukti bongkar dari kepala gudang pabrik.
- **Sebagai Admin Penjualan:** Saya langsung mendapat notifikasi status pesanan berubah menjadi *"DELIVERED / SELESAI"* secara realtime di dashboard.

#### 3. Acceptance Criteria:
1. Tombol *"Generate Digital Surat Jalan"* muncul di setiap transaksi Penjualan (`/sales`).
2. Terdapat halaman publik tanda terima dengan fitur upload foto stempel pabrik.
3. Estimasi waktu pengerjaan: 2 hari kerja sprint.