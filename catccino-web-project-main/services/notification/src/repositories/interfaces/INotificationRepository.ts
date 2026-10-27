import type { Notification } from "@entities/notification/Notification.js";

export interface INotificationRepository {
    create(data: Notification): Promise<Notification | null>;
    findById(id: string): Promise<Notification | null>;
    findByOrderId(orderId: string): Promise<Notification[]>;
    update(data: Notification): Promise<Notification | null>;
};

export interface INotificationFactory {
    createRepository(): INotificationRepository;
};