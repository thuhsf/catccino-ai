import { CreatePaymentUseCase } from "@use-cases/CreatePaymentUseCase.js";
import type { IPaymentFactory } from "@repositories/interfaces/IPaymentRepository.js";

export function makeCreatePayment(factory: IPaymentFactory) {
    const repository = factory.createRepository();
    const service = new CreatePaymentUseCase(repository);

    return service;
}