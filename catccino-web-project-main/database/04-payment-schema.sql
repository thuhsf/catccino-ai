\connect payment_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE payment_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE payment_method AS ENUM (
    'credit_card',
    'debit_card',
    'pix'
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL,
    method payment_method NOT NULL,
    status payment_status NOT NULL DEFAULT 'pending',
    amount DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(120),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);