import { Notification } from "@entities/notification/Notification.js";
import type { CreateNotificationRequestDTO } from "@entities/notification/NotificationRequestDTO.js";
import type { NotificationResponseDTO } from "@entities/notification/NotificationResponseDTO.js";
import type { INotificationRepository } from "@repositories/interfaces/INotificationRepository.js";

class SendNotificationUseCase {
    constructor(private readonly repository: INotificationRepository) { }

    async execute(data: CreateNotificationRequestDTO): Promise<NotificationResponseDTO> {
        const notification = new Notification({
            orderId: data.orderId,
            type: data.type,
            channel: data.channel,
        });

        const created = await this.repository.create(notification);

        if (!created) {
            throw new Error("Falha ao criar notificação");
        }

        try {
            // aqui entraria a integração real (ex: SendGrid, Twilio, Firebase)
            // por ora simula o envio e marca como enviada
            created.markSent();
        } catch {
            created.markFailed();
        }

        const updated = await this.repository.update(created);

        if (!updated) {
            throw new Error("Falha ao atualizar status da notificação");
        }

        return {
            id: updated.getId(),
            orderId: updated.getOrderId(),
            type: updated.getType(),
            channel: updated.getChannel(),
            status: updated.getStatus(),
            sentAt: updated.getSentAt(),
            createdAt: updated.getCreatedAt(),
        };
    }
}

export { SendNotificationUseCase };