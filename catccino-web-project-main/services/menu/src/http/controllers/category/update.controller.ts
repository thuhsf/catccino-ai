import type { Request, Response } from "express";
import categorySchema from "@entities/category/schemas/CategorySchema.js";
import { CategoryFactory } from "@repositories/CategoryRepository.js";
import { makeUpdateCategory } from "@use-cases/factories/category/makeUpdate.js";

async function UpdateCategoryController(
    req: Request,
    res: Response
) {
    try {
        const id = req.params.id as string | undefined;

        if (id == undefined) {
            throw new Error("Id não reconhecido ou incompleto");
        };

        const data = categorySchema.parse(req.body);

        const factory = new CategoryFactory();
        const updateCategory = makeUpdateCategory(factory);

        const category = await updateCategory.execute({
            id,
            ...data,
        });

        return res.status(200).json({
            category: { ...category }
        });

    } catch (err: any) {
        console.error(err);

        return res.status(400).json({
            error: err.message,
        });
    };
};

export { UpdateCategoryController };