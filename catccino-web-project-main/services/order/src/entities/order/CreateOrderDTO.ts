import type { OrderItemRequestDTO } from "@entities/order/order-item/OrderItemRequestDTO.js";

export type CreateOrderRequestDTO = {
    customerId: string;
    items: OrderItemRequestDTO[]
};