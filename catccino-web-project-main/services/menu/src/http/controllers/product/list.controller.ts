import type { Request, Response } from "express";
import listProductQuerySchema from "@entities/product/schemas/ListProductSchema.js";
import { ProductFactory } from "@repositories/ProductRepository.js";
import { makeListProduct } from "@use-cases/factories/product/makeList.js";

async function ListProductControlelr(req: Request, res: Response) {
    try {

        const { name } = listProductQuerySchema.parse(req.query);

        const factory = new ProductFactory();
        const listProduct = makeListProduct(factory);

        const product = await listProduct.execute({ name });

        return res.status(200).json({ ...product });

    } catch (err: Error | any) {
        console.error(err);

        res
            .status(400)
            .json({
                status: 400,
                message: "Houve um erro interno",
                error: err
            });
    };
};

export { ListProductControlelr };
