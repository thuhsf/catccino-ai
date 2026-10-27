import type { ProductRequestDTO, UpdateProductRequestDTO } from "@entities/product/ProductRequestDTO.js";
import type { ProductResponseDTO } from "@entities/product/ProductResponseDTO.js";
import type { IProductRepository } from "@repositories/interfaces/IProductRepository.js";

class UpdateProductUseCase {

    constructor(private readonly repository: IProductRepository) { };

    async execute(data: UpdateProductRequestDTO): Promise<ProductResponseDTO> {


        if (!data.product.id) {
            throw new Error("Id é obrigatório");
        };

        const product = await this.repository.findById(data.product.id);

        if (!product) {
            throw new Error("Produto não encontrado");
        };

        if (data.product.available == true) {
            product.activate();
        } else if (data.product.available == false) {
            product.deactivate();
        };

        if (data.product.name !== undefined) {
            product.rename(data.product.name);
        };

        if (data.product.description !== undefined) {
            product.changeDescription(data.product.description);
        };

        if (data.product.price !== undefined) {
            product.changePrice(data.product.price);
        };

        if (data.product.imageUrl) {
            product.changeImage(data.product.imageUrl);
        };

        if (data.product.thumbnailUrl) {
            product.changeThumbnail(data.product.thumbnailUrl);
        };

        const updatedProduct = await this.repository.update(product);

        if (!updatedProduct) {
            throw new Error("Erro ao atualizar os dados de produto");
        };

        return {
            product: {
                id: updatedProduct.getId(),
                categoryId: updatedProduct.getCategoryId(),
                available: updatedProduct.getAvailable(),
                name: updatedProduct.getName(),
                description: updatedProduct.getDescription(),
                price: updatedProduct.getPrice(),
                imageUrl: updatedProduct.getImageUrl(),
                thumbnailUrl: updatedProduct.getThumbnailUrl(),
                createdAt: updatedProduct.getCreatedAt(),
                updatedAt: updatedProduct.getUpdatedAt()
            }
        };
    };
};

export { UpdateProductUseCase };