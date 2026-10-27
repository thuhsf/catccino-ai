import { FindPaymentUseCase } from "@use-cases/FindPaymentUseCase.js";
import type { IPaymentFactory } from "@repositories/interfaces/IPaymentRepository.js";

export function makeFindPayment(factory: IPaymentFactory) {
    const repository = factory.createRepository();
    const service = new FindPaymentUseCase(repository);

    return service;
}