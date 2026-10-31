> ⚡ **Diproses Otonom Melalui 9Router ReAct (ag/gemini-3.8-flash-high)**

> 🛠️ **Operasi Tool Grounding (2 panggilan):**
- `get_sales_history_and_debts` -> `{"onlyUnpaid":true}`
- `get_sales_history_and_debts` -> `{"onlyUnpaid":false,"limit":20}`

CV Mandiri Perkasa nihil di database piutang. Database hanya catat piutang CV Logam Presisi (Rp 2.200.000, ID `cmvea2b380003ju7dy5vckmh5`).

Draf pesan WhatsApp:

```text
Yth. Manajemen CV Mandiri Perkasa,

Pengingat jatuh tempo pembayaran invoice CV. Sidarma Majun.

Rincian:
- No. Invoice : [NOMOR_INVOICE]
- Jatuh Tempo : [TANGGAL_JATUH_TEMPO]
- Total Tagihan: Rp [NOMINAL]

Pembayaran transfer bank:
Bank: BCA
No. Rekening: [NOMOR_REKENING]
A/N: CV Sidarma Majun

Kirim bukti transfer via chat ini. Abaikan pesan jika sudah bayar.

Hormat kami,
Divisi Keuangan CV. Sidarma Majun
```

Kirim nomor faktur dan nominal riil jika ingin draf diisi data fix.