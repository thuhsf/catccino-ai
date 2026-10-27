export interface OrderItemResponseDTO {
    orderId?: string;
    productid: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
};

export interface ArrOrderItemResponseDTO {
    orders_items: OrderItemResponseDTO[]
};