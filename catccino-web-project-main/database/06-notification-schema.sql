\connect notification_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE notification_type AS ENUM (
    'order_created',
    'payment_confirmed',
    'payment_rejected',
    'order_ready'
);

CREATE TYPE notification_channel AS ENUM (
    'email',
    'sms',
    'push'
);

CREATE TYPE notification_status AS ENUM (
    'pending',
    'sent',
    'failed'
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    order_id UUID NOT NULL,
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    status notification_status NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);