import type { ArrCategoryResponseDTO } from "@entities/category/CategoryResponseDTO.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";

class ListCategoryUseCase {
    constructor(private readonly repositoy: ICategoryRepository) { };

    async execute(): Promise<ArrCategoryResponseDTO> {
        const categories = await this.repositoy.listAll();

        return {
            categories: categories.map((category) => ({
                id: category.getId(),
                name: category.getName(),
                slug: category.getSlug()
            }))
        };

    };
};

export { ListCategoryUseCase };