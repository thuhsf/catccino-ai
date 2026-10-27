import type { CategoryResponseDTO } from "@entities/category/CategoryResponseDTO.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";

class DeleteCategoryUseCase {

    constructor(private readonly repository: ICategoryRepository) { };

    async execute(id: string): Promise<CategoryResponseDTO> {
        if (!id) {
            throw new Error("Id é obrigatório");
        }

        const category = await this.repository.findById(id);

        if (!category) {
            throw new Error("Essa categoria não existe");
        };

        const deleteCategory = await this.repository.delete(id);

        if (!deleteCategory) {
            throw new Error("Impossível deletar essa categoria");
        };

        return {
            id: deleteCategory.getId(),
            name: deleteCategory.getName(),
            slug: deleteCategory.getSlug()
        }
    };
};

export { DeleteCategoryUseCase };