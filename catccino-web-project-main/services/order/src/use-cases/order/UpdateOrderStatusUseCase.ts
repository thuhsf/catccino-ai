import type { IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";
import type { OrderResponseDTO } from "@entities/order/OrderResponseDTO.js";
import type { UpdateOrderStatusRequestDTO } from "@entities/order/UpdateOrderStatusRequestDTO.js";

class UpdateOrderStatusUseCase {
    constructor(private readonly repository: IOrderRepository) { };


    async execute(data: UpdateOrderStatusRequestDTO): Promise<OrderResponseDTO> {
        if (!data.id) {
            throw new Error("Id é obrigatório");
        }

        const order = await this.repository.findById(data.id);

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        if (order.getStatus() === "canceled") {
            throw new Error("Pedidos cancelados não podem ser atualizados");
        }

        if (order.getStatus() === data.status) {
            throw new Error(`Pedido já está com status "${data.status}"`);
        }

        const updatedOrder = await this.repository.updateStatus(order.getId(), data.status);

        if (!updatedOrder) {
            throw new Error("Falha ao atualizar status do pedido");
        }

        return {
            id: updatedOrder.getId(),
            customerId: updatedOrder.getCustomerId(),
            status: updatedOrder.getStatus(),
            total: updatedOrder.getTotal(),
            createdAt: updatedOrder.getCreatedAt(),
            updatedAt: updatedOrder.getUpdatedAt(),
        };

    };
};

export { UpdateOrderStatusUseCase };