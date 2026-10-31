[Meta WA Cloud API] 
       │ 
 (POST Webhook: Event Pesan/Status)
       ▼
[Nginx / Cloudflare] 
       │ (TLS 1.3)
       ▼
[FastAPI / Node.js Backend: /api/v1/whatsapp/webhook]
       │
 ┌─────┴─────────────────────────────────┐
 │ 1. Validasi HMAC-SHA256               │
 │ 2. Cek Idempotensi (Redis: wamid)     │
 │ 3. Dispatch Background Job (RabbitMQ) │
 └─────┬─────────────────────────────────┘
       │
       ▼
[Worker / DB PostgreSQL: wa_messages_in & wa_messages_out]