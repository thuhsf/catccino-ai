import { apiEnvConfig } from "@config/apiConfig.js";
import axios, { type AxiosInstance } from "axios";
import type { IProductGateway } from "@services/interfaces/product/IProductGateway.js";

class ProductGateway implements IProductGateway {

    private readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: apiEnvConfig.apiMenu
        });
    };

    async findProductById(productId: string) {
        const res = await this.api.get(`/products/${productId}`);

        return res.data.product;
    };

    async findProductByName(productName: string) {
        const res = await this.api.get(
            `/products?name=${productName}`
        );

        return res.data;
    };

    async findProducts() {
        const res = await this.api.get(
            "/products"
        );

        return res.data;
    };
};


export { ProductGateway };