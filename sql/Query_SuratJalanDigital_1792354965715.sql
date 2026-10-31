CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    do_number VARCHAR(50) UNIQUE NOT NULL, -- Format: SJ/YYMM/XXXX
    sales_order_id UUID NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', 
    -- Enum: DRAFT, DISPATCHED, IN_TRANSIT, DELIVERED, DISPUTED
    initial_net_kg NUMERIC(10,2) NOT NULL,
    received_net_kg NUMERIC(10,2),
    shrinkage_pct NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN initial_net_kg > 0 AND received_net_kg IS NOT NULL 
        THEN ROUND(((initial_net_kg - received_net_kg) / initial_net_kg) * 100, 2)
        ELSE 0 END
    ) STORED,
    pod_image_url TEXT,
    receiver_name VARCHAR(100),
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID REFERENCES delivery_orders(id) ON DELETE CASCADE,
    product_code VARCHAR(50) NOT NULL, -- Contoh: MAJUN-PUTIH, MAJUN-WARNA-A1
    quantity_bal INT NOT NULL,
    weight_kg NUMERIC(10,2) NOT NULL
);