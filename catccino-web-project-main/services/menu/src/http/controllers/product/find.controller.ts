import type { Request, Response } from "express";
import { ProductFactory } from "@repositories/ProductRepository.js";
import { makeFindProduct } from "@use-cases/factories/product/makeFind.js";

async function FindProductController(req: Request, res: Response) {
    try {

        const id = req.params.id as string | undefined;

        if (id == undefined) {
            throw new Error("Id não reconhecido ou incompleto");
        };

        const factory = new ProductFactory();
        const findProduct = makeFindProduct(factory);

        const product = await findProduct.execute(id);

        return res.status(200).json({ ...product });

    } catch (err) {
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

export { FindProductController };