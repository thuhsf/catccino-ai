type OrderStatus = "pending" | "paid" | "canceled";

export type OrderResponseDTO = {
    id?: string;
    customerId: string;
    status: OrderStatus;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface ArrOrderResponseDTO {
    orders: OrderResponseDTO[];
};