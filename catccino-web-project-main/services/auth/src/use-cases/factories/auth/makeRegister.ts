import type { IAuthFactory } from "@repositories/interfaces/IAuthRepository.js";
import type { ICustomerGateway } from "@services/interfaces/customer/ICustomerGateway.js";
import { RegisterUseCase } from "@use-cases/RegisterUseCase.js";

export function makeRegister(
    authFactory: IAuthFactory,
    customerGateway: ICustomerGateway,
) {
    const repository = authFactory.createRepository();
    const service = new RegisterUseCase(repository, customerGateway);

    return service;
}
