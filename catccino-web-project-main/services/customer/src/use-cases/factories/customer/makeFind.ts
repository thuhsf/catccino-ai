import type { ICustomerFactory } from "@/repositories/interfaces/ICustomerRepository.js";
import { FindCustomerUseCase } from "@/use-cases/FindCustomerUseCase.js";

export function makeFindCustomer(customerFactory: ICustomerFactory) {
    const repository = customerFactory.createRepository();
    const service = new FindCustomerUseCase(repository);

    return service;
}
