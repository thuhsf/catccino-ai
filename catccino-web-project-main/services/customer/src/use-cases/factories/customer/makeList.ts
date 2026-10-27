import type { ICustomerFactory } from "@/repositories/interfaces/ICustomerRepository.js";
import { ListCustomersUseCase } from "@/use-cases/ListCustomersUseCase.js";

export function makeListCustomers(customerFactory: ICustomerFactory) {
    const repository = customerFactory.createRepository();
    const service = new ListCustomersUseCase(repository);

    return service;
}
