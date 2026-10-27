import type { IOrderFactory } from "@repositories/interfaces/IOrderRepository.js";
import type { IProductGateway } from "@services/interfaces/product/IProductGateway.js";
import { CreateOrderUseCase } from "@use-cases/order/CreateOrderUseCase.js";
import type { Producer } from "kafkajs";

export function makeCreateOrder(orderFactory: IOrderFactory, productGateway: IProductGateway, producer: Producer) {

    const orderFact = orderFactory.createRepository();

    const service = new CreateOrderUseCase(orderFact, productGateway, producer);

    return service;
}