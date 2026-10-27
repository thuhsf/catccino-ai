import type { Request, Response } from "express";
import categorySchema from "@entities/category/schemas/CategorySchema.js";
import { CategoryFactory } from "@repositories/CategoryRepository.js";
import { makeCreateCategory } from "@use-cases/factories/category/makeCreate.js";

async function RegisterCategoryController(req: Request, res: Response) {
    try {
        const { name, slug } = categorySchema.parse(req.body);

        const factory = new CategoryFactory();
        const createCategory = makeCreateCategory(factory);

        const category = await createCategory.execute({ name, slug });

        res
            .status(201)
            .json({
                message: "Categoria criada com sucesso",
                status: 201,
                category: { ...category }
            });

    } catch (err: Error | any) {
        console.error(err);
        res
            .status(400)
            .json({
                error: err.message,
            });
    };
};


export { RegisterCategoryController };
