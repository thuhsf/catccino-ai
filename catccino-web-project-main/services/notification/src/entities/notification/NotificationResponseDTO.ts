import type { NotificationChannel, NotificationStatus, NotificationType } from "@entities/notification/Notification.js";

export interface NotificationResponseDTO {
    id: string;
    orderId: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    sentAt: Date | null;
    createdAt: Date;
};

export interface ArrNotificationResponseDTO {
    notifications: NotificationResponseDTO[];
};