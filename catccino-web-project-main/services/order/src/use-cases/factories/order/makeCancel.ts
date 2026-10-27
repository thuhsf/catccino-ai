import type { IOrderFactory } from "@repositories/interfaces/IOrderRepository.js";
import { CancelOrderUseCase } from "@use-cases/order/CancelOrderUseCase.js";

export function MakeCancelOrderUseCase(orderFactory: IOrderFactory) {

    const orderFact = orderFactory.createRepository();

    const service = new CancelOrderUseCase(orderFact);

    return service;
}