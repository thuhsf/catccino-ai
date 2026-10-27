import type { CustomerDTO } from "@services/interfaces/customer/CustomerDTO.js";

export interface ICustomerGateway {
    createCustomer(data: {
        name: string;
        email: string;
        phone: string;
    }): Promise<CustomerDTO>;
    findCustomerById(customerId: string): Promise<CustomerDTO | null>;
};
