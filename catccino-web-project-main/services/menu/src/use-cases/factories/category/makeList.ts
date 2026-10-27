import type { ICategoryFactory } from "@repositories/interfaces/ICategoryRepository.js";
import { ListCategoryUseCase } from "@use-cases/category/ListCategoryUseCase.js";

export function makeListCategory(categoryFactory: ICategoryFactory) {
    const factory = categoryFactory.createRepository();
    const service = new ListCategoryUseCase(factory);

    return service;
}
