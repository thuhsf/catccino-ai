import type { IProductFactory } from "@repositories/interfaces/IProductRepository.js";
import CreateProductUseCase from "@use-cases/product/CreateProductUseCase.js";
import type { ICategoryFactory } from "@repositories/interfaces/ICategoryRepository.js";

export function makeCreateProduct(productFactory: IProductFactory, categoryFactory: ICategoryFactory) {
    const productFact = productFactory.createRepository();
    const categoryFact = categoryFactory.createRepository();
    const service = new CreateProductUseCase(productFact, categoryFact);

    return service;
}
