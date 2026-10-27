import type { IAuthFactory } from "@repositories/interfaces/IAuthRepository.js";
import type { ICustomerGateway } from "@services/interfaces/customer/ICustomerGateway.js";
import { LoginUseCase } from "@use-cases/LoginUseCase.js";

export function makeLogin(
    authFactory: IAuthFactory,
    customerGateway: ICustomerGateway,
) {
    const repository = authFactory.createRepository();
    const service = new LoginUseCase(repository, customerGateway);

    return service;
}
