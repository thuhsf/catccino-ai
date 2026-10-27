import type { CustomerResponseDTO } from "@/entities/customer/CustomerResponseDTO.js";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository.js";

class ListCustomersUseCase {
    constructor(private readonly repository: ICustomerRepository) {}

    async execute(): Promise<CustomerResponseDTO[]> {
        const customers = await this.repository.list();

        return customers.map((customer) => ({
            id: customer.getId(),
            name: customer.getName(),
            email: customer.getEmail(),
            phone: customer.getPhone(),
            created_at: customer.getCreatedAt(),
            updated_at: customer.getUpdatedAt(),
        }));
    }
}

export { ListCustomersUseCase };
