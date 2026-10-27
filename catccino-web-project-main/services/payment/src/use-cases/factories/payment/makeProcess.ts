import { ProcessPaymentUseCase } from "@use-cases/ProcessPaymentUseCase.js";
import type { IPaymentFactory } from "@repositories/interfaces/IPaymentRepository.js";
import type { Producer } from "kafkajs";

export function makeProcessPayment(factory: IPaymentFactory, producer: Producer) {
    const repository = factory.createRepository();
    const service = new ProcessPaymentUseCase(repository, producer);

    return service;
}