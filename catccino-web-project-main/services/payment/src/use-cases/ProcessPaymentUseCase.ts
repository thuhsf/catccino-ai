import type { PaymentResponseDTO } from "@entities/payment/PaymentResponseDTO.js";
import type { IPaymentRepository } from "@repositories/interfaces/IPaymentRepository.js";
import type { Producer } from "kafkajs";

interface ProcessPaymentRequestDTO {
    paymentId: string;
    transactionId: string;
    approved: boolean;
}

class ProcessPaymentUseCase {
    constructor(
        private readonly repository: IPaymentRepository,
        private readonly producer: Producer
    ) { }

    async execute(data: ProcessPaymentRequestDTO): Promise<PaymentResponseDTO> {
        const payment = await this.repository.findById(data.paymentId);

        if (!payment) {
            throw new Error("Pagamento não encontrado");
        }

        if (data.approved) {
            payment.approve(data.transactionId);
        } else {
            payment.reject();
        }

        const updated = await this.repository.update(payment);

        if (!updated) {
            throw new Error("Falha ao processar pagamento");
        }

        // publica o evento que o order service consome
        const topic = data.approved ? "payment.confirmed" : "payment.rejected";

        await this.producer.send({
            topic,
            messages: [
                {
                    key: updated.getOrderId(),
                    value: JSON.stringify({
                        orderId: updated.getOrderId(),
                        paymentId: updated.getId(),
                        amount: updated.getAmount(),
                        status: updated.getStatus(),
                    }),
                },
            ],
        });

        return {
            id: updated.getId(),
            orderId: updated.getOrderId(),
            method: updated.getMethod(),
            status: updated.getStatus(),
            amount: updated.getAmount(),
            transactionId: updated.getTransactionId(),
            paidAt: updated.getPaidAt(),
            createdAt: updated.getCreatedAt(),
        };
    }
}

export { ProcessPaymentUseCase };
export type { ProcessPaymentRequestDTO };