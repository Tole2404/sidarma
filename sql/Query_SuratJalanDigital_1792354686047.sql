CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sj_number VARCHAR(32) UNIQUE NOT NULL,
    sales_order_id UUID NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    vehicle_plate VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT, DISPATCHED, IN_TRANSIT, DELIVERED, CANCELLED
    departure_time TIMESTAMP WITH TIME ZONE,
    delivered_time TIMESTAMP WITH TIME ZONE,
    pod_photo_url TEXT,
    signature_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);