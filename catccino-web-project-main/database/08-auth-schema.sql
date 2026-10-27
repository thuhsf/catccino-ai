\connect auth_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE auth_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID NOT NULL UNIQUE,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
