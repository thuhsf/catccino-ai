import type { IOrderFactory } from "@repositories/interfaces/IOrderRepository.js";
import { ListOrderByCustomerUseCase } from "@use-cases/order/ListOrderByCustomersUseCase.js";

export function makeListOrderByCustomer(orderFactory: IOrderFactory) {
    const orderFact = orderFactory.createRepository();

    const service = new ListOrderByCustomerUseCase(orderFact);

    return service;
};