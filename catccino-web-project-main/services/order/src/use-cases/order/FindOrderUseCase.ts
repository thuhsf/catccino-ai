import type { OrderResponseDTO } from "@entities/order/OrderResponseDTO.js";
import type { IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";

class FindOrderUseCase {

    constructor(private readonly repository: IOrderRepository) { };

    async execute(id: string): Promise<OrderResponseDTO> {
        if (!id) {
            throw new Error("Id é obrigatório");
        };

        const order = await this.repository.findById(id);

        if (!order) {
            throw new Error("Pedido não encontrado");
        };

        return {
            id: order.getId(),
            customerId: order.getCustomerId(),
            status: order.getStatus(),
            total: order.getTotal(),
            createdAt: order.getCreatedAt(),
            updatedAt: order.getUpdatedAt()
        };
    }
};

export { FindOrderUseCase };