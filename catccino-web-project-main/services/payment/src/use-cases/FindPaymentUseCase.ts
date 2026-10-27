import type { PaymentResponseDTO } from "@entities/payment/PaymentResponseDTO.js";
import type { IPaymentRepository } from "@repositories/interfaces/IPaymentRepository.js";

class FindPaymentUseCase {
    constructor(private readonly repository: IPaymentRepository) { }

    async execute(id: string): Promise<PaymentResponseDTO> {
        if (!id) throw new Error("Id é obrigatório");

        const payment = await this.repository.findById(id);

        if (!payment) throw new Error("Pagamento não encontrado");

        return {
            id: payment.getId(),
            orderId: payment.getOrderId(),
            method: payment.getMethod(),
            status: payment.getStatus(),
            amount: payment.getAmount(),
            transactionId: payment.getTransactionId(),
            paidAt: payment.getPaidAt(),
            createdAt: payment.getCreatedAt(),
        };
    }
}

export { FindPaymentUseCase };