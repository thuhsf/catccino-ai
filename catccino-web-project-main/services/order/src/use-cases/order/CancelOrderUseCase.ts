import type { OrderResponseDTO } from "@entities/order/OrderResponseDTO.js";
import type { IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";

class CancelOrderUseCase {
    constructor(private readonly repository: IOrderRepository) { };

    async execute(id: string): Promise<OrderResponseDTO> {
        if (!id) {
            throw new Error("Id é obrigatório");
        }

        const order = await this.repository.findById(id);

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        if (order.getStatus() !== "pending") {
            throw new Error("Apenas pedidos pendentes podem ser cancelados");
        }

        const updatedOrder = await this.repository.updateStatus(order.getId(), "canceled");

        if (!updatedOrder) {
            throw new Error("Falha ao cancelar pedido");
        }

        return {
            id: updatedOrder.getId(),
            customerId: updatedOrder.getCustomerId(),
            status: updatedOrder.getStatus(),
            total: updatedOrder.getTotal(),
            createdAt: updatedOrder.getCreatedAt(),
            updatedAt: updatedOrder.getUpdatedAt(),
        };
    }
};

export { CancelOrderUseCase };