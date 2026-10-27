export type OrderRow = {
    id: string;
    customer_id: string;
    status: "pending" | "paid" | "canceled";
    total: number;
    created_at: Date;
    updated_at: Date;
};

export type OrderItemRow = {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    created_at: Date;
};