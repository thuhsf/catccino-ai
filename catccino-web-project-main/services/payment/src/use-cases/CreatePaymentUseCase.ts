import { Payment } from "@entities/payment/Payment.js";
import type { CreatePaymentRequestDTO } from "@entities/payment/PaymentRequestDTO.js";
import type { PaymentResponseDTO } from "@entities/payment/PaymentResponseDTO.js";
import type { IPaymentRepository } from "@repositories/interfaces/IPaymentRepository.js";

class CreatePaymentUseCase {
    constructor(private readonly repository: IPaymentRepository) { }

    async execute(data: CreatePaymentRequestDTO): Promise<PaymentResponseDTO> {
        const existing = await this.repository.findByOrderId(data.orderId);

        if (existing && existing.getStatus() !== "rejected") {
            throw new Error("Já existe um pagamento ativo para esse pedido");
        }

        const payment = new Payment({
            orderId: data.orderId,
            method: data.method,
            amount: data.amount,
        });

        const created = await this.repository.create(payment);

        if (!created) {
            throw new Error("Falha ao criar pagamento");
        }

        return {
            id: created.getId(),
            orderId: created.getOrderId(),
            method: created.getMethod(),
            status: created.getStatus(),
            amount: created.getAmount(),
            transactionId: created.getTransactionId(),
            paidAt: created.getPaidAt(),
            createdAt: created.getCreatedAt(),
        };
    }
}

export { CreatePaymentUseCase };