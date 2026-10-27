import { SendNotificationUseCase } from "@use-cases/notification/SendNotificationUseCase.js";
import type { INotificationFactory } from "@repositories/interfaces/INotificationRepository.js";

export function makeSendNotification(factory: INotificationFactory) {
    return new SendNotificationUseCase(factory.createRepository());
}