import type { Request, Response } from "express";
import { productSchema } from "@entities/product/schemas/ProductSchema.js";
import { makeCreateProduct } from "@use-cases/factories/product/makeCreate.js";
import { ProductFactory } from "@repositories/ProductRepository.js";
import { CategoryFactory } from "@repositories/CategoryRepository.js";
import { uploadProductImage, deleteProductImage } from "@/lib/aws/s3/index.js";
import { processImage } from "@/utils/imageProcessor.js";

async function RegisterProductController(req: Request, res: Response) {
    const uploadedKeys: string[] = [];

    try {
        const data = productSchema.parse(req.body);

        const productFact = new ProductFactory();
        const categoryFact = new CategoryFactory();
        const registerProduct = makeCreateProduct(productFact, categoryFact);

        let imageUrl = "";
        let thumbnailUrl = "";

        if (req.file) {
            const { image, thumbnail } = await processImage({ fileBuffer: req.file.buffer })

            const [uploadedImg, uploadedThumb] = await Promise.all([
                uploadProductImage({ fileBuffer: image, mimetype: "image/webp", folder: "products/800x800" }),
                uploadProductImage({ fileBuffer: thumbnail, mimetype: "image/webp", "folder": "products/200x200" }),
            ]);

            uploadedKeys.push(uploadedImg.key, uploadedThumb.key);

            imageUrl = uploadedImg.url;
            thumbnailUrl = uploadedThumb.url;
        }

        const product = await registerProduct.execute({
            product: {
                ...data,
                imageUrl,
                thumbnailUrl
            }
        });

        res
            .status(201)
            .json({
                message: "Produto criado com sucesso",
                status: 201,
                ...product
            });



    } catch (err: Error | any) {
        console.error(err);

        if (uploadedKeys.length > 0) {
            await Promise.all(uploadedKeys.map(deleteProductImage));
        }

        const isKnownError =
            err?.message === "Produto já existe" ||
            err?.message === "Categoria não encontrada";

        res.status(isKnownError ? 409 : 500).json({
            message: err?.message ?? "Erro ao criar produto",
            status: isKnownError ? 409 : 500
        });
    };
};


export { RegisterProductController };
