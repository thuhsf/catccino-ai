import type { NotificationChannel, NotificationType } from "@entities/notification/Notification.js";

export interface CreateNotificationRequestDTO {
    orderId: string;
    type: NotificationType;
    channel: NotificationChannel;
};