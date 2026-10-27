import type { PaymentMethod } from "@entities/payment/Payment.js";

export interface CreatePaymentRequestDTO {
    orderId: string;
    method: PaymentMethod;
    amount: number;
};