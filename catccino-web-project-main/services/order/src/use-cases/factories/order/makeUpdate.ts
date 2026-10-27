import { UpdateOrderStatusUseCase } from "@use-cases/order/UpdateOrderStatusUseCase.js";
import type { IOrderFactory } from "@repositories/interfaces/IOrderRepository.js";

export function makeUpdateOrderStatus(orderFactory: IOrderFactory) {
    const orderFact = orderFactory.createRepository();
    const service = new UpdateOrderStatusUseCase(orderFact);

    return service;
};