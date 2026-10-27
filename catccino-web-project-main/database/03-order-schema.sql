\connect order_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE order_status AS ENUM (
    'pending',
    'paid',
    'canceled'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_name VARCHAR(120) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
);