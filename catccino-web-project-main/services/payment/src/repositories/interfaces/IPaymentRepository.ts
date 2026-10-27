import type { Payment } from "@entities/payment/Payment.js";

export interface IPaymentRepository {
    create(data: Payment): Promise<Payment | null>;
    findById(id: string): Promise<Payment | null>;
    findByOrderId(orderId: string): Promise<Payment | null>;
    update(data: Payment): Promise<Payment | null>;
};

export interface IPaymentFactory {
    createRepository(): IPaymentRepository;
};