> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (1 panggilan):**
- `get_sales_history_and_debts` -> `{"limit":5,"onlyUnpaid":false}`

# PRD: Portal Pelanggan - Riwayat Invoice

Dokumentasi spesifikasi fitur portal pelanggan mandiri cek faktur dan piutang kain majun.

---

### US-01: Akses Daftar Invoice & Status Piutang
Sebagai pelanggan (toko/pabrik),  
Saya ingin lihat daftar seluruh invoice transaksi kain majun,  
Agar pantau kewajiban bayar dan batas jatuh tempo tanpa tanya admin.

**Kriteria Penerimaan (Acceptance Criteria):**
- Tampil tabel daftar invoice dengan kolom:
  - Nomor Invoice (format: `INV-YYYYMMDD-XXXX`)
  - Tanggal Terbit & Tanggal Jatuh Tempo (TOP)
  - Total Nilai Tagihan (IDR)
  - Jumlah Terbayar (IDR)
  - Sisa Piutang (IDR)
  - Status Tagihan (`PAID`, `PARTIAL`, `UNPAID`)
- Urutan default: Tanggal transaksi terbaru di atas (`DESC`).
- Badge warna status: Hijau (`PAID`), Kuning (`PARTIAL`), Merah (`UNPAID`).

---

### US-02: Filter dan Pencarian Invoice
Sebagai tim purchasing/finance pelanggan,  
Saya ingin saring invoice berdasar status bayar dan periode tanggal,  
Agar cepat temukan faktur spesifik untuk rekonsiliasi bulanan.

**Kriteria Penerimaan (Acceptance Criteria):**
- Dropdown saring status: `Semua Status`, `UNPAID`, `PARTIAL`, `PAID`.
- Date range picker: `Tanggal Awal` sampai `Tanggal Akhir`.
- Input pencarian: Match parsial nomor invoice.
- Tombol reset filter balik ke tampilan default.
- Pesan kosong: Tampil "Invoice tidak ditemukan" jika filter nihil hasil.

---

### US-03: Detail Rincian Barang & Riwayat Pembayaran
Sebagai pelanggan,  
Saya ingin klik invoice untuk lihat rincian muatan dan mutasi pembayaran,  
Agar verifikasi kecocokan timbangan kilogram kain majun fisik.

**Kriteria Penerimaan (Acceptance Criteria):**
- Tampil informasi kepala: Nama Toko/Pelanggan, Alamat Kirim, Term of Payment (TOP).
- Tabel item produk:
  - Kode & Nama Produk (contoh: Majun Putih A1, Majun Warna Jahit Tumpuk)
  - Kuantitas (kg)
  - Harga satuan per kg (IDR)
  - Subtotal (IDR)
- Ringkasan kalkulasi: Subtotal, Ongkir, PPN (jika ada), Grand Total.
- Tabel mutasi bayar parsial:
  - Tanggal Bayar
  - Metode (Transfer Bank / Tunai)
  - Nominal Masuk (IDR)
  - Sisa Tagihan Berjalan (IDR)

---

### US-04: Unduh Arsip PDF Invoice & Bukti Potong
Sebagai finance pelanggan,  
Saya ingin unduh cetakan faktur format PDF resmi,  
Agar bisa dicetak untuk arsip pembukuan internal.

**Kriteria Penerimaan (Acceptance Criteria):**
- Tombol `Unduh PDF` di halaman detail invoice.
- Layout PDF memuat:
  - Header resmi CV. SIDARMA MAJUN (logo, alamat, kontak Bandung).
  - Detail timbangan kg, harga per kg, dan total bayar.
  - Watermark otomatis `LUNAS` jika sisa tagihan 0 (`PAID`).
  - Rekening tujuan transfer resmi perusahaan.
- Response time unduh berkas `< 2 detik`.

---

### Batasan Teknis & Keamanan (Non-Functional Requirements)

1. **Autentikasi & Otorisasi:**
   - Auth pakai JWT / Magic Link nomor WhatsApp terdaftar.
   - Hak akses strictly scoped ke `customer_id` aktif. Enforce row-level security di API; cegah IDOR. Pelanggan A dilarang akses invoice Pelanggan B via ganti parameter URL.

2. **Skema Database Relevan:**
   - `customers` (`id`, `name`, `phone`, `credit_limit`)
   - `sales_orders` (`id`, `customer_id`, `order_date`, `status`)
   - `invoices` (`id`, `order_id`, `invoice_no`, `due_date`, `total_amount`, `paid_amount`, `status`)
   - `invoice_items` (`id`, `invoice_id`, `product_id`, `weight_kg`, `price_per_kg`, `subtotal`)
   - `payments` (`id`, `invoice_id`, `paid_at`, `amount`, `payment_method`)

3. **Performa:**
   - Paginasi data invoice 10 baris per halaman.
   - Indexing database pada kolom `customer_id`, `status`, dan `due_date`.