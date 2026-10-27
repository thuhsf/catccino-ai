import { FindProductUseCase } from "@use-cases/product/FindProductUseCase.js";
import type { IProductFactory } from "@repositories/interfaces/IProductRepository.js";

export function makeFindProduct(productFactory: IProductFactory) {
    const productFact = productFactory.createRepository();
    const service = new FindProductUseCase(productFact);

    return service;
}
