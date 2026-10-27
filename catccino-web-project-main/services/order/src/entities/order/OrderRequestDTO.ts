type OrderStatus = "pending" | "paid" | "canceled";

export type OrderRequestDTO = {
    id?: string;
    customerId: string;
    status: OrderStatus;
    total: number;
};