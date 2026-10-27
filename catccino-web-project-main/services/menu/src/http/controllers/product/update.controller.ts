import type { Request, Response } from "express";
import { ProductFactory } from "@repositories/ProductRepository.js";
import { makeUpdateProduct } from "@use-cases/factories/product/makeUpdate.js";
import { updateProductSchema } from "@/entities/product/schemas/ProductSchema.js";

async function UpdateProductController(req: Request, res: Response) {
    try {

        const id = req.params.id as string | undefined;

        if (id == undefined) {
            throw new Error("Id não reconhecido ou incompleto");
        };

        const data = updateProductSchema.parse(req.body);

        const factory = new ProductFactory();
        const updateProduct = makeUpdateProduct(factory);

        const product = await updateProduct.execute({ product: { id, ...data } });

        return res.status(200).json({ ...product });

    } catch (err) {
        console.error(err);

        res
            .status(400)
            .json({
                status: 400,
                message: "Houve um erro interno",
                err: err
            });
    };
};

export { UpdateProductController };