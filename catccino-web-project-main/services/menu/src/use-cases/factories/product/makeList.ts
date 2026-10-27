import { ListProductUseCase } from "@use-cases/product/ListProductUseCase.js";
import type { IProductFactory } from "@repositories/interfaces/IProductRepository.js";

export function makeListProduct(productFactory: IProductFactory) {
    const productFact = productFactory.createRepository();
    const service = new ListProductUseCase(productFact);

    return service;
};