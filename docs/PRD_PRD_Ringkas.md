> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (1 panggilan):**
- `get_sales_history_and_debts` -> `{"limit":5,"onlyUnpaid":false}`

# PRD Ringkas: Portal Customer - Riwayat Invoice

## US-01: Tampil Daftar & Status Tagihan
**Sebagai** customer CV. Sidarma Majun  
**Saya butuh** lihat tabel daftar invoice dan status bayar  
**Tujuan** pantau total sisa utang dan tanggal jatuh tempo  

### Acceptance Criteria
- Sistem tampilkan list: `invoice_number`, `invoice_date`, `due_date`, `total_amount`, `paid_amount`, `balance_due`, `status`.
- Badge status: `PAID` (hijau), `PARTIAL` (kuning), `UNPAID` (abu-abu), `OVERDUE` (merah).
- Kondisi `OVERDUE`: tanggal sistem > `due_date` dan `balance_due` > 0.
- Pagination: 10 data per halaman. Default urut `invoice_date DESC`.

---

## US-02: Filter & Pencarian Invoice
**Sebagai** tim admin/pembukuan customer  
**Saya butuh** filter invoice berdasar status bayar, rentang tanggal, nomor dokumen  
**Tujuan** rekonsiliasi data belanja kain majun cepat beres  

### Acceptance Criteria
- Dropdown status: All, `PAID`, `PARTIAL`, `UNPAID`, `OVERDUE`.
- Date range picker: `start_date` dan `end_date`.
- Input search: query teks cocokkan string `invoice_number` atau `delivery_order_number`.
- Empty state: pesan "Invoice tidak ditemukan" jika hasil query nol.

---

## US-03: Cek Detail Rincian Muatan & Riwayat Bayar
**Sebagai** customer  
**Saya butuh** buka rincian per invoice  
**Tujuan** verifikasi timbangan kg majun dan log cicilan pembayaran  

### Acceptance Criteria
- Klik baris invoice buka halaman/modal detail.
- Breakdown item tampil:
  - Nama produk (`Majun Putih Super`, `Majun Warna Jahit Sambung`, etc.)
  - Berat riil (`quantity_kg`)
  - Harga per kg (`price_per_kg`)
  - Subtotal per baris
- Tabel log pembayaran: `payment_date`, `amount`, `payment_method`, `ref_number`.
- Tampil nomor rekening resmi CV. Sidarma Majun untuk tagihan belum lunas.

---

## US-04: Unduh Salinan PDF Invoice & Kwitansi
**Sebagai** akuntan customer  
**Saya butuh** download file PDF invoice resmi  
**Tujuan** arsip pajak dan bukti lampiran pengajuan kas keluar  

### Acceptance Criteria
- Tombol "Download PDF" generate file instan.
- Header dokumen PDF muat kop CV. Sidarma Majun, stempel digital, info jatuh tempo, detail rekening.
- Tombol "Export Excel" unduh list rekap invoice sesuai filter aktif.

---

## Technical Notes & API Contracts

### Endpoints
- `GET /api/v1/customer-portal/invoices`
  - Query params: `page`, `limit`, `status`, `from_date`, `to_date`, `search`
- `GET /api/v1/customer-portal/invoices/:invoice_id`
- `GET /api/v1/customer-portal/invoices/:invoice_id/download-pdf`

### Security Rule
- Auth: JWT token customer.
- Wajib validasi scope `tenant_id` / `customer_id` di query DB. Cegah vulnerability IDOR lintas pembeli. Saldo piutang hanya tarik milik token aktif.