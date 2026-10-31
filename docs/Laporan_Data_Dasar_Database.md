> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (4 panggilan):**
- `get_bale_market_prices` -> `{"clothType":"PUTIH"}`
- `get_bongkaran_rendemen` -> `{"limit":3}`
- `get_inventory_stock` -> `{"productNameOrCode":"PUTIH"}`
- `delegate_task_to_agent` -> `{"taskPrompt":"Berapa berat standar per bal limbah kain putih (kg), biaya operasional bongkar/sortir, dan estimasi rendemen jika data historis bongkaran di DB masih kosong?","targetAgentId":"bale-scorer"}`

### Data Dasar Database

* **Stok Majun Putih**: 0 kg (HPP tercatat DB: Rp 0).
* **Histori bongkaran riil**: Kosong (0 partai).
* **Harga bal putih terakhir**:
  * Grade C3: Rp 840.000/bal
  * Grade B2: Rp 900.000/bal
  * Grade A1: Rp 950.000/bal

### Parameter Acuan Konveksi

* Berat standar: 100 kg/bal.
* Biaya operasional (bongkar, sortir, listrik): Rp 750/kg bal (Rp 75.000/bal).
* Rendemen sortir putih: 80% – 85% (80 – 85 kg hasil). Susut 15% – 20%.

### Formula HPP Riil

$$\text{HPP Riil per kg} = \frac{\text{Harga Beli Bal} + \text{Biaya Sortir}}{\text{Berat Bal} \times \text{Rendemen}}$$

### Hasil Kalkulasi HPP Riil Majun Putih

| Grade Bal | Modal Bal + Ops (Rp) | Rendemen 85% (85 kg) | Rendemen 80% (80 kg) | Min. Jual (Margin 20%) |
| :--- | :--- | :--- | :--- | :--- |
| **Putih C3** | Rp 915.000 | **Rp 10.765/kg** | **Rp 11.438/kg** | Rp 13.500 – Rp 14.300/kg |
| **Putih B2** | Rp 975.000 | **Rp 11.471/kg** | **Rp 12.188/kg** | Rp 14.400 – Rp 15.300/kg |
| **Putih A1** | Rp 1.025.000 | **Rp 12.059/kg** | **Rp 12.813/kg** | Rp 15.100 – Rp 16.100/kg |

Input data bongkaran partai perdana ke sistem. Kalibrasi HPP dengan rendemen riil lapangan.