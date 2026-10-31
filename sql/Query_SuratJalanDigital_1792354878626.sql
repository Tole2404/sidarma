CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    do_number VARCHAR(50) UNIQUE NOT NULL,
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
    driver_name VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    dispatch_weight_kg NUMERIC(10,2) NOT NULL,
    received_weight_kg NUMERIC(10,2),
    weight_discrepancy_kg NUMERIC(10,2) GENERATED ALWAYS AS (dispatch_weight_kg - received_weight_kg) STORED,
    pod_photo_url TEXT,
    receiver_name VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, LOADED, DISPATCHED, DELIVERED, RETURNED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    product_code VARCHAR(50) NOT NULL,
    quantity_kg NUMERIC(10,2) NOT NULL,
    bale_count INT DEFAULT 0
);

CREATE TABLE delivery_tracking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_order_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);