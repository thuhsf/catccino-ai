import type { IOrderFactory } from "@repositories/interfaces/IOrderRepository.js";
import { FindOrderUseCase } from "@use-cases/order/FindOrderUseCase.js";

export function makeFindOrder(orderFactory: IOrderFactory) {

    const orderFact = orderFactory.createRepository();
    const service = new FindOrderUseCase(orderFact);

    return service;
};
