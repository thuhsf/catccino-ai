import type { LisproductRequestDTO } from "@entities/product/ListProductRequestDTO.js";
import type { ArrProductResponseDTO } from "@entities/product/ProductResponseDTO.js";
import type { IProductRepository } from "@repositories/interfaces/IProductRepository.js";

class ListProductUseCase {
    constructor(private readonly repository: IProductRepository) { };

    async execute(data: LisproductRequestDTO): Promise<ArrProductResponseDTO> {
        const products = data.name
            ? await this.repository.searchByName(data.name)
            : await this.repository.listAll();

        return {
            products: products.map((product) => ({
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
            }))
        };
    };
};


export { ListProductUseCase };
