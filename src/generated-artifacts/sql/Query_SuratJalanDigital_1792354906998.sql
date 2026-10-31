CREATE TYPE delivery_status AS ENUM (
  'DRAFT',
  'DISPATCHED',
  'IN_TRANSIT',
  'DELIVERED',
  'RECONCILED',
  'CANCELLED'
);

CREATE TABLE delivery_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sj_number VARCHAR(32) NOT NULL UNIQUE,
  sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
  truck_plate_number VARCHAR(16) NOT NULL,
  driver_name VARCHAR(64) NOT NULL,
  driver_phone VARCHAR(20) NOT NULL,
  warehouse_weight_kg NUMERIC(10,2) NOT NULL,
  received_weight_kg NUMERIC(10,2),
  pod_image_url TEXT,
  status delivery_status NOT NULL DEFAULT 'DRAFT',
  dispatch_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE delivery_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
  product_code VARCHAR(32) NOT NULL,
  bale_count INT NOT NULL DEFAULT 0,
  weight_kg NUMERIC(10,2) NOT NULL
);

CREATE TABLE delivery_tracking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
  status delivery_status NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);