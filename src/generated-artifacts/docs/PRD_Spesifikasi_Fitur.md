> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (1 panggilan):**
- `get_sales_history_and_debts` -> `{"limit":5}`

# Spesifikasi Fitur: Portal Invoice Customer

Kebutuhan bisnis: Pelanggan pantau tagihan, unduh faktur, percepat pelunasan piutang kain majun.

---

### US-01: Tinjau Daftar Invoice
**Sebagai** pelanggan CV. Sidarma Majun  
**Saya mau** lihat daftar invoice beserta status bayar  
**Supaya** tahu tagihan jatuh tempo dan riwayat belanja  

**Kriteria Penerimaan (Acceptance Criteria):**
- Tampil daftar kolom: Nomor Invoice, Tanggal Transaksi, Jatuh Tempo, Total (Rp), Sisa Piutang (Rp), Status.
- Filter data: Rentang tanggal, status bayar (`PAID`, `PARTIAL`, `UNPAID`).
- Default urutan: Invoice terbaru di atas.
- Indikator: Merah untuk `UNPAID` lewat jatuh tempo, kuning untuk `PARTIAL`, hijau untuk `PAID`.

---

### US-02: Lihat Rincian Invoice
**Sebagai** pelanggan  
**Saya mau** buka rincian barang per invoice  
**Supaya** cocokkan volume timbangan kg kain majun dan harga satuan  

**Kriteria Penerimaan:**
- Tampil breakdown baris: Kode produk, nama barang (Majun Putih / Majun Warna), kuantitas (kg), harga/kg, subtotal.
- Tampil riwayat pembayaran: Tanggal setor, nominal masuk, metode bayar, sisa piutang.
- Tampil instruksi rekening transfer bank resmi CV. Sidarma Majun.

---

### US-03: Unduh Berkas PDF Faktur
**Sebagai** pelanggan  
**Saya mau** cetak atau unduh invoice format PDF  
**Supaya** punya bukti fisik arsip pembukuan kantor  

**Kriteria Penerimaan:**
- Tombol `Unduh PDF` respon cepat (< 2 detik).
- PDF berisi: Kop CV. Sidarma Majun, nomor SO, rincian kg majun, cap lunas otomatis jika status `PAID`.
- Format nama file: `INV-[NO_INVOICE]-[TANGGAL].pdf`.

---

### US-04: Kirim Bukti Pembayaran
**Sebagai** pelanggan  
**Saya mau** upload bukti transfer pelunasan  
**Supaya** finance Sidarma verifikasi transaksi tanpa konfirmasi WhatsApp manual  

**Kriteria Penerimaan:**
- Form upload terima file format JPG, PNG, PDF. Ukuran maks 5 MB.
- Form input: Tanggal bayar, nominal transfer, nama bank pengirim.
- Submit sukses ubah status invoice jadi `WAITING_CONFIRMATION`.
- Trigger alert otomatis ke sistem finance Sidarma.

---

### Matriks Prioritas

| ID | Modul | Prioritas | Kompleksitas |
|---|---|---|---|
| US-01 | List Invoice & Filter | P0 (Wajib) | Rendah |
| US-02 | Detail Muatan Majun & Debt Log | P0 (Wajib) | Sedang |
| US-03 | Engine Generate PDF | P1 (Penting) | Sedang |
| US-04 | Upload Bukti Bayar | P1 (Penting) | Sedang |

Tahap lanjut: Lanjut ke spesifikasi skema API dan kontrak JSON endpoint.