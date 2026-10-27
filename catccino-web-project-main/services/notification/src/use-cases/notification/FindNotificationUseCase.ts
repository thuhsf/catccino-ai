import type { NotificationResponseDTO } from "@entities/notification/NotificationResponseDTO.js";
import type { INotificationRepository } from "@repositories/interfaces/INotificationRepository.js";

class FindNotificationUseCase {
    constructor(private readonly repository: INotificationRepository) { }

    async execute(id: string): Promise<NotificationResponseDTO> {
        if (!id) throw new Error("Id é obrigatório");

        const notification = await this.repository.findById(id);

        if (!notification) throw new Error("Notificação não encontrada");

        return {
            id: notification.getId(),
            orderId: notification.getOrderId(),
            type: notification.getType(),
            channel: notification.getChannel(),
            status: notification.getStatus(),
            sentAt: notification.getSentAt(),
            createdAt: notification.getCreatedAt(),
        };
    }
}

export { FindNotificationUseCase };