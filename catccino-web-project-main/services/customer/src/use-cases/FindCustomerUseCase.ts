import type { CustomerResponseDTO } from "@/entities/customer/CustomerResponseDTO.js";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository.js";

class FindCustomerUseCase {
    constructor(private readonly repository: ICustomerRepository) {}

    async execute(id: string): Promise<CustomerResponseDTO> {
        const customer = await this.repository.findById(id);

        if (!customer) {
            throw new Error("Customer not found");
        }

        return {
            id: customer.getId(),
            name: customer.getName(),
            email: customer.getEmail(),
            phone: customer.getPhone(),
            created_at: customer.getCreatedAt(),
            updated_at: customer.getUpdatedAt(),
        };
    }
}

export { FindCustomerUseCase };
