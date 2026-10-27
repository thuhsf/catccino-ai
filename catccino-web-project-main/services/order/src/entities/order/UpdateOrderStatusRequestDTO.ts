type OrderStatus = "pending" | "paid" | "canceled";

export interface UpdateOrderStatusRequestDTO {
    id: string;
    status: OrderStatus;
}