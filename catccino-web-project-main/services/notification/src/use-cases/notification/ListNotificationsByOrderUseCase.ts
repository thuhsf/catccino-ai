import type { ArrNotificationResponseDTO } from "@entities/notification/NotificationResponseDTO.js";
import type { INotificationRepository } from "@repositories/interfaces/INotificationRepository.js";

class ListNotificationsByOrderUseCase {
    constructor(private readonly repository: INotificationRepository) { }

    async execute(orderId: string): Promise<ArrNotificationResponseDTO> {
        if (!orderId) throw new Error("OrderId é obrigatório");

        const notifications = await this.repository.findByOrderId(orderId);

        return {
            notifications: notifications.map((n) => ({
                id: n.getId(),
                orderId: n.getOrderId(),
                type: n.getType(),
                channel: n.getChannel(),
                status: n.getStatus(),
                sentAt: n.getSentAt(),
                createdAt: n.getCreatedAt(),
            })),
        };
    }
}

export { ListNotificationsByOrderUseCase };