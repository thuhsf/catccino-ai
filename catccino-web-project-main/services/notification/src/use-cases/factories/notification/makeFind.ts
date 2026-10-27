import { FindNotificationUseCase } from "@use-cases/notification/FindNotificationUseCase.js";
import type { INotificationFactory } from "@repositories/interfaces/INotificationRepository.js";

export function makeFindNotification(factory: INotificationFactory) {
    return new FindNotificationUseCase(factory.createRepository());
}