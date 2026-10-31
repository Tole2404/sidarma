> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (4 panggilan):**
- `get_inventory_stock` -> `{}`
- `get_sales_history_and_debts` -> `{"limit":5}`
- `get_bale_market_prices` -> `{}`
- `get_bongkaran_rendemen` -> `{"limit":3}`

Tidak aman. Risiko rugi tinggi.

### Kondisi Stok & Biaya
* **Stok riil:** Majun Putih 0 kg, Majun Warna -200 kg (defisit). Order 3 ton butuh beli bal baru total.
* **Harga modal bal:** Rp 8.400 – Rp 9.800/kg (tergantung varian Putih/Warna, Grade A1/B2/C3).
* **Beban olah:** Belum hitung susut rendemen sortir, ongkos kirim bal, upah tenaga sortir, dan listrik. HPP riil pasti tembus > Rp 9.500 – Rp 10.500/kg.
* **Dampak diskon:** Potongan Rp 500/kg potong kas total Rp 1.500.000. Jika harga jual pakai patokan terakhir (Rp 11.000/kg), harga jatuh ke Rp 10.500/kg. Margin kotor habis tergerus biaya olah.

### Data Belum Lengkap
* Jenis majun pesanan (Putih atau Warna).
* Grade kain target (A1, B2, atau C3).
* Termin pembayaran (tempo tingkatkan risiko kas).

### Langkah Aksi
1. Tolak diskon Rp 500/kg.
2. Konfirmasi varian kain dan termin bayar PT Indofood.
3. Batasi diskon maksimal Rp 150 – Rp 200/kg hanya jika pembayaran tunai di muka (*cash on delivery*).