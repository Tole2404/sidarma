gherkin
Scenario: Buat draft surat jalan
Given Sales Order status "APPROVED"
When Admin klik "Buat Surat Jalan"
And Input nomor plat truk, nama supir, estimasi muat
Then Sistem buat record baru di delivery_orders dengan status "DRAFT"
And Sistem generate nomor SJ unik format "SJ-YYYYMM-XXXX"
And Sistem generate QR Code SJ