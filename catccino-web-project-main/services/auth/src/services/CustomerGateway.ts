import { apiEnvConfig } from "@config/apiConfig.js";
import axios, { type AxiosInstance } from "axios";
import type { ICustomerGateway } from "@services/interfaces/customer/ICustomerGateway.js";
import type { CustomerDTO } from "@services/interfaces/customer/CustomerDTO.js";

class CustomerGateway implements ICustomerGateway {

    private readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: apiEnvConfig.apiCustomer
        });
    };

    async createCustomer(data: {
        name: string;
        email: string;
        phone: string;
    }): Promise<CustomerDTO> {
        const res = await this.api.post("/customers", data);

        const { id, name, email, phone, created_at, updated_at } = res.data;

        return { id, name, email, phone, created_at, updated_at };
    };

    async findCustomerById(customerId: string): Promise<CustomerDTO | null> {
        try {
            const res = await this.api.get(`/customers/${customerId}`);

            return res.data.customer ?? null;
        } catch (err: any) {
            if (err.response?.status === 404) {
                return null;
            }

            throw err;
        }
    };
};

export { CustomerGateway };
