import type { CategoryResponseDTO } from "@entities/category/CategoryResponseDTO.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";

class FindCategoryUseCase {

    constructor(private readonly repository: ICategoryRepository) { };

    async execute(id: string): Promise<CategoryResponseDTO> {

        if (!id) {
            throw new Error("Id é obrigatório");
        };

        const category = await this.repository.findById(id);

        if (!category) {
            throw new Error("Essa categoria não existe");
        };

        return {
            id: category.getId(),
            name: category.getName(),
            slug: category.getSlug()
        }
    };
};

export { FindCategoryUseCase };