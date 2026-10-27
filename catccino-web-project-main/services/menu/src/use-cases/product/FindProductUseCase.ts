import type { ProductResponseDTO } from "@entities/product/ProductResponseDTO.js";
import type { IProductRepository } from "@repositories/interfaces/IProductRepository.js";

class FindProductUseCase {
    constructor(private readonly repository: IProductRepository) { };

    async execute(id: string): Promise<ProductResponseDTO> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new Error("Esse produto não existe");
        };

        return {
            product: {
                id: product.getId(),
                name: product.getName(),
                description: product.getDescription(),
                price: product.getPrice(),
                categoryId: product.getCategoryId(),
                available: product.getAvailable(),
                imageUrl: product.getImageUrl(),
                thumbnailUrl: product.getThumbnailUrl(),
                createdAt: product.getCreatedAt(),
                updatedAt: product.getUpdatedAt(),
            }
        }
    };
};

export { FindProductUseCase };