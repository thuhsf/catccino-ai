import { ListNotificationsByOrderUseCase } from "@use-cases/notification/ListNotificationsByOrderUseCase.js";
import type { INotificationFactory } from "@repositories/interfaces/INotificationRepository.js";

export function makeListNotificationsByOrder(factory: INotificationFactory) {
    return new ListNotificationsByOrderUseCase(factory.createRepository());
}