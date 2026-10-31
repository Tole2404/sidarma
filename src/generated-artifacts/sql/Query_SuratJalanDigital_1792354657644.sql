CREATE TABLE fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20),
    max_capacity_kg NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    do_number VARCHAR(32) UNIQUE NOT NULL,
    sales_order_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', 
    -- Valid status: DRAFT, LOADED, IN_TRANSIT, DELIVERED, RETURNED_PARTIAL, CANCELLED
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    pod_image_url TEXT,
    receiver_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    product_code VARCHAR(50) NOT NULL,
    qty_kg NUMERIC(10, 2) NOT NULL CHECK (qty_kg > 0),
    rejected_kg NUMERIC(10, 2) DEFAULT 0 CHECK (rejected_kg >= 0),
    notes VARCHAR(255)
);

CREATE INDEX idx_do_sales_order ON delivery_orders(sales_order_id);
CREATE INDEX idx_do_status ON delivery_orders(status);