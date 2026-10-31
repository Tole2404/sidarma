-- Status Faktur
CREATE TYPE invoice_status AS ENUM ('UNPAID', 'PARTIAL', 'PAID', 'OVERDUE');

-- Tabel Utama Faktur
CREATE TABLE customer_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
    status invoice_status NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rincian Item Kain Majun
CREATE TABLE customer_invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES customer_invoices(id) ON DELETE CASCADE,
    product_code VARCHAR(30) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(10,2) NOT NULL,
    price_per_kg NUMERIC(12,2) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL
);

-- Log Penerimaan Pembayaran
CREATE TABLE customer_invoice_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES customer_invoices(id) ON DELETE RESTRICT,
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_paid NUMERIC(14,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100)
);

CREATE INDEX idx_invoices_cust_status ON customer_invoices(customer_id, status);
CREATE INDEX idx_invoices_due_date ON customer_invoices(due_date);