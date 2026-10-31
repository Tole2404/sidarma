[Meta Cloud API] 
       │
       ▼ (Webhook Events)
[Nginx Reverse Proxy]
       │
       ▼
[Webhook Endpoint: /api/v1/wa/webhook]
       │
  (Validasi Signature)
       │
       ▼
[Redis / BullMQ Queue] ──► [Worker Consumer] ──► [PostgreSQL: wa_messages]
                                                       │
                                                       ▼
                                            [ERP Transaction Update]