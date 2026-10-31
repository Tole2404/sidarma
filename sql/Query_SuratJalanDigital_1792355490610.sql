-- Tabel Surat Jalan
CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    do_number VARCHAR(32) UNIQUE NOT NULL, -- Format: SJ/YYYYMM/XXXX
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
    driver_name VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, ASSIGNED, IN_TRANSIT, DELIVERED, RETURNED, CANCELLED
    notes TEXT,
    departure_time TIMESTAMPTZ,
    arrival_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Surat Jalan
CREATE TABLE delivery_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_ordered_kg NUMERIC(10,2) NOT NULL,
    quantity_loaded_kg NUMERIC(10,2) NOT NULL,
    quantity_received_kg NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bukti Terima & Log Status (Tracking)
CREATE TABLE delivery_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id),
    status VARCHAR(20) NOT NULL,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    recipient_name VARCHAR(100),
    signature_url TEXT,
    photo_evidence_url TEXT,
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);