CREATE TYPE delivery_status AS ENUM (
  'DRAFT', 
  'LOADED', 
  'IN_TRANSIT', 
  'DELIVERED', 
  'COMPLETED', 
  'DISPUTED'
);

CREATE TABLE delivery_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(32) UNIQUE NOT NULL, -- SJ-YYYYMM-XXXX
  sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
  driver_name VARCHAR(100) NOT NULL,
  driver_phone VARCHAR(20) NOT NULL,
  vehicle_plate VARCHAR(15) NOT NULL,
  tara_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  bruto_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0,
  netto_weight_kg NUMERIC(10,2) GENERATED ALWAYS AS (bruto_weight_kg - tara_weight_kg) STORED,
  received_weight_kg NUMERIC(10,2),
  status delivery_status NOT NULL DEFAULT 'DRAFT',
  pod_image_url TEXT,
  departure_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_note_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_note_id UUID NOT NULL REFERENCES delivery_notes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  qty_kg NUMERIC(10,2) NOT NULL,
  bale_count INT DEFAULT 0
);