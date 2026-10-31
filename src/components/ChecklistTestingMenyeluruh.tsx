> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

### 1. Unit & Edge Cases (Jest)
- Input minus: Uji kuantitas < 0 (contoh: `-200 kg`). Sistem wajib tolak via validation schema (Zod/Joi). Status HTTP 400.
- Stok nol: Uji checkout stok = 0. Transaksi wajib diblokir. Cegah stok defisit.
- Tipe data liar: Kirim payload `null`, `undefined`, string pada kolom numerik (`pricePerKg`, `quantityKg`). Validasi wajib potong sebelum query DB.
- Presisi desimal: Uji kalkulasi HPP dan rendemen susut bal limbah. Hindari selisih floating-point pembulatan.
- Jest coverage: Target minimum coverage logic bisnis 85%. Jalankan `jest --coverage`.

### 2. Integritas Database & Transaksi
- ACID Transaction: Uji kegagalan di tengah flow draf pesanan. Verifikasi DB eksekusi `ROLLBACK`. Cegah data orphan.
- DB Constraint: Pastikan kolom stok punya constraint `CHECK (stock_qty >= 0)`.
- Idempotency: Kirim payload sama berulang kali dengan `Idempotency-Key` identik. Sistem hanya proses 1 kali. Tolak duplikasi transaksi.

### 3. Concurrency & Race Condition
- Stok race condition: Tembak 2 request order paralel untuk sisa stok terakhir (contoh: k6 / autocannon). Pastikan implementasi `SELECT FOR UPDATE` atau atomic decrement `UPDATE ... WHERE stock >= qty`. 1 transaksi sukses, 1 transaksi gagal.

### 4. Otorisasi & Workflow Approval
- Access control: Endpoint sensitif wajib verifikasi JWT dan role. Non-admin dilarang trigger perubahan status final.
- Gatekeeper audit: Operasi berdampak finansial (ubah HPP, buat PO bal) wajib masuk status pending approval.
- Audit trail: Verifikasi log audit mencatat `user_id`, `action`, `old_value`, `new_value`, `timestamp`.

### 5. API & Kontrak Data
- Payload schema: Response API wajib konsisten. Kolom krusial tidak boleh hilang saat data bernilai `null`.
- HTTP status code: Pastikan implementasi 200/201 (sukses), 400 (bad input), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict stok), 422 (business rule violation).

### 6. Migrasi DB & Rollback Plan
Multi-step ordered sequence:
1. Jalankan skrip migrasi database `up` pada database staging/clone.
2. Verifikasi seluruh foreign key, index baru, dan constraint aktif tanpa lock tabel berlebih.
3. Jalankan skrip migrasi `down` (rollback) di staging. Pastikan skema kembali ke kondisi awal tanpa data corrupt.
4. Terapkan kembali migrasi `up` sebelum uji smoke test.

### 7. Smoke Testing Produksi
- Endpoint `/health`: Verifikasi koneksi pool PostgreSQL dan worker task aktif.
- Read-only check: Verifikasi query list inventory, harga pasar bal, dan histori transaksi berfungsi normal pasca migrasi.