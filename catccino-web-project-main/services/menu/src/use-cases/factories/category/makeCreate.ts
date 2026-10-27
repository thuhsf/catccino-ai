import type { ICategoryFactory } from "@repositories/interfaces/ICategoryRepository.js";
import CreateCategoryUseCase from "@use-cases/category/CreateCategoryUseCase.js";

export function makeCreateCategory(categoryFactory: ICategoryFactory) {
    const factory = categoryFactory.createRepository();
    const service = new CreateCategoryUseCase(factory);

    return service;
}
