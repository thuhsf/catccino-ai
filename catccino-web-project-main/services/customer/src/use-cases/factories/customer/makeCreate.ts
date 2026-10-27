import type { ICustomerFactory } from "@/repositories/interfaces/ICustomerRepository.js";
import { CustomerRegisterUseCase } from "@/use-cases/CustomerRegisterUseCase.js";

export function makeCreateCustomer(customerFactory: ICustomerFactory) {
    const repository = customerFactory.createRepository();
    const service = new CustomerRegisterUseCase(repository);

    return service;
}
