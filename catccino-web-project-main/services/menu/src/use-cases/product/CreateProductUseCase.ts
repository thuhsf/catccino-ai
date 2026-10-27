import Product from "@entities/product/Product.js";
import type { ProductRequestDTO } from "@entities/product/ProductRequestDTO.js";
import type { ProductResponseDTO } from "@entities/product/ProductResponseDTO.js";
import type { ICategoryRepository } from "@repositories/interfaces/ICategoryRepository.js";
import type { IProductRepository } from "@repositories/interfaces/IProductRepository.js";

class CreateProductUseCase {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly categoryRepository: ICategoryRepository
    ) { }

    async execute(data: ProductRequestDTO): Promise<ProductResponseDTO> {
        const findProduct = await this.productRepository.findByName(data.product.name);

        if (findProduct) {
            throw new Error("Produto já existe");
        };

        const findCategory = await this.categoryRepository.findById(data.product.categoryId);

        if (!findCategory) {
            throw new Error("Categoria não encontrada");
        };

        const newProduct = new Product({
            name: data.product.name,
            description: data.product.description,
            price: data.product.price,
            categoryId: data.product.categoryId,
            available: data.product.available ?? false,
            imageUrl: data.product.imageUrl ?? "",
            thumbnailUrl: data.product.thumbnailUrl ?? ""
        });

        const createdProduct = await this.productRepository.create(newProduct);

        if (!createdProduct) {
            throw new Error("Falha ao criar produto");
        };

        return {
            product: {
                id: createdProduct.getId(),
                name: createdProduct.getName(),
                description: createdProduct.getDescription(),
                price: createdProduct.getPrice(),
                categoryId: createdProduct.getCategoryId(),
                available: createdProduct.getAvailable(),
                imageUrl: createdProduct.getImageUrl(),
                thumbnailUrl: createdProduct.getThumbnailUrl(),
                createdAt: createdProduct.getCreatedAt(),
                updatedAt: createdProduct.getUpdatedAt()
            }
        };
    };
};

export default CreateProductUseCase;
