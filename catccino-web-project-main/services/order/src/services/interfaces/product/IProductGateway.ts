import type { ProductDTO } from "@services/interfaces/product/ProductDTO.js";

export interface IProductGateway {
    findProductById(product: string): Promise<ProductDTO>;
    findProductByName(name: string): Promise<ProductDTO[]>;
    findProducts(): Promise<ProductDTO[]>;
};