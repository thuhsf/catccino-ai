import type { Customer } from "@/entities/customer/Customer.js";

interface ICustomerRepository {
    create: (data: Customer) => Promise<Customer | null>;
    findByName: (name: string) => Promise<Customer | null>;
    findByEmail: (email: string) => Promise<Customer | null>;
    findById: (id: string) => Promise<Customer | null>;
    list: () => Promise<Customer[]>;
}

interface ICustomerFactory {
    createRepository(): ICustomerRepository;
}

export type { ICustomerRepository, ICustomerFactory };
