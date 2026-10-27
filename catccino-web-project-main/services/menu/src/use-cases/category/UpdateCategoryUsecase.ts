import type { CategoryRequestDTO } from "@entities/category/CategoryRequestDTO.js";
import type { CategoryResponseDTO } from "@entities/category/CategoryResponseDTO.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";

class UpdateCategoryUseCase {
    constructor(private readonly repository: ICategoryRepository) { };

    async execute(data: CategoryRequestDTO): Promise<CategoryResponseDTO> {

        if (!data.id) {
            throw new Error("Id obrigatório");
        };

        const category = await this.repository.findById(data.id);

        if (!category) {
            throw new Error(
                "Categoria não encontrada"
            );
        };

        if (data.name !== undefined) {
            category.rename(data.name);
        };

        if (data.slug !== undefined) {
            category.changeSlug(data.slug);
        };

        const updatedCategory = await this.repository.update(category);

        if (!updatedCategory) {
            throw new Error(
                "Falha ao atualizar categoria"
            );
        };

        return {
            id: updatedCategory.getId(),
            name: updatedCategory.getName(),
            slug: updatedCategory.getSlug(),
        };
    };
};

export { UpdateCategoryUseCase };