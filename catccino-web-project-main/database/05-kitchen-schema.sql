\connect kitchen_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE ticket_status AS ENUM (
    'pending',
    'preparing',
    'ready',
    'delivered'
);

CREATE TABLE kitchen_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL UNIQUE,
    status ticket_status NOT NULL DEFAULT 'pending',
    priority SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ NULL,
    finished_at TIMESTAMPTZ NULL
);