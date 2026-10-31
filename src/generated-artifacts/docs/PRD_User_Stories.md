> ⚡ **Diproses Langsung Melalui 9Router (ag/gemini-3.8-flash-high)**

# User Stories: Portal Customer - Riwayat Invoice

### Data Terkait
- Entitas: `customers`, `invoices`, `invoice_items`, `payments`.
- Produk terkait: Bal (WARNA C3, WARNA B2, WARNA A1, PUTIH C3), Majun kiloan (Putih, Warna).

---

### US-01: List Riwayat Invoice
- **Aktor**: Customer terdaftar.
- **Aksi**: Buka menu riwayat invoice di web portal.
- **Tujuan**: Monitor transaksi beli bal majun dan status bayar.

#### Acceptance Criteria
```gherkin
Scenario: Customer filter invoice belum lunas
  Given Customer login ke portal
  When Customer akses endpoint "/portal/invoices"
  And Customer pilih filter status "UNPAID"
  Then Sistem tampilkan daftar invoice dengan status "UNPAID"
  And Kolom tampil: No Invoice, Tanggal, Jatuh Tempo, Total (Rp), Sisa Tagihan (Rp), Status
```

- Data urut tanggal terbaru (`created_at DESC`).
- Status valid: `PAID`, `PARTIAL`, `UNPAID`, `OVERDUE`.
- Paginasi: 10 data per halaman.

---

### US-02: Detail Item Invoice
- **Aktor**: Customer.
- **Aksi**: Klik baris invoice spesifik.
- **Tujuan**: Cek rincian kuantiti bal/kiloan dan harga per unit.

#### Acceptance Criteria
```gherkin
Scenario: Customer buka rincian invoice
  Given Customer di halaman list invoice
  When Customer klik "INV-2024-XXXX"
  Then Sistem tampilkan breakdown pesanan
  And Rincian berisi: Nama Produk (contoh: WARNA A1 Rp 980.000/bal), Jumlah (Bal/Kg), Subtotal
  And Sistem tampilkan histori pembayaran masuk untuk invoice terkait
```

- Query ambil data dari `invoice_items` join `products`.
- Tampil catatan nomor rekening transfer CV. SIDARMA MAJUN jika tagihan belum lunas.

---

### US-03: Unduh PDF Invoice
- **Aktor**: Customer.
- **Aksi**: Klik tombol unduh PDF pada invoice.
- **Tujuan**: Arsip fisik dan bukti audit akuntansi customer.

#### Acceptance Criteria
```gherkin
Scenario: Customer unduh file PDF
  Given Customer di halaman detail invoice
  When Customer klik "Download PDF"
  Then Sistem generate PDF sesuai template resmi CV. SIDARMA MAJUN
  And File berisi kop surat, rincian bal majun, total tagihan, QR verifikasi
  And Jika status "PAID", watermark "LUNAS" tercetak otomatis
```

- Format nama file: `INV-[NOMOR_INVOICE]-[NAMA_CUSTOMER].pdf`.
- Respon HTTP header: `Content-Type: application/pdf`.

---

### Matriks Prioritas

| Story ID | Fitur | Prioritas | Kompleksitas | Dependensi API |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | List & Filter Invoice | P0 (Must) | Rendah | `GET /api/v1/portal/invoices` |
| **US-02** | Detail Item & Rekap Bayar | P0 (Must) | Sedang | `GET /api/v1/portal/invoices/:id` |
| **US-03** | Cetak / Ekspor PDF | P1 (Should) | Sedang | `GET /api/v1/portal/invoices/:id/pdf` |

Langkah lanjut: Buat skema migrasi tabel `invoices` dan endpoint backend.