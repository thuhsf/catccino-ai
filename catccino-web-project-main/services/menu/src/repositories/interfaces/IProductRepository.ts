import type Product from "@entities/product/Product.js";

export interface IProductRepository {
    create: (data: Product) => Promise<Product | null>;
    update: (data: Product) => Promise<Product | null>;
    listAll(): Promise<Product[]>;
    findByName: (name: string) => Promise<Product | null>;
    searchByName: (name: string) => Promise<Product[]>;
    findById: (id: string) => Promise<Product | null>;
};

export interface IProductFactory {
    createRepository(): IProductRepository;
};
