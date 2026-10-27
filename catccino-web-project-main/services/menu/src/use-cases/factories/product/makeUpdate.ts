import { UpdateProductUseCase } from "@use-cases/product/UpdateProductUseCase.js";
import type { IProductFactory } from "@repositories/interfaces/IProductRepository.js";

export function makeUpdateProduct(productFactory: IProductFactory) {
    const productFact = productFactory.createRepository();
    const service = new UpdateProductUseCase(productFact);

    return service;
}
