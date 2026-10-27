import type { ICategoryFactory } from "@repositories/interfaces/ICategoryRepository.js";
import { DeleteCategoryUseCase } from "@use-cases/category/DeleteCategoryUseCase.js";

export function makeDeleteCategory(categoryFactory: ICategoryFactory) {
    const factory = categoryFactory.createRepository();
    const service = new DeleteCategoryUseCase(factory);

    return service;
}
