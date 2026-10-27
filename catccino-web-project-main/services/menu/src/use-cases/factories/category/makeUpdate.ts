import type { ICategoryFactory } from "@repositories/interfaces/ICategoryRepository.js";
import { UpdateCategoryUseCase } from "@use-cases/category/UpdateCategoryUsecase.js";

export function makeUpdateCategory(categoryFactory: ICategoryFactory) {
    const factory = categoryFactory.createRepository();
    const service = new UpdateCategoryUseCase(factory);

    return service;
}
