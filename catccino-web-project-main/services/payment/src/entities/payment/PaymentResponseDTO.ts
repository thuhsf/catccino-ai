import type { PaymentMethod, PaymentStatus } from "@entities/payment/Payment.js";

export interface PaymentResponseDTO {
    id: string;
    orderId: string;
    method: PaymentMethod;
    status: PaymentStatus;
    amount: number;
    transactionId?: string;
    paidAt?: Date | null;
    createdAt: Date;
};

export interface ArrPaymentResponseDTO {
    payments: PaymentResponseDTO[];
};