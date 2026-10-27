import type { ArrOrderResponseDTO } from "@entities/order/OrderResponseDTO.js";
import type { IOrderRepository } from "@repositories/interfaces/IOrderRepository.js";

class ListOrderByCustomerUseCase {
    constructor(private readonly repository: IOrderRepository) { };

    async execute(customerId: string): Promise<ArrOrderResponseDTO> {
        if (!customerId) {
            throw new Error("customerId é obrigatório");
        }

        const orders = await this.repository.findByCustomerId(customerId);

        return {
            orders: orders.map((order) => ({
                id: order.getId(),
                customerId: order.getCustomerId(),
                status: order.getStatus(),
                total: order.getTotal(),
                createdAt: order.getCreatedAt(),
                updatedAt: order.getUpdatedAt(),
            })),
        };
    }
}

export { ListOrderByCustomerUseCase };