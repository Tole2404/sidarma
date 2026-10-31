CREATE TYPE delivery_status AS ENUM (
  'DRAFT',
  'ASSIGNED',
  'IN_TRANSIT',
  'ARRIVED',
  'DELIVERED',
  'FAILED'
);

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sj_number VARCHAR(32) UNIQUE NOT NULL, -- Format: SJ/YYYYMM/XXXX
  sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
  driver_name VARCHAR(100) NOT NULL,
  driver_phone VARCHAR(20) NOT NULL,
  vehicle_plate VARCHAR(15) NOT NULL, -- Nopol truk
  tare_weight_kg NUMERIC(10,2) DEFAULT 0, -- Berat kosong truk
  gross_weight_kg NUMERIC(10,2) DEFAULT 0, -- Berat isi truk
  net_weight_kg NUMERIC(10,2) GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
  departure_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  status delivery_status NOT NULL DEFAULT 'DRAFT',
  recipient_name VARCHAR(100),
  pod_signature_url TEXT,
  pod_photo_url TEXT,
  dispute_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE delivery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  product_code VARCHAR(30) NOT NULL, -- MAJUN_PUTIH / MAJUN_WARNA
  qty_bal INT NOT NULL DEFAULT 0,
  shipped_weight_kg NUMERIC(10,2) NOT NULL,
  received_weight_kg NUMERIC(10,2),
  notes TEXT
);

CREATE TABLE delivery_tracking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  status delivery_status NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliveries_sj ON deliveries(sj_number);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_tracking_delivery_id ON delivery_tracking_logs(delivery_id);