\connect menu_db;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(60) NOT NULL,
    slug VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID NOT NULL,
    available BOOLEAN DEFAULT true,
    image_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
);