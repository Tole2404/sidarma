> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (1 panggilan):**
- `get_sales_history_and_debts` -> `{"onlyUnpaid":false,"limit":5}`

### User Story 1: Daftar Invoice & Status Bayar

**Role**: Customer B2B (Pabrik/Bengkel/Toko).  
**Goal**: Lihat daftar riwayat invoice, status (`PAID`, `PARTIAL`, `UNPAID`), nominal total, sisa tagihan (`outstanding`).  
**Reason**: Pantau hutang dagang majun tanpa telepon/chat admin.

#### Acceptance Criteria
- **AC 1.1 (Load Data)**:  
  *Given* Customer login valid.  
  *When* Buka route `/portal/invoices`.  
  *Then* Tabel render list invoice urut tanggal terbaru. Kolom wajib: `saleId`, `date`, `total`, `outstanding`, `status`.
- **AC 1.2 (Filter Status)**:  
  *Given* Data invoice tampil.  
  *When* Customer pilih dropdown filter `UNPAID` atau `PARTIAL`.  
  *Then* Tabel refresh. Hanya tampilkan invoice belum lunas.
- **AC 1.3 (Isolasi Tenant)**:  
  *Given* Customer A login.  
  *When* Query data invoice.  
  *Then* Backend filter strict `customerId = session.customerId`. Data customer B dilarang bocor.

---

### User Story 2: Detail Transaksi & Rincian Majun

**Role**: Tim Keuangan Customer.  
**Goal**: Buka rincian tiap invoice (nama produk majun, volume kg, harga satuan).  
**Reason**: Cocokkan data timbangan surat jalan gudang dengan tagihan masuk.

#### Acceptance Criteria
- **AC 2.1 (View Rincian)**:  
  *Given* Customer klik satu baris invoice (contoh: ID `cmvea2b380003ju7dy5vckmh5`).  
  *When* Halaman/modal detail buka.  
  *Then* Tampil rincian: `product` (Majun Putih / Majun Warna), `quantityKg`, harga/kg, subtotal, riwayat cicilan masuk, sisa tagihan.
- **AC 2.2 (Security Direct URL)**:  
  *Given* Customer A coba tembak URL invoice Customer B: `/portal/invoices/:foreignId`.  
  *When* Request sampai API.  
  *Then* API tolak. Return HTTP `403 Forbidden`. Catat alert access violation.

---

### User Story 3: Unduh Berkas Invoice (PDF)

**Role**: Staf Accounting Customer.  
**Goal**: Download berkas digital invoice resmi format PDF.  
**Reason**: Arsip pembukuan dan lampiran release pembayaran PO.

#### Acceptance Criteria
- **AC 3.1 (Generate PDF)**:  
  *Given* Invoice ada di sistem.  
  *When* Customer klik tombol `Download PDF`.  
  *Then* Sistem panggil `GET /api/portal/invoices/:saleId/pdf`. Unduh file PDF berisi kop resmi CV. SIDARMA MAJUN, nomor invoice, detail kg, total tagihan, rekening tujuan transfer.
- **AC 3.2 (Status Watermark)**:  
  *Given* Status invoice `PAID`.  
  *When* PDF dibuat.  
  *Then* Dokumen tampilkan stempel watermark `LUNAS` otomatis.

---

### Skema Data & Kontrak API

#### Schema Entity (`Sale`)
```json
{
  "saleId": "cmvea2b380003ju7dy5vckmh5",
  "customer": "CV Logam Presisi",
  "date": "2026-10-18",
  "product": "Majun Warna",
  "quantityKg": 200,
  "total": 2200000,
  "outstanding": 2200000,
  "status": "UNPAID"
}
```

#### Endpoints
- `GET /api/portal/invoices` -> Query params: `page`, `limit`, `status`. Filter data by `session.customerId`.
- `GET /api/portal/invoices/:saleId` -> Detail item dan breakdown pembayaran.
- `GET /api/portal/invoices/:saleId/pdf` -> Stream binary PDF invoice resmi.

Lanjut approval PRD ini ke tim Software Engineering untuk implementasi backend/frontend.