import { Customer } from "@/entities/customer/Customer.js";
import type { CustomerRequestDTO } from "@/entities/customer/CustomerRequestDTO.js";
import type { CustomerResponseDTO } from "@/entities/customer/CustomerResponseDTO.js";
import type { ICustomerRepository } from "@/repositories/interfaces/ICustomerRepository.js";

class CustomerRegisterUseCase {
    constructor(private readonly repository: ICustomerRepository) {}

    async execute(data: CustomerRequestDTO): Promise<CustomerResponseDTO> {
        const customerExists = await this.repository.findByName(data.name);

        if (customerExists) {
            throw new Error("Customer already exists!");
        }

        const emailInUse = await this.repository.findByEmail(data.email);

        if (emailInUse) {
            throw new Error("E-mail já está em uso");
        }

        const newCustomer = new Customer({
            name: data.name,
            email: data.email,
            phone: data.phone,
        });

        const createdCustomer = await this.repository.create(newCustomer);

        if (!createdCustomer) {
            throw new Error("Customer not created!");
        }

        return {
            id: createdCustomer.getId(),
            name: createdCustomer.getName(),
            email: createdCustomer.getEmail(),
            phone: createdCustomer.getPhone(),
            created_at: createdCustomer.getCreatedAt(),
            updated_at: createdCustomer.getUpdatedAt(),
        };
    }
}

export { CustomerRegisterUseCase };
