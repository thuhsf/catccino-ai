export type PaymentRow = {
    id: string;
    order_id: string;
    method: "credit_card" | "debit_card" | "pix";
    status: "pending" | "approved" | "rejected";
    amount: string;
    transaction_id: string | null;
    paid_at: Date | null;
    created_at: Date;
};